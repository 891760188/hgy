var accountName = _App.util.getUrlParamByName("accountName");

if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}

function plusReady(){
	document.getElementById("userNameId").innerHTML = accountName;
}
