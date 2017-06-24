/*!
 *	changzh
 *  Date: 2016-01-22
 *  全局事件组件
 */
/*--------------------------使用方式：---------------------------
 * 
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
 * --------------------------------------------------------------
 */
(function($) {
	var _events = [];
    _events.addListener = function(eventName, fn) {
        window.addEventListener(eventName, fn);
        _events.push(eventName);
    }
    _events.removeListener = function(fn) {
        window.removeEventListener(fn);
    }
    _events.fireEvent = function(eventName, args, webviewId) {
    	
        if (webviewId) {
            var wv = plus.webview.getWebviewById(webviewId);
            mui.fire(wv, eventName, args);
        } else {
            var views = plus.webview.all();
            for (var i = 0; i < views.length; i  ) {
                mui.fire(views[i], eventName, args);
            }
        }
    }
	$.AppEvent = _events;
	//console.log('AppEvent init finished!');
}(mui))


