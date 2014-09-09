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

if ($modx->getOption('use_vnav')) {
    // Load vertical menu xtype
    $vnav = $modx->getOption(
        'vnav.assets_url',
        null,
        $modx->getOption('manager_url') . 'assets/components/verticalnavigation/'
    ) . 'js/vertical-menu.js';
    $controller->addJavascript($vnav);
}

return '';
