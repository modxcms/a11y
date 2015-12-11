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
class modDashboardWidgetDyslexia extends modDashboardWidgetInterface {

    public function render() {
        $this->modx->controller->addLexiconTopic('a11y:dashboards');
        $this->controller->addLastJavascript($this->modx->getOption('manager_url').'templates/a11y/js/modext/widgets/dyslexia/dashboard.panel.js');
        $this->controller->addHtml('<script type="text/javascript">Ext.onReady(function() {
    MODx.load({
        xtype: "modx-a11y-dashboarddyslexia-panel"
        ,renderTo: "modx-a11y-dashboard-dyslexia"
    });
});</script>');

        return $this->getFileChunk('dashboard/dyslexia.tpl');
    }
}
return 'modDashboardWidgetDyslexia';