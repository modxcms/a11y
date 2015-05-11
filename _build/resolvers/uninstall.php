<?php
/**
 * Resolver to set default theme back when uninstalling
 *
 * @see xPDOVehicle::resolve
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
 * @var integer $preExistingMode
 */

if ($object->xpdo) {
    /** @var $modx modX */
    $modx =& $object->xpdo;

    if ($options[xPDOTransport::PACKAGE_ACTION] === xPDOTransport::ACTION_UNINSTALL) {
        $setting = $modx->getObject('modSystemSetting', array(
            'key' => 'manager_theme',
        ));
        if ($setting->get('value') === 'a11y-theme') {
            $modx->log(modX::LOG_LEVEL_INFO, 'Setting default theme as manager theme...');
            // Theme was a11y, let's get back to default
            $setting->set('value', 'default');
            $setting->save();
        }
    }
}

return true;
