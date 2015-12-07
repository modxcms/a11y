Ext.onReady(function() {
    Ext.override(MODx.panel.Resource, {
        getPageHeader: function (config) {
            config = config || {record: {}};
            return {
                html: '<h1>' + _('document_new') + '</h1>'
                , id: 'modx-resource-header'
                , cls: 'modx-page-header'
                , border: false
                , forceLayout: true
                , anchor: '100%'
            };
        }
        
        ,setup: function() {
            if (!this.initialized) {
                this.getForm().setValues(this.config.record);
                var pcmb = this.getForm().findField('parent-cmb');
                if (pcmb && Ext.isEmpty(this.config.record.parent_pagetitle)) {
                    pcmb.setValue('');
                } else if (pcmb) {
                    pcmb.setValue(this.config.record.parent_pagetitle+' ('+this.config.record.parent+')');
                }
                if (!Ext.isEmpty(this.config.record.pagetitle)) {
                    Ext.getCmp('modx-resource-header').getEl().update('<h1>'+Ext.util.Format.stripTags(this.config.record.pagetitle)+'</h1>');
                }
                if (!Ext.isEmpty(this.config.record.resourceGroups)) {
                    var g = Ext.getCmp('modx-grid-resource-security');
                    if (g && Ext.isEmpty(g.config.url)) {
                        var s = g.getStore();
                        if (s) { s.loadData(this.config.record.resourceGroups); }
                    }
                }

                this.defaultClassKey = this.config.record.class_key || this.defaultClassKey;
                this.defaultValues = this.config.record || {};
                if ((this.config.record && this.config.record.richtext) || MODx.request.reload || MODx.request.activeSave == 1) {
                    this.markDirty();
                }

                // Prevent accidental navigation when stuff has not been saved
                if (MODx.config.confirm_navigation == 1) {
                    var panel = this;
                    window.onbeforeunload = function() {
                        if (panel.warnUnsavedChanges) return _('unsaved_changes');
                    };
                }

                if (this.config.record.deleted) {
                    this.handlePreview('hide');
                }
            }
            if (MODx.config.use_editor && MODx.loadRTE) {
                var f = this.getForm().findField('richtext');
                if (f && f.getValue() == 1 && !this.rteLoaded) {
                    MODx.loadRTE(this.rteElements);
                    this.rteLoaded = true;
                } else if (f && f.getValue() == 0 && this.rteLoaded) {
                    if (MODx.unloadRTE) {
                        MODx.unloadRTE(this.rteElements);
                    }
                    this.rteLoaded = false;
                }
            }

            this.fireEvent('ready');
            this.initialized = true;

            MODx.fireEvent('ready');
            MODx.sleep(4); /* delay load event to allow FC rules to move before loading RTE */
            if (MODx.afterTVLoad) { MODx.afterTVLoad(); }
            this.fireEvent('load');
            
            var form = this.getForm();
            form.findField('pagetitle').el.dom.setAttribute('aria-required', true);
            
            var content = Ext.getCmp('modx-resource-content');
            
            if (content) {
                var contentTitle = content.header.dom.getElementsByClassName('x-panel-header-text')[0];
                contentTitle.innerHTML = '<h2>' + contentTitle.innerHTML + '</h2>';
            }
            
            /* ONE ELEMENT AT A TIME - @dubrod
            var hidemenuBox = Ext.getCmp('modx-resource-hidemenu');
            if (hidemenuBox) {
	            
	            hidemenuBox.on('focus', function(){
		            thisToggId = this.id;
	                var thisToggEl = document.getElementById(thisToggId);
			        thisToggEl.onkeydown = function(evt) {
		                evt = evt || window.event;
		                if(evt.keyCode == 13){
			                if ( hidemenuBox.el.dom.checked ){
								hidemenuBox.setValue(0);
			                } else {
				                hidemenuBox.setValue(1);
			                }			                
		                }
		            };
	            });
            }
            */
            
        }
    });
       
 
});

Ext.form.MessageTargets = {
    'qtip' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            field.el.dom.qtip = msg;
            field.el.dom.qclass = 'x-form-invalid-tip';
            if(Ext.QuickTips){ // fix for floating editors interacting with DND
                Ext.QuickTips.enable();
            }
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            field.el.dom.qtip = '';
        }
    },
    'title' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            field.el.dom.title = msg;
        },
        clear: function(field){
            field.el.dom.title = '';
        }
    },
    'under' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            if(!field.errorEl){
                var elp = field.getErrorCt();
                if(!elp){ // field has no container el
                    field.el.dom.title = msg;
                    return;
                }
                field.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                field.errorEl.dom.setAttribute('aria-live', 'assertive');

                field.el.dom.setAttribute('aria-describedby', field.errorEl.id);
                
                field.on('resize', field.alignErrorEl, field);
                field.on('destroy', function(){
                    Ext.destroy(this.errorEl);
                }, field);
            }
            field.alignErrorEl();
            field.errorEl.update(msg);
            Ext.form.Field.msgFx[field.msgFx].show(field.errorEl, field);
            field.focus();
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            if(field.errorEl){
                Ext.form.Field.msgFx[field.msgFx].hide(field.errorEl, field);
            }else{
                field.el.dom.title = '';
            }
        }
    },
    'side' : {
        mark: function(field, msg){
            field.el.addClass(field.invalidClass);
            if(!field.errorIcon){
                var elp = field.getErrorCt();
                // field has no container el
                if(!elp){
                    field.el.dom.title = msg;
                    return;
                }
                field.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
                if (field.ownerCt) {
                    field.ownerCt.on('afterlayout', field.alignErrorIcon, field);
                    field.ownerCt.on('expand', field.alignErrorIcon, field);
                }
                field.on('resize', field.alignErrorIcon, field);
                field.on('destroy', function(){
                    Ext.destroy(this.errorIcon);
                }, field);
            }
            field.alignErrorIcon();
            field.errorIcon.dom.qtip = msg;
            field.errorIcon.dom.qclass = 'x-form-invalid-tip';
            field.errorIcon.show();
        },
        clear: function(field){
            field.el.removeClass(field.invalidClass);
            if(field.errorIcon){
                field.errorIcon.dom.qtip = '';
                field.errorIcon.hide();
            }else{
                field.el.dom.title = '';
            }
        }
    }
       
};

Ext.override(Ext.form.Checkbox,{
    checkboxOriginals: {
        initComponent: Ext.form.Checkbox.prototype.initComponent
    },
    
    initComponent : function(){
        this.checkboxOriginals.initComponent.call(this);
        
        this.on('specialkey', function(checkbox, e){
            if (e.getKey() == Ext.EventObject.ENTER) {
                this.setValue(!this.getValue())
            }          
        });
    }
});

Ext.override(Ext.Panel, {
    panelOriginals: {
        onRender: Ext.Panel.prototype.onRender
    },
    
    onRender: function(ct, position){
        this.panelOriginals.onRender.call(this, ct, position);

        if(this.collapsible && this.tools && this.tools.toggle) {
            this.tools.toggle.on('keydown', function(e) {
               if (e.getKey() == Ext.EventObject.ENTER) {
                    this.toggleCollapse();    
               }              
            }, this);

            this.on('collapse', function(){
                this.tools.toggle.dom.setAttribute('aria-expanded', false);
            });

            this.on('expand', function(){
                this.tools.toggle.dom.setAttribute('aria-expanded', true);
            });

            this.tools.toggle.dom.setAttribute('aria-label', "Hide " + (this.title || "")  + " Field");
            this.tools.toggle.dom.setAttribute('tabindex', "0");
            this.tools.toggle.dom.innerHTML = '<span class="sr-only">Hide ' + (this.title || '')  + ' Field</span>';

            this.tools.toggle.dom.setAttribute('aria-expanded', !this.collapsed);
            this.tools.toggle.dom.setAttribute('aria-controls', this.bwrap.dom.id);
            if (this.title) {
                this.bwrap.dom.setAttribute('aria-label', this.title);
            }
        }
    }
});

Ext.override(Ext.TabPanel, {
    tabOriginals: {
        onRender: Ext.TabPanel.prototype.onRender,
        initTab: Ext.TabPanel.prototype.initTab,
        initComponent: Ext.TabPanel.prototype.initComponent
    },

    initComponent: function(){
        this.tabOriginals.initComponent.call(this);
        
        this.on('beforetabchange', function(tabs, newTab, currentTab){
            newTab.tabEl.setAttribute('tabindex', '0');
            newTab.tabEl.setAttribute('aria-selected', 'true');
            
            if (newTab.el && newTab.el.dom) {
                newTab.el.dom.setAttribute('aria-hidden', 'false');    
            }
            
            if (currentTab) {
                currentTab.tabEl.setAttribute('tabindex', '-1');
                currentTab.tabEl.setAttribute('aria-selected', 'false');
                
                if (currentTab.el && currentTab.el.dom) {
                    currentTab.el.dom.setAttribute('aria-hidden', 'true');
                }
            }
        });
    },
    
    onRender: function(ct, position){
        this.tabOriginals.onRender.call(this, ct, position);
        
        this.strip.dom.setAttribute('role', 'tablist');
    },

    initTab: function(item, index) {
        this.tabOriginals.initTab.call(this, item, index);
        
        item.tabEl.setAttribute('tabindex', '-1');
        item.tabEl.setAttribute('aria-selected', 'false');
        
        item.on('render', function(tab) {
            tab.el.dom.setAttribute('aria-labelledby', tab.tabEl.id);                
            tab.el.dom.setAttribute('role', 'tabpanel');                
            tab.el.dom.setAttribute('aria-hidden', 'true');
            
            tab.el.insertFirst({
                tag: 'h2',
                cls: 'sr-only',
                html: tab.title
            });
        }, this, {single: true});
    }
});