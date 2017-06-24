function doShare() {
	var potentialFlag = _App.util.getUrlParamByName('potentialFlag');
	var custId = _App.util.getUrlParamByName('custId');
	var currentId = plus.webview.currentWebview().id;
	var sign;
	if(potentialFlag != '1'){
		sign = 'XTYX';
	}else{
		sign = 'KHZJ';
	}
	cutScreen("circleTag", function(data) {
		plus.storage.removeItem("_shareImgPath_")
		plus.storage.setItem("_shareImgPath_", data);
		var url = "../finding/share/share.html?cwebviewObjId=" + currentId + "&bizType="+sign+"&bizId=" + custId;
		_App.util.goPage(url, {
			pageId: 'share_id',
			refresh: true
		});
	});
}