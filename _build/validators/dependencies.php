<?php
/**
 * Validator to handle dependencies
 *
 * @see xPDOVehicle::validate
 *
 * @var xPDOVehicle $this
 * @var xPDOTransport $transport
 * @var xPDOObject|mixed $object
 * @var array $options
 *
 * @var array $fileMeta
 * @var string $fileName
 * @var string $fileSource
 *
 * @var array $r
 * @var string $type (file/php), obviously php :)
 * @var string $body (json)
 */

$success = true;
if ($object->xpdo && ($options[xPDOTransport::PACKAGE_ACTION] == xPDOTransport::ACTION_INSTALL || $options[xPDOTransport::PACKAGE_ACTION] == xPDOTransport::ACTION_UPGRADE)) {
    /** @var modX $modx */
    $modx =& $object->xpdo;

    $modx->getVersionData();
    if (version_compare($modx->version['full_version'], '2.4.0-pl', '>=')) {
        $modx->log(modX::LOG_LEVEL_INFO, 'Let Revo 2.4 handle dependencies');
        return $success;
    }

    $modx->log(modX::LOG_LEVEL_INFO, '&nbsp;');
    $modx->log(modX::LOG_LEVEL_INFO, '&nbsp;');
    $modx->log(modX::LOG_LEVEL_INFO, 'Checking requirements...');

    // Get dependencies first, if any
    $requirements = $transport->getAttribute('requires');
    if (!$requirements || empty($requirements)) {
        $modx->log(modX::LOG_LEVEL_INFO, 'None found');
        return $success;
    }

    if ($requirements && !empty($requirements)) {
        // Get additional options if any
        $options = $transport->getAttribute('requires_options');
        if (!is_array($options)) {
            $options = array();
        }

        $sourcePath = $modx->getOption('core_path').'packages/'.$transport->signature.'/';
        $loader = $sourcePath . $transport->getAttribute('loader');

        if (file_exists($loader)) {
            require_once($loader);
        } else {
            $modx->log(modX::LOG_LEVEL_ERROR, 'An error happened while loading vendor, sorry.');
            return false;
        }

        $modx->log(modX::LOG_LEVEL_INFO, 'This component requires the followings packages : ');
        foreach ($requirements as $name => $version) {
            $modx->log(modX::LOG_LEVEL_INFO, "{$name} {$version}");
        }

        $installer = new \Melting\MODX\Package\Installer($modx);
        $results = $installer->installPackages($requirements, $options);
        $modx->log(modX::LOG_LEVEL_INFO, print_r($results, true));
        $success = array_search(false, $results) === false;
        $modx->log(modX::LOG_LEVEL_INFO, 'Success ? '. $success);
    }

    //return false;
}

return $success;
