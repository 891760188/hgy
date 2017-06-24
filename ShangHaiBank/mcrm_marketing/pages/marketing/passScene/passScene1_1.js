var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");
var cwebviewId;//当前界面ID
var _step_ = "";//记录当前关步骤
var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
	},
	//设备资源加载完成调用
	deviceReady: function() {
		cwebviewId = plus.webview.currentWebview().id;
		cwebviewId = encodeURIComponent(cwebviewId);
		backPage = plus.webview.getWebviewById(parentwebviewid);
		getSceneFlowMes();
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

/**
 * 由过关场景ID、记录ID获取场景流程信息
 */
function getSceneFlowMes(){
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!queryThePassAllStepMes.json',
		data:{passId:passId,recordId:recordId},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			showSceneFlowMes(data);
		},
		error:function(){
			ws.close();
			mui.alert('加载失败！');
		}
	});
}
var cmap;//当前关流程信息
var ps_finish_flag = "N";
function showSceneFlowMes(data){
	for(var i = 0; i < data.length; i++){
		var d = data[i];
		var step = ""+d.STEP;
		var psFinishFlag = ""+d.PS_FINISH_FLAG;//ps_finish_flag == Y -- 通关 
		var finishFlag = ""+d.FINISH_FLAG; 
		
		if(psFinishFlag == "Y" && 1*finishFlag == 1){
			_step_  = step;
			ps_finish_flag = "Y";
			//已通关，暂时加载最后一关的数据
			cmap = "";
		}	
		var status_css = "";
		if(finishFlag){
			if(1 == 1*finishFlag)
				status_css = "ed";
			else if(0 == 1*finishFlag){
				_step_ = step;
				status_css = "ing";
				//需要加载当前关的信息
				cmap = d;
			}else 
				status_css = "";
		}
		var _obj_ = document.getElementById("anBoxDivId");
		var div_str = document.createElement("div");
		if(1*step == 1){//第一关
			div_str.className = 'an-node '+status_css+'';
			div_str.setAttribute("style","left: 28%;top: 75%;");
			div_str.setAttribute("data-info",''+d.RECORD_ID+','+d.STEP+','+d.PASS_ID+','+d.P_NODE_ID+','+d.ACTIVITY_ID+','+d.PS_FINISH_FLAG+','+finishFlag+','+d.ACTIVITY_REF_IDS+','+d.NAME+'');
			div_str.innerHTML = "1<span>"+d.NAME+"<i></i></span>";
		}else if(1*step == 2){//第二关
			div_str.className = 'an-node '+status_css+'';
			div_str.setAttribute("style","left: 48%;top: 58%;");
			div_str.setAttribute("data-info",''+d.RECORD_ID+','+d.STEP+','+d.PASS_ID+','+d.P_NODE_ID+','+d.ACTIVITY_ID+','+d.PS_FINISH_FLAG+','+finishFlag+','+d.ACTIVITY_REF_IDS+','+d.NAME+'');
			div_str.innerHTML = "2<span>"+d.NAME+"<i></i></span>";
		}else if(1*step == 3){//第三关
			div_str.className = 'an-node '+status_css+'';
			div_str.setAttribute("style","left: 56%;top: 38%;");
			div_str.setAttribute("data-info",''+d.RECORD_ID+','+d.STEP+','+d.PASS_ID+','+d.P_NODE_ID+','+d.ACTIVITY_ID+','+d.PS_FINISH_FLAG+','+finishFlag+','+d.ACTIVITY_REF_IDS+','+d.NAME+'');
			div_str.innerHTML = "3<span>"+d.NAME+"<i></i></span>";
		}else if(1*step == 4){//第四关
			div_str.className = 'an-node '+status_css+'';
			div_str.setAttribute("style","left: 28%;top: 26%;");
			div_str.setAttribute("data-info",''+d.RECORD_ID+','+d.STEP+','+d.PASS_ID+','+d.P_NODE_ID+','+d.ACTIVITY_ID+','+d.PS_FINISH_FLAG+','+finishFlag+','+d.ACTIVITY_REF_IDS+','+d.NAME+'');
			div_str.innerHTML = "4<span>"+d.NAME+"<i></i></span>";
		}else if(1*step == 5){//第五关
			div_str.className = 'an-node '+status_css+'';
			div_str.setAttribute("style","left: 63%;top: 14%;");
			div_str.setAttribute("data-info",''+d.RECORD_ID+','+d.STEP+','+d.PASS_ID+','+d.P_NODE_ID+','+d.ACTIVITY_ID+','+d.PS_FINISH_FLAG+','+finishFlag+','+d.ACTIVITY_REF_IDS+','+d.NAME+'');
			div_str.innerHTML = "5<span>"+d.NAME+"<i></i></span>";
		}
		_obj_.appendChild(div_str);
	}
	
	var obj_ = document.getElementById("anStateDivId");
	obj_.style.display="";
	if(ps_finish_flag == "Y"){
		obj_.classList.add("finished");
		obj_.innerHTML = "已通关";
	}else{
		obj_.classList.remove("finished");
		obj_.innerHTML = "进行中";
	}
	
	var _h=document.getElementById('anBg').clientHeight-document.getElementsByClassName('an-wrapper')[0].clientHeight;
	mui('.mui-scroll-wrapper').scroll({startY:-(_h-50)});//
	
	//绑定节点onclick事件
	mui("#anBoxDivId").on('tap','.an-node',function(){
		var dataInfo = this.getAttribute("data-info");
		var di = dataInfo.split(",");
		var m = {};
		m.RECORD_ID = di[0];
		m.STEP = di[1];
		m.PASS_ID = di[2];
		m.P_NODE_ID = di[3];
		m.ACTIVITY_ID = di[4];
		m.PS_FINISH_FLAG = di[5];
		m.FINISH_FLAG = di[6];
		m.ACTIVITY_REF_IDS = di[7];
		m.NAME = di[8];
		if(1*_step_ >= 1*m.STEP)
			loadCurrentSceneData(m);
	});
//	console.log("cmap>>>"+JSON.stringify(cmap));
	loadCurrentSceneData(cmap);
}


function loadCurrentSceneData(data){
	if(ps_finish_flag == "Y" && !data){
		//说明已经通过
		var html = '<h1><b>已通关</b><i>已通关</i></h1>';
		html+='<div style="color: #ff713c;text-align: center;line-height: 90px;margin-right:0px;font-size:18px">恭喜你，通关了！</div>';
		document.getElementById("anNodeInfoDivId").innerHTML = html;
		return;
	}
	var step = ""+data.STEP;
	if(1*step == 1){//第一关
		getSceneOneStepMes(data);
	}else if(1*step == 2){//第二关
		getSceneSecondStepMes(data);
	}else if(1*step == 3){//第三关
		getSceneSecondStepMes(data);
	}else if(1*step == 4){//第四关
		getSceneSecondStepMes(data);
	}else if(1*step == 5){//第五关
		getSceneSecondStepMes(data);
	}
}

function getSceneSecondStepMes(data_){
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data:{activeId:data_.ACTIVITY_ID},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var name_ = "";
			if(1*data_.STEP == 2)
				name_ = "客户查看";
			else if(1*data_.STEP == 3)
				name_ = "客户拜访";
			else if(1*data_.STEP == 4)
				name_ = "商机创建";
			else if(1*data_.STEP == 5)
				name_ = "商机达成";
			
			var bstr = "";
			var statestr = "";
			if(1*data_.FINISH_FLAG == 0){
				bstr = '<div id="go2Detail"><img src="tg.png" class="tgPng"></img></div>';//"过关";
				statestr = "正在进行";
			}else if(1*data_.FINISH_FLAG == 1){ 
				bstr = '<button id="xqbutId">详情</button>';
				statestr = "已完成";
			}else{
				bstr = '<button id="xqbutId">详情</button>';
				statestr = "未开始";
			}
			var html = '<h1><b>第'+data_.STEP+'关：'+name_+'</b><i>'+statestr+'</i></h1>';
			html += '<div><p>'+data[0].CUST_NAME+'</p>';
			html += '<p>电话：'+data[0].MOBILE+'</p>';
			html += '<p>地址：'+data[0].LOCATION+'</p>';
			html += '</div>'+bstr;
			var _obj_ = document.getElementById("anNodeInfoDivId");
			_obj_.innerHTML = html;
			
			var go2ggFn = function(){
				data_.CUST_ID = "" + data[0].CUST_ID;
				data_.CUST_NAME = data[0].CUST_NAME;
				go2sceneOneDetail(data_);
			};
			var go2xqFn = function(){
				data_.CUST_ID = "" + data[0].CUST_ID;
				data_.CUST_NAME = data[0].CUST_NAME;
				go2sceneOneDetail(data_);
			};
			var ggobj = document.getElementById("go2Detail");
			if(ggobj && ggobj != "undefined"){
				ggobj.removeEventListener('tap',go2ggFn,false);
				ggobj.addEventListener('tap',go2ggFn,false);
			}
			var xqobj = document.getElementById("xqbutId");
			if(xqobj && xqobj != "undefined"){
				xqobj.removeEventListener('tap',go2xqFn,false);
				xqobj.addEventListener('tap',go2xqFn,false);
			}
//			mui("#anNodeInfoDivId").off('tap');
//			//绑定button onclick事件
//			mui("#anNodeInfoDivId").on('tap','#go2Detail',function(){
//				data_.CUST_ID = "" + data[0].CUST_ID;
//				data_.CUST_NAME = data[0].CUST_NAME;
//				go2sceneOneDetail(data_);
//			});
//			mui("#anNodeInfoDivId").on('tap','button',function(){
//				data_.CUST_ID = "" + data[0].CUST_ID;
//				data_.CUST_NAME = data[0].CUST_NAME;
//				go2sceneOneDetail(data_);
//			});
		},
		error:function(){
			ws.close();
			mui.alert('加载失败！');
		}
	});
}


var mkModeArr = ['','市场开拓计划','市场、产品推介活动','客户联谊活动'];//营销方式
function getSceneOneStepMes(data_){
//	console.log("data_>>>>"+JSON.stringify(data_));
	var condition={id:data_.ACTIVITY_ID};
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'marketActivityAction.json?conditions=' + JSON.stringify(condition),
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var bstr = "";
			var statestr = "";
			if(1*data_.FINISH_FLAG == 0){
				bstr = '<div id="go2Detail"><img src="tg.png" class="tgPng"></img></div>';//"过关";
				statestr = "正在进行";
			}else if(1*data_.FINISH_FLAG == 1){ 
				bstr = '<button id="xqbutId">详情</button>';
				statestr = "已完成";
			}else{
				bstr = '<button id="xqbutId">详情</button>';
				statestr = "未开始";
			}
			var html = '<h1><b>第1关：活动查看</b><i>'+statestr+'</i></h1>';
			html += '<div><p>'+data[0].MKT_ACTI_NAME+'</p>';
			html += '<p>费用预算：'+data[0].MKT_ACTI_COST+'(元)</p>';
			html += '<p>营销方式：'+mkModeArr[data[0].MKT_ACTI_MODE]+'</p>';
			html += '</div>'+bstr;
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			var go2ggFn = function(){
				data_.CUST_ID = "" + data[0].MKT_ACTI_TEAM;
				go2sceneOneDetail(data_);
			};
			var go2xqFn = function(){
				data_.CUST_ID = "" + data[0].MKT_ACTI_TEAM;
				data_.CUST_NAME = data[0].CUST_NAME;
				go2sceneOneDetail(data_);
			};
			var ggobj = document.getElementById("go2Detail");
			if(ggobj && ggobj != "undefined"){
				ggobj.removeEventListener('tap',go2ggFn,false);
				ggobj.addEventListener('tap',go2ggFn,false);
			}
			var xqobj = document.getElementById("xqbutId");
			if(xqobj && xqobj != "undefined"){
				xqobj.removeEventListener('tap',go2xqFn,false);
				xqobj.addEventListener('tap',go2xqFn,false);
			}
			
//			mui("#anNodeInfoDivId").off('tap');
//			//绑定button onclick事件
//			mui("#anNodeInfoDivId").on('tap','#go2Detail',function(){
//				data_.CUST_ID = "" + data[0].MKT_ACTI_TEAM;
//				go2sceneOneDetail(data_);
//			});
//			mui("#anNodeInfoDivId").on('tap','button',function(){
//				data_.CUST_ID = "" + data[0].MKT_ACTI_TEAM;
//				data_.CUST_NAME = data[0].CUST_NAME;
//				go2sceneOneDetail(data_);
//			});
		},
		error:function(){
			ws.close();
			mui.alert('加载失败！');
		}
	});
}


function go2sceneOneDetail(data){
	var custName = "";
	if(data.CUST_NAME && data.CUST_NAME != "undefined")
		custName = encodeURIComponent(data.CUST_NAME);
	var name__ = encodeURIComponent(data.NAME);
	var url = "passSceneOneDetail.html?recordId="+data.RECORD_ID+"&flowFinishFlag="+data.PS_FINISH_FLAG+"&step="+data.STEP+"&activityId="+data.ACTIVITY_ID+"&passId="+passId+"&custId="+data.CUST_ID+"&cwebviewId="+cwebviewId+"&custName="+custName+"&finishFlag="+data.FINISH_FLAG+"&activityRefId="+data.ACTIVITY_REF_IDS+"&name="+name__;
	_App.util.goPage(url,{
		pageId:"passSceneOneDetail_id",
		refresh:true
	});
}
//绑定返回刷新事件
window.addEventListener("finishTheNodeEvent__", function(event) {
	getSceneFlowMes();
});

function doShare() {
	//需要截屏
	_App.share.init(plus.webview.currentWebview(), function(path) {
		if(path){
			plus.storage.removeItem("_shareImgPath_");
			plus.storage.setItem("_shareImgPath_",path);
		}
		//跳转到分享界面
		var url = "../../finding/share/share.html?cwebviewObjId="+cwebviewId+"&bizType=SCENE&passId="+passId+"&recordId="+recordId+"&bizId="+recordId;
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
	},function(){
		
	});
	
//	_App.share.init(plus.webview.currentWebview(), function() {//成功回调
//		var myParams = {};
//		myParams.passId = passId;
//		myParams.recordId = recordId;
//		myParams.shareTitle = "";
//		myParams.bizType="SCENE";
//		myParams.authorityType="1";//需要根据分享界面获取
//		_App.share.doUploadPic(plus.webview.currentWebview(), myParams, function() {//成功回调
//		},function(){//失败回调
//		});
//	},function(){//失败回调
//	});
}

var go2back = mui.back;
mui.back = function(){
	mui.fire(backPage,'refreshHPEvent__',{
	});
	plus.webview.currentWebview().close();
};