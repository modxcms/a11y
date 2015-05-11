<?php

$tstart = microtime(true);
set_time_limit(0);

// Define package names
define('PKG_NAME', 'A11yTheme');
define('PKG_NAME_LOWER', strtolower(PKG_NAME));
define('PKG_VERSION', '0.1.1');
define('PKG_RELEASE', 'dev');

// Define build paths
$root = dirname(__DIR__) . '/';
$sources = array(
    'root' => $root,
    'build' => $root . '_build/',
    'data' => $root . '_build/data/',
    'resolvers' => $root . '_build/resolvers/',
    'validators' => $root . '_build/validators/',
    'manager_template' => $root . 'manager/templates/a11y-theme/',
    'manager_controllers' => $root . 'manager/controllers/a11y-theme/',

    'build_dir' => __DIR__ . '/',
);
unset($root);

// Override with your own defines here (see build.config.sample.php)
require_once $sources['build'] . 'build.config.php';
if (file_exists(MODX_CORE_PATH . 'vendor/autoload.php')) {
    require_once MODX_CORE_PATH . 'vendor/autoload.php';
}
require_once MODX_CORE_PATH . 'model/modx/modx.class.php';

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
if (isset($sources['build_dir']) && !empty($sources['build_dir']) && file_exists($sources['build_dir'])) {
    $builder->directory = $sources['build_dir'];
}
$builder->createPackage(PKG_NAME_LOWER, PKG_VERSION, PKG_RELEASE);

/** @var modNamespace $ns */
$ns = $modx->newObject('modNamespace');
$ns->fromArray(array(
    'name' => PKG_NAME_LOWER,
    //'path' => '',
), '', true);

$attr = array(
    xPDOTransport::PRESERVE_KEYS => true,
    xPDOTransport::UPDATE_OBJECT => false,
    xPDOTransport::RESOLVE_FILES => true,
    xPDOTransport::RESOLVE_PHP => true,
    xPDOTransport::ABORT_INSTALL_ON_VEHICLE_FAIL => true,
);
$vehicle = $builder->createVehicle($ns, $attr);
$vehicle->resolve('file', array(
    'source' => $sources['manager_template'],
    'target' => "return MODX_MANAGER_PATH . 'templates/';",
));
$vehicle->resolve('file', array(
    'source' => $sources['manager_controllers'],
    'target' => "return MODX_MANAGER_PATH . 'controllers/';",
));
$vehicle->resolve('php', array(
    'source' => $sources['resolvers'] . 'uninstall.php'
));
$vehicle->validate('php', array(
    'source' => $sources['validators'] . 'dependencies.php'
));

$builder->putVehicle($vehicle);

// Add the vendor dir into the package
$vendor = $sources['build'] . 'vendor';
$destination = $builder->directory . $builder->package->signature .'/vendor/';
//$result = `cp -rf $vendor $destination`;
$cache = $modx->getCacheManager();
$cache->copyTree($vendor, $destination);

// Now pack in the license file, readme and setup options
$modx->log(modX::LOG_LEVEL_INFO, 'Adding package attributes and setup options...');
$builder->setPackageAttributes(array(
//    'license' => file_get_contents($sources['docs'] . 'license.txt'),
//    'readme' => file_get_contents($sources['docs'] . 'readme.txt'),
//    'changelog' => file_get_contents($sources['docs'] . 'changelog.txt'),

    // Our dependencies
    'requires' => array(
        'VerticalNavigation' => '<0.2.0-pl',
    ),
    'requires_options' => array(
        'VerticalNavigation' => array(
            'setup_options' => array(
                'use_vnav' => true,
            )
        )
    ),
    // Store the expected location of the autoloader to be able to use it later
    'loader' => 'vendor/autoload.php',
));

// Zip up package
$modx->log(modX::LOG_LEVEL_INFO, 'Packing up transport package zip...');
$builder->pack();

$tend = microtime(true);
$totalTime = sprintf("%2.4f s", ($tend - $tstart));
$modx->log(modX::LOG_LEVEL_INFO, "\n\nPackage Built. \nExecution time: {$totalTime}\n");
if (!XPDO_CLI_MODE) {
    echo '</pre>';
}
exit();
