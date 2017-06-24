/*!
 *	changzh
 *  Date: 2016-05-09
 *  app后台运行事件监听
 */

(function($) {
	/**
	 * 默认配置
	 */
	var _config = {
		//是否监听运行状态
		stateListener: true,
		stateChangeHandler: function() {
			mui.alert('进入后台运行时间过长，请重新登录。', '系统提示', '确定', function() {
				var indexview = plus.webview.getLaunchWebview();
				mui.fire(indexview, 'logoutEvt');
				plus.webview.show(indexview);
			});
		},
		//运行到后台超时时间：单位秒
		timeOut: 1800

	};

	function onPlusReady() {
		document.addEventListener("pause", onAppPause, false);
	}
	/**
	 * 切换到后台运行
	 */
	function onAppPause() {
		var date = new Date();
		var timestamp = date.getTime()
		localStorage.setItem("_backRunTime", timestamp);
		//console.log('pauseTime 时间为:' + timestamp)
		//console.log( "Application paused!" ); 
	}
	/**
	 * 切换回当前App
	 */
	function onAppReume() {
		var timestamp = new Date();
		var pauseTime = localStorage.getItem("_backRunTime");
		var currentTime = timestamp.getTime();
		var backRunTime = (currentTime - pauseTime);
		//console.log('resumeTime时间为:' + currentTime)
		//console.log('进入后台运行时间为:' + backRunTime)
		var timeOut = _config.timeOut;
		if(localStorage.getItem("settingTime") && localStorage.getItem("settingTime") != null){
			timeOut = parseInt(localStorage.getItem("settingTime"));
		}
		if (backRunTime / 1000 > timeOut && mui.isFunction(_config.stateChangeHandler)) {
			_config.stateChangeHandler();
		}
		
		//console.log(timeOut);
	}
	if (_config.stateListener) {
		// 扩展API加载完毕后调用onPlusReady回调函数 
		document.addEventListener("plusready", onPlusReady, false);
		document.addEventListener("resume", onAppReume, false);
	}

	console.log('stateListener init finished!');
}(mui))