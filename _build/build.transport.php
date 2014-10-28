<?php
/**
 * Build the transport package
 */

$tstart = explode(' ', microtime());
$tstart = $tstart[1] + $tstart[0];
set_time_limit(0);

// Define package names
define('PKG_NAME', 'VerticalNavigation');
define('PKG_NAME_LOWER', strtolower(PKG_NAME));
define('PKG_VERSION', '0.0.1');
define('PKG_RELEASE', 'dev');

// Define build paths
$root = dirname(__DIR__) . '/';
$sources = array(
    'root'           => $root,
    'build'          => $root . '_build/',
    'data'           => $root . '_build/data/',
    'resolvers'      => $root . '_build/resolvers/',
    'validators'     => $root . '_build/validators/',
    'chunks'         => $root . 'core/elements/chunks/',
    'lexicon'        => $root . 'core/elements/lexicon/',
    'docs'           => $root . 'core/docs/',
    'elements'       => $root . 'core/elements/',

    'source_assets'  => $root . 'assets/',
    'manager_assets' => $root . 'manager/',
    'source_core'    => $root . 'core/',

    'build_dir'      => '/home/_builds/verticalnavigation/'
);
unset($root);

// Override with your own defines here (see build.config.sample.php)
require_once $sources['build'] . 'build.config.php';
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';
require_once $sources['build'] . '/includes/helper.php';

// Instantiate modX
$modx = new modX();
$modx->initialize('mgr');
if (!XPDO_CLI_MODE) {
    echo '<pre>';
}
$modx->setLogLevel(modX::LOG_LEVEL_INFO);
$modx->setLogTarget('ECHO');

$modx->loadClass('transport.modPackageBuilder', '', false, true);
$builder = new modPackageBuilder($modx);
if (isset($sources['build_dir']) && !empty($sources['build_dir'])) {
    $exists = true;
    if (!file_exists($sources['build_dir'])) {
        $exists = mkdir($sources['build_dir'], null, true);
    }
    if ($exists) {
        $builder->directory = $sources['build_dir'];
    }
}
$builder->createPackage(PKG_NAME_LOWER, PKG_VERSION, PKG_RELEASE);
$builder->registerNamespace(PKG_NAME_LOWER, false, true, '{core_path}components/' . PKG_NAME_LOWER . '/');

// Create category
/** @var $category modCategory */
$category = $modx->newObject('modCategory');
$category->set('id', 1);
$category->set('category', PKG_NAME);

// Add plugin
$modx->log(modX::LOG_LEVEL_INFO, 'Packaging in plugins...');
$plugins = include $sources['data'] . 'plugins.php';
if (empty($snippets)) {
    $modx->log(modX::LOG_LEVEL_ERROR, 'Could not package in plugins.');
}
$category->addMany($plugins);

// Create category vehicle
$attr = array(
    xPDOTransport::UNIQUE_KEY                => 'category',
    xPDOTransport::PRESERVE_KEYS             => false,
    xPDOTransport::UPDATE_OBJECT             => true,
    xPDOTransport::RELATED_OBJECTS           => true,
    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array(
        'Plugins' => array(
            xPDOTransport::PRESERVE_KEYS             => false,
            xPDOTransport::UPDATE_OBJECT             => true,
            xPDOTransport::UNIQUE_KEY                => 'name',
            xPDOTransport::RELATED_OBJECTS           => true,
            xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array(
                'PluginEvents' => array(
                    xPDOTransport::PRESERVE_KEYS => true,
                    xPDOTransport::UPDATE_OBJECT => false,
                    xPDOTransport::UNIQUE_KEY    => array('pluginid', 'event'),
                ),
            ),
        ),
    ),
);
$vehicle = $builder->createVehicle($category, $attr);


$modx->log(modX::LOG_LEVEL_INFO, 'Adding file resolvers to category...');
$vehicle->resolve('file', array(
    'source' => $sources['manager_assets'],
    'target' => "return MODX_MANAGER_PATH . 'assets/components/" . PKG_NAME_LOWER . "/';",
));
$vehicle->resolve('file', array(
    'source' => $sources['source_core'],
    'target' => "return MODX_CORE_PATH . 'components/" . PKG_NAME_LOWER . "/';",
));
$builder->putVehicle($vehicle);

// Load system settings
$settings = include $sources['data'] . 'settings.php';
if (!is_array($settings)) {
    $modx->log(modX::LOG_LEVEL_ERROR, 'Could not package in settings.');
} else {
    $attributes = array(
        xPDOTransport::UNIQUE_KEY    => 'key',
        xPDOTransport::PRESERVE_KEYS => true,
        xPDOTransport::UPDATE_OBJECT => false,
    );
    foreach ($settings as $setting) {
        $vehicle = $builder->createVehicle($setting, $attributes);
        $builder->putVehicle($vehicle);
    }
    $modx->log(modX::LOG_LEVEL_INFO, 'Packaged in ' . count($settings) . ' System Settings.');
}
unset($settings, $setting, $attributes);

// Now pack in the license file, readme and setup options
$modx->log(modX::LOG_LEVEL_INFO, 'Adding package attributes and setup options...');
$builder->setPackageAttributes(array(
    'license'   => file_get_contents($sources['docs'] . 'license.txt'),
    'readme'    => file_get_contents($sources['docs'] . 'readme.txt'),
    'changelog' => file_get_contents($sources['docs'] . 'changelog.txt'),
));

// Zip up package
$modx->log(modX::LOG_LEVEL_INFO, 'Packing up transport package zip...');
$builder->pack();

$tend = explode(' ', microtime());
$tend = $tend[1] + $tend[0];
$totalTime = sprintf("%2.4f s", ($tend - $tstart));
$modx->log(modX::LOG_LEVEL_INFO, "\n\nPackage Built. \nExecution time: {$totalTime}\n");
if (!XPDO_CLI_MODE) {
    echo '</pre>';
}
exit();
