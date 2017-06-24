
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}

function plusReady(){
	
}

function go2CompHome(id){
	var url = "compdataViewIndex.html";
	_App.util.goPage(url,{
		pageId:'compdataViewIndex-id',
		refresh:true
	});
}
