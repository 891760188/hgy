/*!
 *	changzh
 *  Date: 2015-07-06
 *  移动应用引导文件
 */
var _AppName = 'shh_gj';
var _filePath = document.URL;
var _pathName = document.location.pathname;
var _projectName = _pathName.substring(1, _pathName.substr(1).indexOf('/') + 1);
var _chartsColors = ["#4896cd", "#ff713c", "#78bc27", "#f99900", "#36cbde","#608cf4","#f2eb32","#dc97ff","#ff8c8f","#47f7a4","#f9b966"];
var _androidSUBHeight = "";//subPage默认top高度，iphone=44px，android=68px

//alert('_projectName='+_projectName);
//运行模式判断
if(_filePath.indexOf('/www/') != -1){
	//真机或模拟器模式
	_projectName = '/www/';
} else {
	_projectName = '/'+ _projectName +'/';
}
var docURL = _filePath;
if(document.URL.indexOf('?') != -1) {
	docURL = _filePath.substring(0 , document.URL.indexOf('?'));
} 

_filePath = _filePath.substring(docURL.indexOf(_projectName) + (_projectName.length), docURL.length);
var _pathDeep = (_filePath.split('/')).length - 1;

_filePath = '';
if (_pathDeep >= 1) {
	for (var i = 0; i < _pathDeep; i++) {
		_filePath += '../';
	}
}
/**
 * 设置_androidSUBHeight值
 */
var userAgent = navigator.userAgent;
var __os__ = {};
__os__.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
__os__.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
__os__.iphone = !__os__.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
__os__.ios = __os__.ipad || __os__.iphone;
__os__.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
if (__os__.android && ! __os__.webkit)
    __os__.android = false;
if(__os__.android)
	_androidSUBHeight = "68px";
else
	_androidSUBHeight = "44px"; 
//应用配置文件
document.write('<script src="' + _filePath + _AppName +'/pages/common/AppConfig.js"></script>');

//应用样式文件
document.write('<link rel="stylesheet" type="text/css" href="' + _filePath + 'resource/mui/css/mui.min.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="' + _filePath+ _AppName +'/themes/default/main.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="' + _filePath+ _AppName +'/themes/common/fonts/style.css"/>');
document.write('<link rel="stylesheet" type="text/css" href="' + _filePath +'resource/mui/css/mui.picker.min.css"/>');

//js脚本文件
document.write('<script src="' + _filePath + 'resource/mui/js/mui.min.js"></script>');
document.write('<script src="' + _filePath + 'resource/mui/js/mui.pullToRefresh.js"></script>');
document.write('<script src="' + _filePath + 'resource/mui/js/mui.pullToRefresh.material.js"></script>');
document.write('<script src="' + _filePath + _AppName +'/resource/echarts3/echarts.min.js"></script>');
document.write('<script src="' + _filePath + _AppName +'/resource/jquery/jquery-1.10.2.min.js"></script>');
document.write('<script src="' + _filePath + _AppName +'/resource/mui/js/mui.picker.min.js"></script>');
document.write('<script src="' + _filePath + _AppName +'/resource/mui/js/instructionData.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-Scroll.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-PullToRefresh.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-Util.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-Patch.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-Ajax.js"></script>');
document.write('<script src="' + _filePath + 'frame/MK-App-SessionUser.js"></script>');
document.write('<script src="' + _filePath + _AppName +'/pages/common/ui.js"></script>');


