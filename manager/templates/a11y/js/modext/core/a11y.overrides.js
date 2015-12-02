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
                
                //set global variable to attach "ENTER" button trigger
                //contentToggleEl = content.tools.toggle.dom.setAttribute('aria-controls', content.bwrap.dom.id);
                
                //Toggle Div attributes
                content.tools.toggle.dom.setAttribute('aria-label', "Hide Content Field"); 
                content.tools.toggle.dom.setAttribute('tabindex', "0"); 
                content.tools.toggle.dom.innerHTML = '<span class="sr-only">Hide Content Field</span>';
                
                //Toggle Actions
                content.tools.toggle.on('focus', function(){
	                //console.log("bazinga");
	                thisToggId = this.id;
	                var thisToggEl = document.getElementById(thisToggId);
			        thisToggEl.onkeydown = function(evt) {
		                evt = evt || window.event;
		                //alert("keydown: " + evt.keyCode);
		                if(evt.keyCode = 13){
			                content.toggleCollapse();
		                }
		            };
	                
	            });
	            
                //Content Actions
                content.on('collapse', function(){
                    this.tools.toggle.dom.setAttribute('aria-expanded', false);               
                });
                
                content.on('expand', function(){
                    this.tools.toggle.dom.setAttribute('aria-expanded', true);               
                });
                
                content.tools.toggle.dom.setAttribute('aria-expanded', !content.collapsed);
                content.tools.toggle.dom.setAttribute('aria-controls', content.bwrap.dom.id);
                content.bwrap.dom.setAttribute('aria-label', _('resource_content'));
            }
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