function initA11y() {
	function whosFocused(){	
		var curElement = document.activeElement;
		//localStorage.setItem('curFocus',curElement);
		console.log("currently selected:"+curElement);
		//console.log(curElement.nextSibling.nextSibling.className);
		var nextDude = curElement.nextSibling.nextSibling;
		if(nextDude.className == "modx-subnav"){
			//console.log("bazinga");
			//clear any open subnavs
			clearSubNavOpen();
			
			//force open subnav	
			nextDude.className = "modx-subnav open";
		}	
	}
	
	function clearSubNavOpen(){
		var findSubOpen = document.getElementsByClassName("modx-subnav open");
		var runClearOpen = Array.prototype.filter.call(findSubOpen, function(clearThisUl){
			clearThisUl.className = "modx-subnav";
		});
	}	
	
	//who to watch
	document.getElementById("modx-navbar").addEventListener("keydown", whosFocused, false);
	document.getElementById("modx-navbar").addEventListener("mouseleave", clearSubNavOpen, false);
	//give help an ID by editing line 175 in /controllers/
	document.getElementById("help-link").addEventListener("keydown", clearSubNavOpen, false);	
	document.getElementById("modx-uberbar").addEventListener("keydown", clearSubNavOpen, false);
	
	//Vertical Tab role assignment
	document.getElementById("ext-gen15").setAttribute("role", "tablist");
	document.getElementById("ext-gen15").setAttribute("aria-label", "Resources Elements and Files Tablist");
	document.getElementById("ext-comp-1007").setAttribute("role", "tab");
	document.getElementById("ext-comp-1010").setAttribute("role", "tab");
	document.getElementById("ext-comp-1013").setAttribute("role", "tab");
	
	
	var topNavChildren = document.getElementsByClassName("top");
	var top_i;
	for (top_i = 0; top_i < topNavChildren.length; top_i++) {
	    topNavChildren[top_i].setAttribute("aria-haspopup", "true");
	}
	
	/**
	 * Handle vertical navigation assets
	 *
	 * @var modX $modx
	 * @var array $scriptProperties
	 *
	 * @event OnManagerPageBeforeInit
	 */
	
	/** @var modManagercontroller $controller */
	$controller = $modx->controller;
	
	if ($modx->getOption('vnav.use_vnav')) {
	    $base = $modx->getOption(
	        'vnav.assets_url',
	        null,
	        $modx->getOption('manager_url') . 'assets/components/verticalnavigation/'
	    );
	    // Base CSS
	    $controller->addCss($base . 'css/app.css');
	    $theme = $modx->getOption('manager_theme');
	
	    if ($theme !== 'default') {
	        // Check for custom theme CSS
	        $file = "templates/{$theme}/css/vnav.css";
	
	        if (file_exists($modx->getOption('manager_path') . $file)) {
	            $controller->addCss($modx->getOption('manager_url') . $file);
	        }
	    }
	
	    // JS
	    $controller->addJavascript($base . 'js/vertical-menu.js');
	}
	
	return '';
	
}// eof initA11y

/*
Ext.ComponentMgr.onAvailable('modx-abtn-save', function(btn) {
    btn.on('click', function() {
        console.log("onAvailableWorks!");
    });
}); 
*/