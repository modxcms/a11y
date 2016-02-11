<?php
if ($object->xpdo) {
    /** @var modX $modx */
    $modx =& $object->xpdo;
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
            $dyslexia = $modx->getObject('modDashboardWidget', array('name' => 'a11y.w_dyslexia', 'namespace' => 'a11y'));
            $fontSize = $modx->getObject('modDashboardWidget', array('name' => 'a11y.w_fontsize', 'namespace' => 'a11y'));
            $switchTheme = $modx->getObject('modDashboardWidget', array('name' => 'a11y.w_switch_theme', 'namespace' => 'a11y'));
            
            $c = $modx->newQuery('modDashboard');
            $c->sortby('id', 'ASC');
            $c->limit(1);
            
            /** @var modDashboard[] $dashboards */
            $dashboards = $modx->getIterator('modDashboard', $c);
            
            foreach ($dashboards as $dashboard) {
                /** @var modDashboardWidgetPlacement[] $placements */
                $placements = $dashboard->getMany('Placements');
                foreach ($placements as $placement) {
                    $placement->set('rank', $placement->rank + 3);
                    $placement->save();
                }  
                
                $dyslexiaPlacement = $modx->newObject('modDashboardWidgetPlacement');
                $dyslexiaPlacement->set('dashboard', $dashboard->id);
                $dyslexiaPlacement->set('widget', $dyslexia->id);
                $dyslexiaPlacement->set('rank', 0);
                $dyslexiaPlacement->save();
                
                $fonSizePlacement = $modx->newObject('modDashboardWidgetPlacement');
                $fonSizePlacement->set('dashboard', $dashboard->id);
                $fonSizePlacement->set('widget', $fontSize->id);
                $fonSizePlacement->set('rank', 1);
                $fonSizePlacement->save();

                $switchThemePlacement = $modx->newObject('modDashboardWidgetPlacement');
                $switchThemePlacement->set('dashboard', $dashboard->id);
                $switchThemePlacement->set('widget', $switchTheme->id);
                $switchThemePlacement->set('rank', 2);
                $switchThemePlacement->save();
            }
            
            $theme = $modx->getObject('modSystemSetting', array('key' => 'manager_theme'));
            if (!$theme) {
                $theme = $modx->newObject('modSystemSetting');
                $theme->set('key', 'manager_theme');
                $setting->set('xtype', 'modx-combo-manager-theme');
            }
            
            $theme->set('value', 'a11y');
            $theme->save();
            
            break;

        case xPDOTransport::ACTION_UNINSTALL:
            $theme = $modx->getObject('modSystemSetting', array('key' => 'manager_theme'));
            if (!$theme) {
                $theme = $modx->newObject('modSystemSetting');
                $theme->set('key', 'manager_theme');
                $setting->set('xtype', 'modx-combo-manager-theme');
            }
            
            $theme->set('value', 'default');
            $theme->save();
            
            $modx->updateCollection('modUserSetting', array('value' => 'default'), array('key' => 'manager_theme', 'value' => 'a11y'));
            
            break;
    }
}
return true;