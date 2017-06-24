
var bizType  = _App.util.getUrlParamByName("bizType");
var noticeId = _App.util.getUrlParamByName("bizId");

var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {},
	//设备资源加载完成调用
	deviceReady: function() {
		backPage = plus.webview.getWebviewById(parentwebviewid);
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function getDetail() {
	_App.ajax({
		type: "get",
		url: basePath + 'mobileNoticeAction!getNoticeDetail.json',
		data: {
			noticeId:noticeId,
			bizType:bizType
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data[0];
			if(data) {
				var title = data.BIZ_NAME;
				var content = data.BIZ_CONTENT;
				var publisher = data.BIZ_PBER;
				var time = data.BIZ_TIME;
				document.getElementById('title').innerHTML = title;
				document.getElementById('content').innerHTML = content;
				document.getElementById('publisher').innerHTML = publisher;
				document.getElementById('time').innerHTML = time;
			} else {
				mui.toast("公告不存在！");
			}
		},
		error: function(a, b, c) {
			mui.alert("网络连接出错!");
		}
	});
}
var doShare = function(){
	plus.storage.removeItem("_shareImgPath_");
	var currentViewId = plus.webview.currentWebview().id;
	var url = "../share/share.html?cwebviewObjId="+currentViewId+"&bizType=GG&bizId="+noticeId+"&sign=3";
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
}

var go2back = mui.back;
mui.back = function(){
	mui.fire(backPage,'refreshHPEvent__',{
	});
	plus.webview.currentWebview().close();
};