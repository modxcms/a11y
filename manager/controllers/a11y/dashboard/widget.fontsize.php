<?php
/**
 * @package modx
 * @subpackage dashboard
 */
/**
 * Renders the font size buttons
 *
 * @package modx
 * @subpackage dashboard
 */
class modDashboardWidgetFontSize extends modDashboardWidgetInterface {

    public function render() {
        $this->controller->addLastJavascript($this->modx->getOption('manager_url').'templates/a11y/js/modext/widgets/fontsize/dashboard.panel.js');
        $this->controller->addHtml('<script type="text/javascript">Ext.onReady(function() {
    MODx.load({
        xtype: "modx-a11y-dashboardfontsize-panel"
        ,renderTo: "modx-a11y-dashboard-fontsize"
    });
});</script>');

        return $this->getFileChunk('dashboard/fontsize.tpl');
    }
}
return 'modDashboardWidgetFontSize';