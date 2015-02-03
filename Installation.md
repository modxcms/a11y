###Current process taken to get a fresh copy up and running

1. new MODX install 
2. upload folder - manager/templates/a11y-theme
3. upload folder - manager/components/verticalnavigation
4. upload folder - manager/controllers/a11y-theme
5. upload folder - core/elements/plugins
6. upload folder - core/components/verticalnavigation
7. go to settings/namespaces
8. New : name = verticalnavigation  || core path = {core_path}components/verticalnavigation/
9. New : System Setting

   Key : vnav.use_vnav
   
   Name: setting_vnav.use_vnav
   
   Field Type: Yes/No
   
   Namespace: verticalnavigation
   
   Description: setting_vnav.use_vnav_desc
   
   **Save**
   **Set to Yes**

10. create `a11y` plugin (source is core/components/verticalnavigation/elements/plugins/plugin.php)
    
    CHECK `OnBeforeManagerPageInit`
    
11. go to settings and change Manager Theme    
