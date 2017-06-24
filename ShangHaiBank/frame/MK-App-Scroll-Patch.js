/*!
 *	changzh
 *  Date: 2015-12-11
 *  滑动刷新补丁
 */

if (window.plus) {
	setTimeout(function() { //解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
		_doPatchAction();
	}, 0);
} else {
	document.addEventListener("plusready", function() {
		_doPatchAction();
		setTimeout(function() {
			_resetUserAgent();
		}, 1000);
	}, false);
}
var _userAgent = null;
function _doPatchAction() {
	if(plus.os.name == 'Android'){
		_userAgent = plus.navigator.getUserAgent();
		//console.log('_doPatchAction before--------------'+_userAgent);
		plus.navigator.setUserAgent( "Application/Html5Plus/1.0" );
		//plus.navigator.setUserAgent( "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Mobile Safari/537.36 Html5Plus/1.0" );
		//console.log('_doPatchAction end--------------'+_userAgent);
	}
}
function _resetUserAgent() {
	
	if(plus.os.name == 'Android' && _userAgent != null) {
		//console.log('resetuseragent'+_userAgent);
		plus.navigator.setUserAgent(_userAgent);
	}
}