function go2SetTime(){
	var url = "setTime_main.html"
	_App.util.goPage(url, {
		pageId:'setTime_id', 
		refresh: true  
	});
}
function go2SetLocate(){
	var url = "locateSet.html"
	_App.util.goPage(url, {
		pageId:'locateSet_id', 
		refresh: true  
	});
}
function doSure(){
	mui.back();
}