<?php
/**
 * @var modX $modx
 * @var array $sources
 */

/** @var modPlugin[] $plugins */
$plugins = array();
$i = 0;

$plugins[$i] = $modx->newObject('modPlugin');
$plugins[$i]->fromArray(array(
    'name' => '',
    'description' => '',
    'plugincode' => '',
), '', true, true);

$properties = $sources['data'] . 'properties/verticalnavigation.php';
if (file_exists($properties)) {

}

$events = $sources['data'] . 'events/verticalnavigation.php';
if (file_exists($events)) {
    $vents = include_once $events;
    $plugins[$i]->addMany($vents);
}

return $plugins;
