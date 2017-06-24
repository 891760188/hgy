/*!
 *	changzh
 *  Date: 2015-07-06
 *  移动应用主文件
 */
var _App = {
	/**
	 * App初始化方法
	 * @param {Object} options
	 */
	init: function(options) {
		var that = this;
		var appConfig = mui.extend(true, that.config, options || {});
		that.config = appConfig;
		var muiConfig = appConfig;
		//alert('app init');
		if(mui.isObject(appConfig.pageInfoConfig)) {
			var scrollerConfig = mui.extend(true, that.scrollerFactory.defaults, options.pageInfoConfig || {});
			that.scroller = that.scrollerFactory.init(scrollerConfig);
			muiConfig.pullRefresh = {
				container: '#'+appConfig.pageInfoConfig.scrollerId,//'#pullrefresh',
				down: {
					callback: that.scroller.pulldownRefresh
				},
				up: {
					contentdown: '',
					contentrefresh: '正在载入...',
					callback: that.scroller.pullupRefresh
				}
			};
		} 
		muiConfig.swipeBack = appConfig.swipeBack;
		if(appConfig.preloadPages) {
			muiConfig.preloadPages = appConfig.preloadPages;
		}
		if(mui.isFunction(appConfig.uiReady)) {
			that.uiReady = appConfig.uiReady;
		}
		if(mui.isFunction(appConfig.deviceReady)) {
			that.deviceReady = appConfig.deviceReady;
		}
		//alert('muiConfig:'+JSON.stringify(muiConfig));
		try{
			mui.init(muiConfig);
		}catch(e){
			console.log('something is error '+e.getMessage());
		}
		
		//console.log('mui init');
	},
	//ui加载完成调用
	uiReady: false,
	//设备资源加载完成调用
	deviceReady: false,
	/**
	 * 分页实例
	 */
	scroller: false,
	/**
	 * 加载信息
	 */
	showWaiting: false,
	/**
	 * 应用默认配置
	 */
	config: {
		swipeBack: false,
		screenLockOrientation: true,
		pageInfoConfig: false,
		//配置mui-bar-tab属性，这里是默认值：默认不预加载
		tabConfig:{
			//标题Id
			titileId: 'title',
			//界面中是否有mui-bar-tab，有-true；否-false
			isHomePage:false,
			//是否预加载页面html
			preLoadPages: false,
			//当前界面webview对象
			curPageViewObj:false,
			//当前活动的tab
			activeTab:false,
			//子界面对象
			tabItems:false
		}
	}
};

var subpage_style = {
	top: '0px',
	bottom: '50px'
};
var aniShow = {};
mui.ready(function() {
	//read执行的内容
	if(_App.config.tabConfig.isHomePage) {
		var activeTab = _App.config.tabConfig.activeTab;
		if(!_App.config.tabConfig.preLoadPages){//不预加载
			//选项卡点击事件
			mui('.mui-bar-tab').on('tap', 'a', function(e) {
				var targetTab = this.getAttribute('href');
				if (targetTab == activeTab) {//目标已创建（存在）
					return;
				}
				//隐藏当前;
				plus.webview.hide(activeTab);
				
				//需要判断该界面是否创建
				var tempview = plus.webview.getWebviewById(targetTab);
				if(tempview){//已经创建
					//显示目标选项卡
					//若为iOS平台或非首次显示，则直接显示
					if(mui.os.ios||aniShow[targetTab]){
						plus.webview.show(targetTab);
					}else{
						//否则，使用fade-in动画，且保存变量
						var temp = {};
						temp[targetTab] = "true";
						mui.extend(aniShow,temp);
						plus.webview.show(targetTab,"fade-in",300);
					}
				}else{
					var sub = mui.createWindow({id: targetTab, url: targetTab, styles: subpage_style});
					sub.onloading = function(){
						plus.nativeUI.showWaiting( "正在加载..." );
					};
					
					sub.onloaded = function(){
						plus.nativeUI.closeWaiting();
					};
					_App.config.tabConfig.curPageViewObj.append(sub);
				}
				
				_App.config.tabConfig.activeTab = targetTab;
			});
		}else{
			//当前激活选项
			var tabItems = document.body.querySelectorAll('.mui-tab-item');
			var activeTab = null;
			if(tabItems.item(0)){
				activeTab =  tabItems.item(0).getAttribute('href');
			}
			var title = document.getElementById(_App.config.tabConfig.titleId);
			//选项卡点击事件
			mui('.mui-bar-tab').on('tap', 'a', function(e) {
				var subpage_style = {
					top: '46px',
					bottom: '50px'
				};
				var targetTab = this.getAttribute('href');
				if (targetTab == activeTab) {
					return;
				} else {
	//				var self = plus.webview.currentWebview();
	//				var sub = plus.webview.create(targetTab, targetTab, subpage_style);
	//				self.append(sub);
	//				targetTab = sub;
				}
				//更换标题
				//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
				//显示目标选项卡
				//plus.webview.show(targetTab, 'slide-in-right');
				plus.webview.show(targetTab, 'none');
				//隐藏当前;
				plus.webview.hide(activeTab);
				//更改当前活跃的选项卡
				activeTab = targetTab;
			});	
		}
	}
	if(mui.isArray(_App.config.pageInfoConfig)) {
		//alert('isArray');
		mui('.mui-scroll-wrapper').scroll({
			bounce: false,
			indicators: true //是否显示滚动条
		});
		_App.pullToRefreshFactory.init(_App.config.pageInfoConfig);
	}
	if(mui.isFunction(_App.uiReady)) {
		_App.uiReady();
	}
	//console.log('mui ready');

	/**
	 * 由于在Android6.0上出现plusReady不执行；通过测试，最后暂定需要加延迟后才执行
	 * 修改人：wuxl
	 * 时间：2017-2-17
	 * 出现问题Hbuilder版本：8.0.1
	 * 去掉setTimeout
	 * 现测试不出现
	 * 测试时间：2017-04-01
	 * 测试人：wuxl
	 * 测试Hbuilder版本：8.0.2
	 */
//	setTimeout(function() {
		mui.plusReady(function() {
			//白色顶部html集合
		//	var whiteArry=['home-page.html','mainPage_new.html','find.html','cockpit.html','my.html','finds.html','cockpit_new.html'];
			if(plus.os.name == "Android"){		
				window.top.document.querySelector('body').classList.add('androidBody');
			}else if(plus.os.name == "iOS"){
			}
			else if(plus.os.name="iOS"){
			}
				
			if(_App.config.screenLockOrientation) {
				//判断终端是pad还是手机
				if(typeof _isPad != "undefined" && _isPad){
					plus.screen.lockOrientation("landscape");
				}else{
					plus.screen.lockOrientation("portrait-primary");
				}
			}
			if(_App.config.tabConfig.isHomePage) {
				_App.config.tabConfig.curPageViewObj = plus.webview.currentWebview();
				_App.config.tabConfig.tabItems = document.body.querySelectorAll('.mui-tab-item');
				var activeTab = _App.config.tabConfig.activeTab;
				if(!_App.config.tabConfig.preLoadPages){//不需要预加载
					//活动tab存在
					if(activeTab && activeTab != "undefined"){
						if(mui.os.ios||aniShow[activeTab]){
							plus.webview.show(activeTab);
						}else{
							//否则，使用fade-in动画，且保存变量
							var temp = {};
							temp[activeTab] = "true";
							mui.extend(aniShow,temp);
							plus.webview.show(activeTab,"fade-in",300);
						}
					}else{//直接打开首页
						if(_App.config.tabConfig.tabItems.item(0)){
							activeTab =  _App.config.tabConfig.tabItems.item(0).getAttribute('href');
							
							var href = activeTab;
							var sub = mui.createWindow({id: href, url: href, styles: subpage_style});
							
							sub.onloading = function(){
								plus.nativeUI.showWaiting( "正在加载..." );
							};
							
							sub.onloaded = function(){
								plus.nativeUI.closeWaiting();
							};
							
							_App.config.tabConfig.curPageViewObj.append(sub);
						}
					}
				}else{//是预加载
					for (var i = 0; i < _App.config.tabConfig.tabItems.length; i++) {
						var href = _App.config.tabConfig.tabItems.item(i).getAttribute('href');
						var sub = mui.createWindow({id: href, url: href, styles: subpage_style});
						
						sub.onloading = function(){
							plus.nativeUI.showWaiting( "正在加载..." );
						};
						if (i > 0) {
							sub.hide();
						}
						sub.onloaded = function(){
							plus.nativeUI.closeWaiting();
						};
						_App.config.tabConfig.curPageViewObj.append(sub);
					}
				}
			}
			if(mui.isFunction(_App.deviceReady)) {
				_App.deviceReady();
			}
		});
//	},500);
	
});

