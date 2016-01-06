<?php
/**
 * The base class for A11y.
 *
 * @package a11y
 */
class A11y {
    /** @var \modX $modx */
    public $modx;
    public $namespace = 'a11y';
    /** @var array $config */
    public $config = array();
    /** @var array $chunks */
    public $chunks = array();

    function __construct(modX &$modx,array $config = array()) {
        $this->modx =& $modx;
        $this->namespace = $this->getOption('namespace', $config, 'a11y');

        $corePath = $this->getOption('core_path', $config, $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/a11y/');
        $assetsUrl = $this->getOption('assets_url', $config, $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/a11y/');
        $connectorUrl = $assetsUrl.'connector.php';

        $this->config = array_merge(array(
            'assets_url' => $assetsUrl,
            'core_path' => $corePath,

            'assetsUrl' => $assetsUrl,
            'cssUrl' => $assetsUrl.'css/',
            'jsUrl' => $assetsUrl.'js/',

            'connectorUrl' => $connectorUrl,

            'corePath' => $corePath,
            'modelPath' => $corePath.'model/',
            'processorsPath' => $corePath.'processors/',
            'templatesPath' => $corePath.'templates/',
        ),$config);

        $this->modx->addPackage('a11y',$this->config['modelPath']);
        $this->modx->lexicon->load('a11y:default');
    }

    /**
     * Get a local configuration option or a namespaced system setting by key.
     *
     * @param string $key The option key to search for.
     * @param array $options An array of options that override local options.
     * @param mixed $default The default value returned if the option is not found locally or as a
     * namespaced system setting; by default this value is null.
     * @return mixed The option value or the default value specified.
     */
    public function getOption($key, $options = array(), $default = null) {
        $option = $default;
        if (!empty($key) && is_string($key)) {
            if ($options != null && array_key_exists($key, $options)) {
                $option = $options[$key];
            } elseif (array_key_exists($key, $this->config)) {
                $option = $this->config[$key];
            } elseif (array_key_exists("{$this->namespace}.{$key}", $this->modx->config)) {
                $option = $this->modx->getOption("{$this->namespace}.{$key}");
            }
        }
        return $option;
    }
}
