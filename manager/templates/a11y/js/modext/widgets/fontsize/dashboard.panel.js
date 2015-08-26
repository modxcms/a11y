Ext.namespace('MODx.a11y');

MODx.a11y.dashboardFontSizePanel = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        cls: 'modx-panel'
        ,items:[{
            xtype:'modx-panel'
            ,html: _('a11y.w_fontsize_desc')
        },{
            xtype:'button'
            ,text:'Increase'
            ,cls:'primary-button'
            ,handler:MODx.a11y.bfsIncrease
        },{
            xtype:'button'
            ,text:'Decrease'
            ,cls:'primary-button'
            ,handler:MODx.a11y.bfsDecrease
        }]
    });
    MODx.a11y.dashboardFontSizePanel.superclass.constructor.call(this,config);
    this.config = config;
};
Ext.extend(MODx.a11y.dashboardFontSizePanel,MODx.Panel);
Ext.reg('modx-a11y-dashboardfontsize-panel',MODx.a11y.dashboardFontSizePanel);