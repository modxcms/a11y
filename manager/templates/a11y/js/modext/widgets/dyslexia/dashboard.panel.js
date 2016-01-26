Ext.namespace('MODx.a11y');

MODx.a11y.dashboardDyslexiaPanel = function(config) {
    config = config || {};
    var cookie = new MODx.cookie();
    var dstCheck = cookie.get('dysfont');

    Ext.applyIf(config,{
        cls: 'modx-panel'
        ,items:[{
            xtype:'modx-panel'
            ,html:_('a11y.w_dyslexia_desc')
        },{
            xtype:'button'
            ,id:'modx-a11y-dashboarddyslexia-btn'
            ,text: dstCheck ? _('a11y.disable') : _('a11y.enable')
            ,cls:'primary-button'
            ,handler:MODx.a11y.dyslexiaToggler
        }]
    });
    MODx.a11y.dashboardDyslexiaPanel.superclass.constructor.call(this,config);
    this.config = config;
};
Ext.extend(MODx.a11y.dashboardDyslexiaPanel,MODx.Panel);
Ext.reg('modx-a11y-dashboarddyslexia-panel',MODx.a11y.dashboardDyslexiaPanel);