var _uck='icon-line-136';//未选择 icon-radio-unchecked
var _ck='icon-line-135';//已选择 icon-radio-checked
var _ruck='icon-line-un137';//单选未选择
var _rck='icon-line-137';

var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;
//分享表所需字段
var bizType = _App.util.getUrlParamByName("bizType");//业务类型
var bizId = _App.util.getUrlParamByName("bizId");//业务ID
var passId = _App.util.getUrlParamByName("passId");//场景特用
var ljUrl = _App.util.getUrlParamByName('ljUrl');
var sign = _App.util.getUrlParamByName('sign');//sign=1日志分享sign=2，商机分享sign=3公告分享
if(!passId || passId == "undefined")
	passId = "";
var recordId = _App.util.getUrlParamByName("recordId");//场景特用
if(!recordId || recordId == "undefined")
	recordId = "";
var _shareImgPath_="";//分享图片
var authorityType = "1";//开放式协同-1；团队内部-2；默认为1
var params = {};//分享需提交的参数
params.bizType = ""+bizType;
params.bizId = ""+bizId;
params.passId = ""+passId;
params.recordId = ""+recordId;
var find;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		//初始化按钮
		document.getElementById('gk').classList.add(_rck);
		document.getElementById('sm').classList.add(_ruck);
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		backPage = plus.webview.getWebviewById(parentwebviewid);
		find = plus.webview.getWebviewById('newfind.html');
		_shareImgPath_ = plus.storage.getItem("_shareImgPath_");
		var title = document.getElementById('smallTitle');
		if(_shareImgPath_ && _shareImgPath_ != "undefined"){//分享图片
			var path=plus.io.convertLocalFileSystemURL(_shareImgPath_);
			title.innerHTML='<div ><img src="' + path + '" class="shareImg" />';
		}else{
			if(sign=='1'){
				title.innerHTML='<div class="linkDiv"><img src="comShare.png"/><p>日志分享</p></div>';
			}else if(sign == '2'){
				title.innerHTML='<div class="linkDiv"><img src="comShare.png"/><p>商机分享</p></div>';
			}else if(sign == '3'){
				title.innerHTML='<div class="linkDiv"><img src="comShare.png"/><p>公告分享</p></div>';
			}else{
				title.innerHTML='<div class="linkDiv"><img src="comShare.png"/><p>分享</p></div>';
			}
		}
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function sendShare(){
	if(ljUrl == undefined){
		params.shareLinkAddr = "";//分享的链接地址
	}else{
		params.shareLinkAddr = ljUrl;
	}
	
	params.authorityType = ""+authorityType;//开放式协同-1；团队内部-2
	var shareContent = document.getElementById("contentId").value;
	if(!shareContent || shareContent == "undefined")
		shareContent = "";
	params.shareContent = ""+shareContent;//分享的内容；
	params.shareUrl = ""+_shareImgPath_;//分享图片地址
	//去掉缓存图片
	plus.storage.removeItem("_shareImgPath_");
	_App.share.sendShare(params,function(){
		//成功回调
		mui.fire(find,'finishShareEvent__',{
			params:params
		});
		plus.webview.currentWebview().close();
	},function(){
		//失败回调
		mui.fire(find,'finishShareEvent__',{
		});
		plus.webview.currentWebview().close();
	});
}

function getOrg() {
	_App.ajax({
		type: "GET",
//		url: basePath + "mobileColleaguesAction!getOrg.json",
		url: "data.js",  //本地demo数据模式
		cache: false,
//		dataType: "json",
		success: function(res) {
			
			var d = orgName.data;
			var _html = '';
			for(var i = 0; i < d.length; i++) {
				var _b = '<b class="mui-icon ' + _uck + ' phone-right orgSelect" style="float:right;margin-right:20px;margin-top:10px;"></b>';
				_html += '<div class="ys-accNode"><span>' + d[i].name + '</span> ';
					//如果前一个界面传过来的参数是需要选择，需要添加样式  （实际上机构只能是单选的）
					_html += _b;
				_html += '</div><div class="ys-accContent" id="' + d[i].orgId + '"> </div>'
			}
			document.getElementById('colAcd').innerHTML = _html;
			//加载完机构之后，在加载机构里面的数据
			getOrgData();
		},
		error: function(r) {
		}
	});
};
/**
 * 加载机构 2
 */
function getOrg2() {
	_App.ajax({
		type: "GET",
//		url: basePath + "mobileColleaguesAction!getOrg.json",
		url: "data.js",  //本地demo数据模式
		cache: false,
//		dataType: "json",
		success: function(res) {
			
			var d = orgName.data;
			var _html = '';
			for(var i = 0; i < d.length; i++) {
				var _b = '<b class="mui-icon ' + _uck + ' phone-right orgSelect" style="float:right;margin-right:20px;margin-top:10px;"></b>';
				_html += '<div class="ys-accNode"><span>' + d[i].name + '</span> ';
					//如果前一个界面传过来的参数是需要选择，需要添加样式  （实际上机构只能是单选的）
					_html += _b;
				_html += '</div><div class="ys-accContent" id="c' + d[i].orgId + '"> </div>'
			}
			document.getElementById('colAcd2').innerHTML = _html;
			//加载完机构之后，在加载机构里面的数据
			getOrgData2();
		},
		error: function(r) {
		}
	});
};
/**
 * 加载机构数据
 */
function getOrgData() {
		_App.ajax({
			type: 'get',
//			url: basePath + "mobileColleaguesAction!getOrgDatas.json",
			url: "data.js",  //本地demo数据模式
			cache: false,
//			dataType: "json",
			success: function(res) {
				var data = org.data;

				for(var i = 0; i < data.length; i++) {
					var _html = '';
					var dataFun = "";
					var _span = '';
						dataFun = 'mulSelect("org_' + data[i].ID + '")'
							//把电话按钮改成  选择 ,添加id方便修改样式
						_span = '<span id="org_' + data[i].ID + '"  data-fn="choose('+data[i].ID+')" class="mui-icon ' + _uck + ' phone-right orgContent" ></span>';

					_html = '<div class="ys-accNode"  data-fn=' + dataFun + '><div class="ys-anContent"><b>';
					_html += '<img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" /></b>' + data[i].name + '<i>' + data[i].position + '</i>';
					_html += _span;
					_html += '</div></div>';
					document.getElementById(data[i].orgId).innerHTML += _html;
//					document.getElementById('org_' + data[i].ID  ).addEventListener('tap',function(){
//						
//					})
					
				}

			},
			error: function() {
				alert('加载失败！')
			}
		});

}

/**
 * 加载机构数据2
 */
function getOrgData2() {
		_App.ajax({
			type: 'get',
//			url: basePath + "mobileColleaguesAction!getOrgDatas.json",
			url: "data.js",  //本地demo数据模式
			cache: false,
//			dataType: "json",
			success: function(res) {
				var data = org.data;

				for(var i = 0; i < data.length; i++) {
					var _html = '';
					var dataFun = "";
					var _span = '';
						dataFun = 'mulSelect("org_' + data[i].ID + '")'
							//把电话按钮改成  选择 ,添加id方便修改样式
						_span = '<span id="org_' + data[i].ID + '"  data-fn="'+data[i].ID+'" class="mui-icon ' + _uck + ' phone-right orgContent" ></span>';

					_html = '<div class="ys-accNode"  data-fn=' + dataFun + '><div class="ys-anContent"><b>';
					_html += '<img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" /></b>' + data[i].name + '<i>' + data[i].position + '</i>';
					_html += _span;
					_html += '</div></div>';
					document.getElementById("c"+data[i].orgId).innerHTML += _html;
				}

			},
			error: function() {
				alert('加载失败！')
			}
		});

}




/*
 * 选择机构下的成员
 */
function choose(userId,span) {
	var obj = span;
	if (obj.classList.contains(_ck)) {
		obj.classList.add(_uck);
		obj.classList.remove(_ck);
	} else {
		//选中 机构子节点
		obj.classList.remove(_uck);
		obj.classList.add(_ck);
		//使一级选择消失
		document.getElementById('gk').classList.add(_ruck);
		document.getElementById('gk').classList.remove(_rck);
		
		document.getElementById('sm').classList.add(_ruck);
		document.getElementById('sm').classList.remove(_rck);
	}
}

/**
 * 选择机构
 */
function chooseOrg(span){
	var obj = span;
	if (obj.classList.contains(_ck)) {
		obj.classList.add(_uck);
		obj.classList.remove(_ck);
	} else {
		//选中
		obj.classList.remove(_uck);
		obj.classList.add(_ck);
		//使一级选择消失
		document.getElementById('gk').classList.add(_ruck);
		document.getElementById('gk').classList.remove(_rck);
		
		document.getElementById('sm').classList.add(_ruck);
		document.getElementById('sm').classList.remove(_rck);
	}
}
/**
 * 根据父节点变换子节点
 */
function changeChild(parent,span){
	var obj = span;
	if (parent.classList.contains(_ck)) {
		obj.classList.add(_ck);
		obj.classList.remove(_uck);
	} else {
		obj.classList.add(_uck);
		obj.classList.remove(_ck);
	}
}
