function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

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