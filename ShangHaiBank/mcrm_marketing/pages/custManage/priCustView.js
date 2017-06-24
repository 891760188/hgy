var potentialFlag = _App.util.getUrlParamByName('potentialFlag');
var custId = _App.util.getUrlParamByName('custId');
var appConfig = {
	//分页配置
	tabConfig: {
		//标题Id
		titileId: 'title',
		//是否预加载页面html
		preLoadPages: false,
		isHomePage: true
	},
	//ui加载完成调用
	uiReady: function() {
		var _html = '<a class="mui-tab-item mui-active" href="priCustPortrait.html?potentialFlag=' + potentialFlag + '&custId=' + custId + '">' +
			'<span class="mui-icon mui-icon-list"></span>' +
			'<span class="mui-tab-label">客户画像</span>' +
			'</a>' +
			'<a class="mui-tab-item" href="priCustomerDetail.html?potentialFlag=' + potentialFlag + '&custId=' + custId + '">' +
			'<span class="mui-icon mui-icon-list"></span>' +
			'<span class="mui-tab-label">客户详情</span>' +
			'</a>' +
			'<a class="mui-tab-item" href="comCustomerDate.html">' +
			'<span class="mui-icon mui-icon-map"></span>' +
			'<span class="mui-tab-label">营销足迹</span>' +
			'</a>' +
			'<a class="mui-tab-item" href="priAtlas.html">' +
			'<span class="mui-icon mui-icon-map"></span>' +
			'<span class="mui-tab-label">图谱</span>' +
			'</a>';
		document.getElementById('nav').innerHTML = _html;
		//自定义事件，模拟点击“首页选项卡”
		document.addEventListener('gohome', function() {
			var defaultTab = document.getElementById("defaultTab");
			//模拟首页点击
			mui.trigger(defaultTab, 'tap');
			//切换选项卡高亮
			var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
			if(defaultTab !== current) {
				current.classList.remove('mui-active');
				defaultTab.classList.add('mui-active');
			}
		});
	},
	//设备资源加载完成调用
	deviceReady: function() {}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if(targetTab == "priCustomerDetail.html") {
		var vid = plus.webview.getWebviewById("priCustomerDetail.html");
		mui.fire(vid, "refrashPriCustDetailEve", {
			act: "refresh"
		});
	}
});