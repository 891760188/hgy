/*!
 *	changzh
 *  Date: 2015-07-06
 *  工具集
 */
(function($) {
	var _Util = {
		goPage: function(url, params) {
			var defaultParam =  {
				refresh : true,//是否刷新已存在page
				aniShow : 'slide-in-right',//页面显示动画，默认为”slide-in-right“；
				duration : 200//页面动画持续时间
			};
			defaultParam.pageId = url + '-id';
			var config = mui.extend(true, defaultParam, params || {});
			//console.log('viewId='+config.pageId)
			//console.log('refresh='+config.refresh)
			if(typeof params == 'string'){
				config.aniShow = params;
			}
			if(config.refresh) {
				var hisPage = plus.webview.getWebviewById(config.pageId);
				plus.webview.close(hisPage);
			}
			mui.openWindow({
				url: url,
				id: config.pageId,
				extras: config,
				show:{
			      autoShow: true,//页面loaded事件发生后自动显示，默认为true
			      aniShow: config.aniShow,//页面显示动画，默认为”slide-in-right“；
			      duration: config.duration//页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			    },
				waiting:{
			      autoShow: true,//自动显示等待框，默认为true
			      title: '正在载入...'//等待对话框上显示的提示内容
			    }
			});
		},
		alertJSON: function(json) {
			alert(JSON.stringify(json));
		},
		/***
		 * 将URL中串?param1=value1&param2=value2
		 * 转换成对象数组
		 */
		getUrlParam: function(string) {  
			var obj =  new Array();  
			if (string.indexOf("?") != -1) {  
				string = string.substr(string.indexOf("?") + 1); 
			} 
			var strs = string.split("&");  
			for(var i = 0; i < strs.length; i ++) {  
				var tempArr = strs[i].split("=");  
				obj[i] = decodeURIComponent(tempArr[1]);
			}
			return obj;  
		},
		/***
		 * 将URL中串?param1=value1&param2=value2
		 * 转换成对象{param1 : 'value1', param2 : 'value2'}
		 */
		getUrlObj: function(string) {  
			var obj =  new Object();  
			if (string.indexOf("?") != -1) {  
				string = string.substr(string.indexOf("?") + 1); 
			} 
			var strs = string.split("&");  
			for(var i = 0; i < strs.length; i ++) {  
				var tempArr = strs[i].split("=");  
				obj[tempArr[0]] = decodeURIComponent(tempArr[1]);
			}
			return obj;  
		},
		/**
		 * 获得当前url参数值
		 * @param name 参数名
		 */
		getUrlParamByName: function(name) {  
			return _Util.getUrlObj(document.URL)[name];
		},
		/**
		 * 判断是否为微信内置浏览器
		 */
		isWeiXin: function(){ 
			var ua = window.navigator.userAgent.toLowerCase(); 
			if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
				return true; 
			}else{ 
				return false; 
			} 
		} 
	};
	_App.util = _Util;
	//alert('util init finished!');
	console.log('util init finished!');
}(mui))