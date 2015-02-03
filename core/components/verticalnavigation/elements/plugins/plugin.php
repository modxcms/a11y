<?php
/**
 * Handle vertical navigation assets
 *
 * @var modX $modx
 * @var array $scriptProperties
 *
 * @event OnManagerPageBeforeInit
 */

/** @var modManagercontroller $controller */
$controller = $modx->controller;

if ($modx->getOption('vnav.use_vnav')) {
    $base = $modx->getOption(
        'vnav.assets_url',
        null,
        $modx->getOption('manager_url') . 'assets/components/verticalnavigation/'
    );
    // Base CSS
    $controller->addCss($base . 'css/app.css');
    $theme = $modx->getOption('manager_theme');

    if ($theme !== 'default') {
        // Check for custom theme CSS
        $file = "templates/{$theme}/css/vnav.css";

        if (file_exists($modx->getOption('manager_path') . $file)) {
            $controller->addCss($modx->getOption('manager_url') . $file);
        }
    }

    // JS
    $controller->addJavascript($base . 'js/vertical-menu.js');
}

return '';
