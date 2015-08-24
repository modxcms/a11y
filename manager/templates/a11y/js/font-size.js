//bfs = body font size
var bfsCheck = readCookie('bodyfontsize');
if(!bfsCheck){
	createCookie("bodyfontsize", 0, 30);
	setTimeout(function(){ document.getElementById("modx-body-tag").style.fontSize = "1.0em"; }, 1000);
} else {
	setTimeout(function(){ document.getElementById("modx-body-tag").style.fontSize = "1."+bfsCheck+"em"; }, 1000);
}

//increase fs
function bfsIncrease(){
	var bfsCheck = readCookie('bodyfontsize');
	var newBfs = Number(bfsCheck)+1;
	createCookie("bodyfontsize", newBfs, 30);
	writeBfs(newBfs);
}

//decrease fs
function bfsDecrease(){
	var bfsCheck = readCookie('bodyfontsize');
	var newBfs = Number(bfsCheck)-1;
	createCookie("bodyfontsize", newBfs, 30);
	writeBfs(newBfs);
}

//write styling
function writeBfs(newBfs){
	document.getElementById("modx-body-tag").style.fontSize = "1."+newBfs+"em";	
}