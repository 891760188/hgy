/*!
 *	changzh
 *  Date: 2015-07-13
 *  demo页面 :多页签页面
 */

//App配置信息
var appConfig = {
	//分页配置
	tabConfig: {
		//标题Id
		titileId: 'title',
		//是否预加载页面html--默认是不预加载
		preLoadPages: false,
		//是否是首页，是-true；否-false
		isHomePage: true
	},
	//ui加载完成调用
	uiReady: function() {
		document.getElementById('cjyx').addEventListener('tap', function() {
			var CJisRead = localStorage.getItem('CJisRead');
			if (CJisRead == "0") {
				var backpage = plus.webview.getWebviewById('mainPage.html');
				backpage.reload();
			}
		});
		document.getElementById('workCicle').addEventListener('tap',function(){
			var sub = plus.webview.getWebviewById('newfind.html');
			mui.fire(sub,'WORK_CICLE_CLICK');
		})
		

	},
	//设备资源加载完成调用
	deviceReady: function() {}
};
/**
 * 页面初始化
 */
_App.init(appConfig);