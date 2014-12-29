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

//Issue #10, trying to make an override for the initial focus field if we have the resource edit screen
	//DID NOT WORK
	//watch input changes to set focus
	//var input = document.querySelector('input');
	//input.oninput = whosFocused;
	//input.attachEvent("oninput", whosFocused);
	//input.addEventListener("input", whosFocused, false);
	
	//DID NOT WORK
	//var updateDiv = document.getElementById("modx-panel-resource-div");
	//console.log(updateDiv);
	//if(updateDiv){document.getElementById("modx-resource-pagetitle").focus()};
	
	//load the last focused element, to begin where we left off 
	//DID NOT WORK
	//var lastActiveEle = localStorage.getItem('curFocus');
	//console.log("Last Active: "+lastActiveEle);
		
	//var initFocus = document.getElementById(lastActiveEle);
	//initFocus.focus();
	
}	