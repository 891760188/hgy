/*!
 *	changzh
 *  Date: 2016-08-17
 *  判断当前浏览器信息
 */

(function() {
	 var userAgent = navigator.userAgent;
	_App.os = {};
    _App.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
    _App.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
    _App.os.androidICS = _App.os.android && userAgent.match(/(Android)\s4/) ? true : false;
    _App.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
    _App.os.iphone = !_App.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;

    _App.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
    _App.os.touchpad = _App.os.webos && userAgent.match(/TouchPad/) ? true : false;
    _App.os.ios = _App.os.ipad || _App.os.iphone;
    _App.os.playbook = userAgent.match(/PlayBook/) ? true : false;
    _App.os.blackberry10 = userAgent.match(/BB10/) ? true : false;
    _App.os.blackberry = _App.os.playbook || _App.os.blackberry10|| userAgent.match(/BlackBerry/) ? true : false;
    _App.os.chrome = userAgent.match(/Chrome/) ? true : false;
    _App.os.opera = userAgent.match(/Opera/) ? true : false;
    _App.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
    _App.os.ie = userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false;
    _App.os.ieTouch = _App.os.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
    _App.os.tizen = userAgent.match(/Tizen/i)?true:false;
    _App.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || "ontouchstart" in window);
    _App.os.kindle=userAgent.match(/Silk-Accelerated/)?true:false;
    //features
   
    
    if (_App.os.android && !_App.os.webkit)
        _App.os.android = false;
	//console.log('os info init finished!');
	
	/*
	 * 判断当前是否为ios
	 */
	//console.log('是否为ios：'+_App.os.ios);
	/*
	 * 判断当前是否为android
	 */
	//console.log('是否为android：'+_App.os.android);
	/*
	 * 判断当前是否为chrome
	 */
	//console.log('是否为chrome：'+_App.os.chrome);
}())




