<?php
/**
 * @package a11y
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$corePath = $modx->getOption('a11y.core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/a11y/');
$a11y = $modx->getService(
    'a11y',
    'A11y',
    $corePath . 'model/a11y/',
    array(
        'core_path' => $corePath
    )
);

/* handle request */
$modx->request->handleRequest(
    array(
        'processors_path' => $a11y->getOption('processorsPath', null, $corePath . 'processors/'),
        'location' => '',
    )
);