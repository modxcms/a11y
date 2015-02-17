var dstCheck = readCookie('dysfont');

//toggler
function dyslexiaToggler(){
	
	if(dstCheck){
		eraseCookie("dysfont");
		location.reload();
	} else {
		createCookie("dysfont", "true", 30);
		location.reload();
	}
	
}

//write styling
if(dstCheck){
	document.write('<style>body{font-family: Dyslexia !important;}</style>');
	setTimeout(function(){ 
		var dstBtn = document.getElementById("toggle-dyslexia-text");
		dstBtn.innerHTML = 'Disable';
	}, 1000);	
}	