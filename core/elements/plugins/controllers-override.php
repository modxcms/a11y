<?php
/**
 * Plugin to allow override/extension of default manager controllers
 *
 * @var modX $modx
 * @var array $scriptProperties
 *
 * @event OnManagerPageInit
 */
// The requested action (ie. ?a={$action})
$action = $scriptProperties['action'];
// Grab the current manager theme
$theme = $modx->getOption('manager_theme');
if ($theme === 'default') {
    // Default manager theme, do nothing
    return '';
}

// Controller file absolute path placeholder
$controllerPathPlaceholder = MODX_MANAGER_PATH . "controllers/[+theme]/{$action}.class.php";
// Our "overriden" controller absolute path
$controllerPath = str_replace('[+theme]', $theme, $controllerPathPlaceholder);

if (file_exists($controllerPath)) {
    // OK, override found, let's grab the response object
    if (!$modx->getResponse('modManagerResponse')) {
        return '';
    }
    // Set our controller class post fix
    $modx->response->action['class_postfix'] = 'A11y';
    // Require our original controller class (default theme)
    $originalController = str_replace('[+theme]', 'default', $controllerPathPlaceholder);
    require_once $originalController;
}

return '';
