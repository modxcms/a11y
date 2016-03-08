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

            var publishedOnInput = Ext.get("modx-resource-publishedon-date");
            if(publishedOnInput){ publishedOnInput.dom.setAttribute('aria-label', "Published On Date"); }

            var publishedOnTimeInput = Ext.get("modx-resource-publishedon-time");
            if(publishedOnTimeInput){ publishedOnTimeInput.dom.setAttribute('aria-label', "Published On Time"); }

            var publishedDateInput = Ext.get("modx-resource-pub-date-date");
            if(publishedDateInput){ publishedDateInput.dom.setAttribute('aria-label', "Published Date"); }

            var publishedTimeInput = Ext.get("modx-resource-pub-date-time");
            if(publishedTimeInput){ publishedTimeInput.dom.setAttribute('aria-label', "Published Time"); }

            var unpublishedDateInput = Ext.get("modx-resource-unpub-date-date");
            if(unpublishedDateInput){ unpublishedDateInput.dom.setAttribute('aria-label', "Un Published Date"); }

            var unpublishedTimeInput = Ext.get("modx-resource-unpub-date-time");
            if(unpublishedTimeInput){ unpublishedTimeInput.dom.setAttribute('aria-label', "Un Published Time"); }

            var isfolderCheckbox = Ext.get("modx-resource-isfolder");
            if(isfolderCheckbox){ isfolderCheckbox.dom.setAttribute('aria-label', "Is this a folder"); }

            var searchableCheckbox = Ext.get("modx-resource-searchable");
            if(searchableCheckbox){ searchableCheckbox.dom.setAttribute('aria-label', "Is this searchable"); }

            var richtextCheckbox = Ext.get("modx-resource-richtext");
            if(richtextCheckbox){ richtextCheckbox.dom.setAttribute('aria-label', "Show Rich Text Editor"); }

            var freezeuriCheckbox = Ext.get("modx-resource-uri-override");
            if(freezeuriCheckbox){ freezeuriCheckbox.dom.setAttribute('aria-label', "Freeze this URI"); }

            var cacheableCheckbox = Ext.get("modx-resource-cacheable");
            if(cacheableCheckbox){ cacheableCheckbox.dom.setAttribute('aria-label', "Is this cacheable"); }

            var syncsiteCheckbox = Ext.get("modx-resource-syncsite");
            if(syncsiteCheckbox){ syncsiteCheckbox.dom.setAttribute('aria-label', "Empty cache on save"); }

            var deletedCheckbox = Ext.get("modx-resource-deleted");
            if(deletedCheckbox){ deletedCheckbox.dom.setAttribute('aria-label', "Deleted"); }

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

    Ext.override(MODx.toolbar.ActionButtons, {
        handleClick: function(itm,e) {
            var o = this.config;
            if (o.formpanel === false || o.formpanel === undefined || o.formpanel === null) return false;

            if (itm.method === 'remote') { /* if using connectors */
                MODx.util.Progress.reset();
                o.form = Ext.getCmp(o.formpanel);
                if (!o.form) return false;

                var f = o.form.getForm ? o.form.getForm() : o.form;
                var isv = true;
                var invalidField;
                if (f.items && f.items.items) {
                    for (var fld in f.items.items) {
                        if (f.items.items[fld] && f.items.items[fld].validate) {
                            var fisv = f.items.items[fld].validate();
                            if (!fisv) {
                                f.items.items[fld].markInvalid();
                                invalidField = f.items.items[fld];
                                isv = false;
                            }
                        }
                    }
                }

                if (isv) {
                    Ext.applyIf(o.params,{
                        action: itm.process
                    });

                    Ext.apply(f.baseParams,o.params);

                    o.form.on('success',function(r) {
                        if (o.form.clearDirty) o.form.clearDirty();
                        /* allow for success messages */
                        MODx.msg.status({
                            title: _('success')
                            ,message: r.result.message || _('save_successful')
                            ,dontHide: r.result.message != '' ? true : false
                        });

                        if (itm.redirect != false) {
                            Ext.callback(this.redirect,this,[o,itm,r.result],1000);
                        }

                        this.resetDirtyButtons(r.result);
                    },this);
                    o.form.submit({
                        headers: {
                            'Powered-By': 'MODx'
                            ,'modAuth': MODx.siteId
                        }
                    });
                } else {
                    Ext.Msg.alert(_('error'),_('correct_errors'), function(){
                        try {
                            invalidField.focus();
                        } catch (err) {}
                    });
                }
            } else {
                // if just doing a URL redirect
                var params = itm.params || {};
                Ext.applyIf(params, o.baseParams || {});
                MODx.loadPage('?' + Ext.urlEncode(params));
            }

            return false;
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
            //field.focus();
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
                this.bwrap.addClass("hide");
            });

            this.on('expand', function(){
                this.tools.toggle.dom.setAttribute('aria-expanded', true);
                this.bwrap.removeClass("hide");
            });

            this.tools.toggle.dom.setAttribute('aria-label', "Hide " + (this.title || '') + " Field");
            this.tools.toggle.dom.setAttribute('tabindex', "0");

            this.tools.toggle.dom.setAttribute('aria-expanded', !this.collapsed);
            this.tools.toggle.dom.setAttribute('aria-controls', this.bwrap.dom.id);
            if (this.title) {
                this.bwrap.dom.setAttribute('aria-label', this.title);
            }

            this.tools.toggle.insertFirst({
                tag: 'div',
                cls: 'sr-only',
                html: 'Hide ' + (this.title || '') + ' Field'
            });
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

        this.on('render', function() {
            this.strip.on('keydown', function(e) {
                if (e.getKey() == Ext.EventObject.RIGHT) {
                    try {
                        this.setActiveTab(this.items.indexOf(this.activeTab) + 1);
                        this.activeTab.tabEl.focus();
                    } catch (err) {}
                }

                if (e.getKey() == Ext.EventObject.LEFT) {
                    try {
                        this.setActiveTab(this.items.indexOf(this.activeTab) - 1);
                        this.activeTab.tabEl.focus();
                    } catch (err) {}
                }
            }, this);
        }, this, {single: true})
    },

    onRender: function(ct, position){
        this.tabOriginals.onRender.call(this, ct, position);

        this.strip.dom.setAttribute('role', 'tablist');
        this.stripWrap.dom.setAttribute('tabindex', 0);
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
