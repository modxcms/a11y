Ext.namespace('MODx.a11y');

MODx.a11y.dashboardDyslexiaPanel = function(config) {
    config = config || {};
    var cookie = new MODx.cookie();
    var dstCheck = cookie.get('dysfont');

    Ext.applyIf(config,{
        cls: 'modx-panel'
        ,items:[{
            xtype:'modx-panel'
            ,html:_('a11y.w_dislexia_desc')
        },{
            xtype:'button'
            ,id:'modx-a11y-dashboarddyslexia-btn'
            ,text: dstCheck ? _('a11y.disabled') : _('a11y.enabled')
            ,cls:'primary-button'
            ,handler:MODx.a11y.dyslexiaToggler
        }]
    });
    MODx.a11y.dashboardDyslexiaPanel.superclass.constructor.call(this,config);
    this.config = config;
};
Ext.extend(MODx.a11y.dashboardDyslexiaPanel,MODx.Panel);
Ext.reg('modx-a11y-dashboarddyslexia-panel',MODx.a11y.dashboardDyslexiaPanel);