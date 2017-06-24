var appConfig = {
	uiReady: function() {

	},
	//设备资源加载完成调用
	deviceReady: function() {
		localStorage.removeItem('viewData'); //登录时清除用户行为缓存记录
		updateApp();
	},
	swipeBack: true //启用右滑关闭功能
};
_App.init(appConfig);

var wgtUrl = "";

function updateApp() {
	_App.version.getVerison(function(v) {
		var appVersion = "";
		if(mui.os.android) {
			appVersion = "0";
		} else if(mui.os.ios) {
			appVersion = "1";
		}
		var isConnection = plus.networkinfo.getCurrentType();
		var times = 6000;
		if(isConnection == 0 || isConnection == 1) {
			times = 0;
		}
		var wwt = plus.nativeUI.showWaiting();
		mui.ajax(basePath + 'getAppVersion', { //f1_zyxAction/!submit.json
			data: {
				SYS: v
			},
			dataType: 'json', //服务器返回json格式数据
			cache: false,
			type: 'get', //HTTP请求类型
			timeout: times, //超时时间设置为10秒； 
			success: function(data) {
				wwt.close();
				var datas = data.version.data;
				var btnArray = ['确定', '取消'];
				if(datas.length != 0 && (arrStr(datas[0].appVersion) - arrStr(v)) > 0) {
					wgtUrl = datas[0].url;
					mui.confirm('新版本发布，您是否确认升级？', '系统提示', btnArray, function(e) {
						if(e.index == 0) {
							//增量更新app
							_App.version.update(wgtUrl);
						}
					});
				}
				//服务器返回响应，根据响应结果，分析是否登录成功；
			},
			error: function() {
				wwt.close();
				mui.alert("网络连接出错或服务端未开启!");
			}
		});
		//			updateApp();
	});
}

function arrStr(str) {
	var localArr = str.split('.');
	var localStr = "";
	for(var i = 0; i < localArr.length; i++) {
		localStr = localStr + localArr[i];
	}
	var i = parseInt(localStr);
	return i;
}

function sbmtData() { //记录首页，营销，工作圈，我的页面的访问时间
	try {
		var viewData = JSON.parse(localStorage.getItem("viewData"));
		var len = viewData.viewId.length;
		var submitArray = {
			"id": [],
			"userId": [],
			"unitId": [],
			"visitTime": [],
			"curViewId": [],
			"curPath": [],
			"curTitleName": [],
			"lastPath": [],
			"lastTitleName": [],
			"startTm": [],
			"endTm": []
		}
		for(var i = 1; i < len; i++) {
			var endTime = (new Date().getTime() / 1000).toFixed(1); //结束时间
			var visitTime = (endTime - viewData.startTime[i]).toFixed(1); //访问时长
			var timeData = new Date();
			var be = timeData.toLocaleDateString().replace(/[^0-9:\s]/g, '/');
			be = be.substring(0, be.length);
			var endTm = be + ' ' + timeData.getHours() + ':' + timeData.getMinutes() + ':' + timeData.getSeconds(); //开始时间：格式：年月日时分秒
			submitArray.id[i - 1] = plus.storage.getItem('_userId').toString() + (new Date().getTime()).toString();
			submitArray.userId[i - 1] = plus.storage.getItem('_userId');
			submitArray.unitId[i - 1] = plus.storage.getItem('_unitId');
			submitArray.visitTime[i - 1] = visitTime;
			submitArray.curViewId[i - 1] = viewData.viewId[i];
			submitArray.curPath[i - 1] = viewData.viewPath[i];
			submitArray.curTitleName[i - 1] = viewData.currentTitle[i];
			submitArray.lastPath[i - 1] = viewData.viewPath[i - 1];
			submitArray.lastTitleName[i - 1] = viewData.currentTitle[i - 1];
			submitArray.startTm[i - 1] = viewData.startTm[i];
			submitArray.endTm[i - 1] = endTm;
		}
		console.log('submitArrayContent='+submitArray.id);
		visitLogHist.submitData(submitArray)
	} catch(e) {
		//TODO handle the exception
		return;
	}
}