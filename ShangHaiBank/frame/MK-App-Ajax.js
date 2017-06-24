/*!
 *	changzh
 *  Date: 2015-07-06
 *  ajax扩展
 */

(function($) {
	var _AjaxConfig = {
		type : "GET",
		url :  false,
		cache : false, 
		async : false,
		//timeout : 180,
		//error : {},
		dataType : 'application/json'
	};
	
	var _Ajax = function(options) {
		var config = options;
		var error = options.error;
		if(mui.isFunction(options.error)) {
			config.error = function(context, xhr, type) {
				if(context != null && context.status == '600') {
					mui.alert('超时请您重新登录。', '系统提示', '确定', function(){
						var indexview = plus.webview.getLaunchWebview();
						mui.fire(indexview, 'logoutEvt');
						plus.webview.show(indexview); 
					});
				} else {
					error(context, xhr, type);
				}
			}
		}
		var ajaxConfig = mui.extend(true, _AjaxConfig, config || {});
		
		return mui.ajax(ajaxConfig);
	}
	_App.ajax = _Ajax;
	console.log('_App.ajax init finished!');
}(mui))
