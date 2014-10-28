<?php
/**
 * @var modX $modx
 */

/** @var modSystemSetting[] $settings */
$settings = array();
$i = 0;

$settings[$i] = $modx->newObject('modSystemSetting');
$settings[$i]->fromArray(array(
    'key' => 'vnav.use_border',
    'value' => false,
    'xtype' => 'combo-boolean',
    'namespace' => 'verticalnavigation',
), '', true, true);

$i++;

$settings[$i] = $modx->newObject('modSystemSetting');
$settings[$i]->fromArray(array(
    'key' => 'vnav.use_vnav',
    'value' => false,
    'xtype' => 'combo-boolean',
    'namespace' => 'verticalnavigation',
), '', true, true);

return $settings;
