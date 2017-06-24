/*!
 *	changzh
 *  Date: 2015-07-06
 *  移动应用api
 */
(function($) {
	/*
	 * 组件名称：单列表下拉刷新
	 * 使用方式：
	 * 		1、初始化 pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.pulldownRefresh();//查询
	   	}
	 */
	 var _App.scroller = false;
	 //--------------------------------------------------------------
	 
	/*      
	 * 组件名称：多列表下拉刷新
	 * 使用方式：
	 * 		_App.pullToRefreshFactory.scrollers[i].loadData(true);
	 */ 	
	var _App.pullToRefreshFactory.scrollers = false;
	//--------------------------------------------------------------
	
	/**
	 * 组件名称：应用工具类
	 * 使用方式：
	 * 如：页面跳转
	 *	_App.util.goPage(url);
	 */
	var _App.util = false;
	//--------------------------------------------------------------
	
	/**
	 * 组件名称：应用ajax
	 * 使用方式：
	 *	_App.ajax({
     *		type : "GET",
     *		url :  url,
	 *		cache : false, 
	 *		async : false,
	 *		dataType : 'application/json',
	 *		success : function(response){
	 *			//TODO successhandler
	 *		},
	 *		error: function(XMLHttpRequest, textStatus, errorThrown){
	 *			//TODO successhandler
	 *		}
	 *	});
	 */
	var _App.ajax = false;
	//--------------------------------------------------------------
	
	
	/*
	 * 组件名称：全局事件组件
	 * 使用方式：
	 * eventName: 事件名称
	 * viewId: webview的id
	 * agrs: 事件参数
	 * 
	 * 1、在监听及触发事件的页面中引入这个js；
	 * 2、在deviceReady里面调用
	 *      mui.AppEvent.addListener(eventName, function(agrs) {}); //添加事件监听
	 *  如：
	 * 		mui.plusReady(function(){
		  		mui.AppEvent.addListener('myEvent', function(event) {
					var agrs = event.detail;
					//TODO
				});
			});
	 * 3、功能页面调用
	 *      mui.AppEvent.fireEvent(eventName, agrs, viewId)
	 */
	var AppEvent.addListener = false;
	//--------------------------------------------------------------
	
	/*
	 * 组件名称：文件组件
	 * 使用方式一：_App.file.getFileText(url);
	 * 使用方式二：
	 * 
		var callback = function(text){
			mui.alert(text, '查看html');
		};
	 * _App.file.getFileText(url, callback);
	 * 
	 */
	var _App.file = false;
	//--------------------------------------------------------------
	
	/*
	 * 组件名称：文件组件
	 * 使用方式：
	 *    1：_App.file.getFileText(url);
	 *    2：
			var callback = function(text){
				mui.alert(text, '查看html');
			};
	 *    _App.file.getFileText(url, callback);
	 * 
	 */
	var _App.file = false;
	
	/*
	 * 组件名称：网络状态组件
	 * 使用方式：
	 *    _App.netWork.isConnection();
	 */
	var _App.netWork = false;
	
	/*
	 * 组件名称：session组件
	 * 使用方式：
		 var user = {};//用户信息对象
		 _App.sessionInit(user);
	 */
	var _App.sessionUser = false;
	/*
	 * 组件名称：版本管理组件
	 * 使用方式：
	 *    _App.version.getVerison(fn);
	 */
	var _App.version.getVerison = false;
	//--------------------------------------------------------------
	
}(mui))

