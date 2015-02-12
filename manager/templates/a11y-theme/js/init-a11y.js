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
	
	function tellMe(){
		//debug function to tell me stuff
		console.log(this);
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
	
	//make sure uberbar has aria pop rule
	var topNavChildren = document.getElementsByClassName("top");
	var top_i;
	for (top_i = 0; top_i < topNavChildren.length; top_i++) {
	    topNavChildren[top_i].setAttribute("aria-haspopup", "true");
	}
	
	//create New Resource Link
	var newResource = document.createElement("li");
		newResource.setAttribute("class", "x-tree-node");
		newResource.setAttribute("id", "aria-new-doc");
		newResource.setAttribute("role", "treeitem");
		
	var newResourceLink = document.createElement("a");
		newResourceLink.setAttribute("tabindex", "1");
		newResourceLink.setAttribute("title", "Create New Resource");
		newResourceLink.setAttribute("href", "a=resource/create");
	var newResourceSpan = document.createElement("span");
		newResourceSpan.className = "x-btn icon x-btn-small x-btn-icon-small-left icon-plus-circle x-btn-noicon";
	var newResourceLabel = document.createTextNode('  Create New Resource');
	
	newResourceLink.appendChild(newResourceSpan);
	newResourceLink.appendChild(newResourceLabel);
	newResource.appendChild(newResourceLink);
	
	//get resource container
	var resourceRoot = document.getElementById("ext-gen29");
	//console.log(resourceRoot);
	resourceRoot.insertBefore(newResource, resourceRoot.lastChild);

	
}// eof initA11y

/*
Ext.ComponentMgr.onAvailable('modx-abtn-save', function(btn) {
    btn.on('click', function() {
        console.log("onAvailableWorks!");
    });
}); 
*/