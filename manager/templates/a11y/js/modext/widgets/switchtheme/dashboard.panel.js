Ext.namespace('MODx.a11y');

MODx.a11y.dashboardSwitchTheme = function(config) {
    config = config || {};

    Ext.applyIf(config,{
        cls: 'modx-panel'
        ,items:[{
            xtype: 'modx-combo-manager-theme'
            ,value: MODx.config.manager_theme
            ,id: 'a11y-switch-theme'
        },{
            xtype:'modx-panel'
            ,html:_('a11y.w_switch_theme_desc')
        },{

            xtype:'button'
            ,text: _('a11y.w_switch_theme')
            ,cls:'primary-button'
            ,handler: this.switchTheme
            ,scope: this
        }]
    });
    MODx.a11y.dashboardSwitchTheme.superclass.constructor.call(this,config);
};
Ext.extend(MODx.a11y.dashboardSwitchTheme,MODx.Panel, {
    switchTheme: function() {
        var theme = Ext.getCmp('a11y-switch-theme').getValue();
        if (!theme) return;

        MODx.Ajax.request({
            url: this.config.connectorUrl
            ,params: {
                action: 'mgr/widget/switchtheme'
                ,theme: theme
            },
            listeners: {
                'success': {
                    fn: function(r) {
                        location.reload();
                    },
                    scope: this
                }
            }
        });
    }
});
Ext.reg('modx-a11y-dashboard-switch-theme-panel',MODx.a11y.dashboardSwitchTheme);