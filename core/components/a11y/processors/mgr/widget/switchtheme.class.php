<?php

class A11ySwitchThemeProcessor extends modProcessor {

    public function process() {
        $theme = $this->getProperty('theme');

        if (empty($theme)) {
            return $this->failure();
        }

        $setting = $this->modx->getObject('modUserSetting', array('user' => $this->modx->user->id, 'key' => 'manager_theme'));
        if (!$setting) {
            $setting = $this->modx->newObject('modUserSetting');
            $setting->set('user', $this->modx->user->id);
            $setting->set('key', 'manager_theme');
            $setting->set('xtype', 'modx-combo-manager-theme');
        }
        
        $setting->set('value', $theme);
        $setting->save();
        
        $this->modx->getUser('mgr', true);
        
        return $this->success();
    }
}
return 'A11ySwitchThemeProcessor';