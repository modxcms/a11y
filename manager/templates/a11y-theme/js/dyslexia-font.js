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
	document.write('<style>@font-face {font-family: "opendyslexic3regular"; src: url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.eot"); src: url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.eot?#iefix") format("embedded-opentype"), url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.woff2") format("woff2"), url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.woff") format("woff"), url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.ttf") format("truetype"), url("templates/a11y-theme/css/fonts/OpenDyslexic3-Regular-webfont.svg#opendyslexic3regular") format("svg"); font-weight: normal; font-style: normal;} body{font-family: "opendyslexic3regular" !important;}</style>');
	setTimeout(function(){ 
		var dstBtn = document.getElementById("toggle-dyslexia-text");
		dstBtn.innerHTML = 'Disable';
	}, 1000);	
}	