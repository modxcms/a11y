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
        }
    });
});