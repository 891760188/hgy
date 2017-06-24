var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
var backPage;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
	},
	//设备资源加载完成调用
	deviceReady: function() {
		backPage = plus.webview.getWebviewById(cwebviewId);
	}
};

_App.init(appConfig);


function selectBack(obj){
  	if(!backPage){
	  	alert("页面还未准备好，请稍后...");
	  	return false;
	}
  	//触发详情页面的newsId事件
	mui.fire(backPage,'chooseProdEvent__',{
	    name:obj
	});

  	mui.back();
}

function selectedNode(obj,name){
	if(obj.classList.contains("icon-radio-checked")){
		obj.classList.add('icon-radio-unchecked');
		obj.classList.remove('icon-radio-checked');
	}
	else{
		obj.classList.remove('icon-radio-unchecked');
		obj.classList.add('icon-radio-checked');
	}				
}

function backFn(){
	var backStr = "";
	mui(".icon-radio-checked").each(function () {
			var dataFun = this.getAttribute('data-fn');
			var len1 = dataFun.length;
			var nameStr = dataFun.substring(19,len1-3);
			backStr = backStr+nameStr+",";
			
		});
	if("" == backStr || undefined == backStr){
		mui.alert("请选择产品！");
		return false;
	}
	var len = backStr.length;
	backStr = backStr.substring(0,len-1);
	selectBack(backStr);
}