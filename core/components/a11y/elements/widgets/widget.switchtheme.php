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
class modDashboardWidgetSwitchTheme extends modDashboardWidgetInterface {

    public function render() {
        $corePath = $this->modx->getOption('a11y.core_path', null, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/a11y/');
        /** @var A11y $a11y */
        $a11y = $this->modx->getService(
            'a11y',
            'A11y',
            $corePath . 'model/a11y/',
            array(
                'core_path' => $corePath
            )
        );
        
        $this->modx->controller->addLexiconTopic('a11y:dashboards');
        $this->controller->addLastJavascript($this->modx->getOption('manager_url').'templates/a11y/js/modext/widgets/switchtheme/dashboard.panel.js');
        $this->controller->addHtml('<script type="text/javascript">Ext.onReady(function() {
    MODx.load({
        xtype: "modx-a11y-dashboard-switch-theme-panel"
        ,renderTo: "modx-a11y-dashboard-switch-theme"
        ,connectorUrl: "' . $a11y->getOption('connectorUrl') . '"
    });
});</script>');

        return $this->getFileChunk('dashboard/switchtheme.tpl');
    }
}
return 'modDashboardWidgetSwitchTheme';