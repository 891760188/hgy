var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");
var cwebviewId; //当前界面ID
var judgePass; //检验是否已经通关（用于分支流程）
var judgeContent = "0";
var judgeA = 0;
var judge2A = 0; //判断2A步骤是否已完成
var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {},
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
function getSceneFlowMes() {
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!queryThePassAllStepMes.json',
		data: {
			passId: passId,
			recordId: recordId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			showSceneFlowMes(data);
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}
var cmap; //当前关流程信息
var ps_finish_flag = "N";

function showSceneFlowMes(data) {
	for(var j = 0; j < data.length; j++) {
		if(data[j].STEP == 2 && data[j].PS_FINISH_FLAG == 'Y' && data[j].FINISH_FLAG == '1') {
			judgeA = 1; //2B走完
		}
		if(data[j].STEP == 2 && data[j].PS_FINISH_FLAG != 'Y' && data[j].FINISH_FLAG == '1') { //2A走完
			judgeA = 2;//2A走完
		}
	}
	for(var i = 0; i < data.length; i++) {
		var d = data[i];
		var step = "" + d.STEP;
		var psFinishFlag = "" + d.PS_FINISH_FLAG; //ps_finish_flag == Y -- 通关 
		var finishFlag = "" + d.FINISH_FLAG;

		if(psFinishFlag == "Y" && 1 * finishFlag == 1) {
			ps_finish_flag = "Y";
			cmap = "";
		}
		if((ps_finish_flag == "Y" && step == "2") || (ps_finish_flag == "Y" && step == "4")) {
			judgePass = "1"; //当流程已经完结时
		}
		var status_css = "";
		if(finishFlag) { //已完成finishFlag为1，正在进行finishFlag为0，没有进行到finishFlag为空
			if(1 == 1 * finishFlag)
				status_css = "ed";
			else if(0 == 1 * finishFlag) {
				status_css = "ing";
				//需要加载当前关的信息
				cmap = d;
			} else
				status_css = "";
		}
		var _obj_ = document.getElementById("anBoxDivId");
		var div_str = document.createElement("div");
		if(1 * step == 1) { //第一关
			div_str.className = 'an-node ' + status_css + '';
			div_str.setAttribute("style", "left: 18%;top: 73%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "1<span>" + d.NAME + "<i></i></span>";
		} else if(1 * step == 2) { //第二关
			if(d.PS_FINISH_FLAG == "Y") {
				div_str.id = "first";
				if(judgeA == 2) {
					div_str.className = 'an-node ';
				} else {
					div_str.className = 'an-node ' + status_css + '';
				}
				div_str.setAttribute("style", "left: 55%;top: 57%;");
				div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + '');
				div_str.innerHTML = "2B<span>" + d.NAME + "<i></i></span>";
			} else {
				div_str.id = "second";
				if(finishFlag == "1") {
					judge2A = "1";
				}
				if(judgeA == 1) {
					div_str.className = 'an-node ';
				} else {
					div_str.className = 'an-node ' + status_css + '';
				}

				div_str.setAttribute("style", "left: 40%;top: 62%;");
				div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + '');
				div_str.innerHTML = "2A<span>" + d.NAME + "<i></i></span>";
			}
		} else if(1 * step == 3) {
			div_str.id = "third"; //第三关
			if(judgeA == 1) {
				div_str.className = 'an-node ';
			} else {
				div_str.className = 'an-node ' + status_css + '';
			}
			div_str.setAttribute("style", "left: 5%;top: 60%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "3A<span>" + d.NAME + "<i></i></span>";
		} else if(1 * step == 4) { //第四关
			div_str.id = "forth";
			if(judgeA == 1) {
				div_str.className = 'an-node ';
			} else {
				div_str.className = 'an-node ' + status_css + '';
			}
			div_str.setAttribute("style", "left: 25%;top: 42%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "4A<span>" + d.NAME + "<i></i></span>";
		}
		_obj_.appendChild(div_str);
	}

	var obj_ = document.getElementById("anStateDivId");
	obj_.style.display = "";
	if(ps_finish_flag == "Y") {
		obj_.classList.add("finished");
		obj_.innerHTML = "已通关";
	} else {
		obj_.classList.remove("finished");
		obj_.innerHTML = "进行中";
	}

	var _h = document.getElementById('anBg').clientHeight - document.getElementsByClassName('an-wrapper')[0].clientHeight;
	mui('.mui-scroll-wrapper').scroll({
		startY: -(_h - 50)
	}); //

	//绑定节点onclick事件
	mui("#anBoxDivId").on('tap', '.an-node', function() {
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
		if(m.FINISH_FLAG == "0" || m.FINISH_FLAG == "1") {
			loadCurrentSceneData(m);
		} else {
			mui.toast("未进行到此步骤！");
		}

	});
	//	console.log("cmap>>>"+JSON.stringify(cmap));
	loadCurrentSceneData(cmap); //加载当前正在进行的流程
}

function loadCurrentSceneData(data) { //加载当前正在进行的流程
	if(ps_finish_flag == "Y" && !data) {
		//说明已经通过
		var html = '<h1><b>已通关</b><i>已通关</i></h1>';
		html += '<div style="color: #ff713c;text-align: center;line-height: 90px;margin-right:0px;font-size:18px">恭喜你，通关了！</div>';
		document.getElementById("anNodeInfoDivId").innerHTML = html;
		return;
	}
	if(data.STEP == "2"&&judgeA=="1"&&data.PS_FINISH_FLAG!="Y"){//2B走完
		var html = '<h1><b>已通关</b><i>已通关</i></h1>';
		html += '<div style="color: #ff713c;text-align: center;line-height: 90px;margin-right:0px;font-size:18px">恭喜你，通关了！</div>';
		document.getElementById("anNodeInfoDivId").innerHTML = html;
		return;
	}
	if(data.STEP == "2"&&judgeA=="2"&&data.PS_FINISH_FLAG=="Y"){
		return;
	}
	var step = "" + data.STEP; //获取正在进行的流程步数
	var judge = data.FINISH_FLAG;
	if(1 * step == 1) { //第一关
		getSceneOneStepMes(data, judge);
	} else if(1 * step == 2) {
		if(data.PS_FINISH_FLAG == "Y") {
			getSecondContentB(data, judge); //第二关的流程2B
		} else {
			getContentA(data, judge); //第二关的流程2A
		}
	} else if(1 * step == 3) {
		getContentA(data, judge); //第三关流程
	} else if(1 * step == 4) {
		getContentA(data, judge); //第四关流程
	}
}

function getSceneOneStepMes(data_, judge) { //第一关（查看）
	//	console.log("data_>>>>"+JSON.stringify(data_));
	var bstr = "";
	if(judge == "1") {
		var judgeContent1 = "已完成";
//		var content = "详情";
        bstr = '<button id="go2Detail">详情</button>';//"详情";
		judgeContent = "0";
	} else {
		var judgeContent1 = "正在进行";
//		var content = "过关";
        bstr = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';//"过关";
		judgeContent = "1";
	}
	var condition = {
		id: data_.ACTIVITY_ID
	};
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'sceneThreeAction.json?conditions=' + JSON.stringify(condition),
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var html = '<h1><b>第1关：客户持有产品查看</b><i>' + judgeContent1 + '</i></h1>';
			html += '<div><p>' + data[0].DP_NAME + '</p>';
			html += '<p>收益率：' + data[0].DP_SYL + '(元)</p>';
			html += '<p>到期日期：' + data[0].DP_DQRQ + '</p>';
			html += '</div>'+bstr; //onclick="go2sceneOneDetail(\''+data[0].MKT_ACTI_TEAM+'\');"
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			
			var test = function(){
				data_.CUST_ID = "" + data[0].CUST_ID;
				go2sceneOneDetail(data_);
			}
			document.getElementById('go2Detail').removeEventListener('tap',test);
			document.getElementById('go2Detail').addEventListener('tap',test);
//			mui("#anNodeInfoDivId").off('tap');
//			//绑定button onclick事件
//			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
//				data_.CUST_ID = "" + data[0].CUST_ID;
//				go2sceneOneDetail(data_);
//			});
		},
		error: function() {
			ws.close();
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});
}

//2B
function getSecondContentB(data_, judge) {
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
		data: {
			activeId: data_.ACTIVITY_ID
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var name_ = "";

			var bstr = "";
			var statestr = "";
			if(1 * judge == 0) {
//				bstr = "过关";
				bstr = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';//"过关";
				statestr = "正在进行";
				judgeContent = "1";
			} else if(1 * judge == 1) {
//				bstr = "详情";
				bstr = '<button id="go2Detail">详情</button>';//"详情";
				statestr = "已完成";
				judgeContent = "0";
			} else {
//				bstr = "详情";
				bstr = '<button id="go2Detail">详情</button>';//"详情";
				statestr = "未开始";
				judgeContent = "0";
			}
			var html = '<h1><b>第2B关：日常关怀</b><i>' + statestr + '</i></h1>';
			html += '<div><p>无其他账户大额交易，只是客户临时需求，无流失风险</p>';
			html += '</div>'+bstr;
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			function test(){
				data_.CUST_ID = "" + data[0].CUST_ID;
				data_.CUST_NAME = data[0].CUST_NAME;
				go2sceneOneDetail(data_);
			}
			document.getElementById('go2Detail').removeEventListener('tap',test);
			document.getElementById('go2Detail').addEventListener('tap',test);
			
			
//			mui("#anNodeInfoDivId").off('tap');
//			//绑定button onclick事件
//			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
//				data_.CUST_ID = "" + data[0].CUST_ID;
//				data_.CUST_NAME = data[0].CUST_NAME;
//				go2sceneOneDetail(data_);
//			});
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

//2A
function getContentA(data_, judge) {
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
		data: {
			activeId: data_.ACTIVITY_ID
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var name_ = "";

			var bstr = "";
			var statestr = "";
			if(1 * judge == 0) {
//				bstr = "过关";
                bstr = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';//"过关";
				statestr = "正在进行";
				judgeContent = "1";
			} else if(1 * judge == 1) {
//				bstr = "详情";
                bstr = '<button id="go2Detail">详情</button>';//"详情";
				statestr = "已完成";
				judgeContent = "0";
			} else {
//				bstr = "详情";
                bstr = '<button id="go2Detail">详情</button>';//"详情";
				statestr = "未开始";
				judgeContent = "0";
			}
			if(data_.STEP == "2") {
				var html = '<h1><b>第2A关：客户拜访</b><i>' + statestr + '</i></h1>';
				html += '<div><p>近期频繁大额交易，有流失风险</p>';
				html += '</div>'+bstr;
				document.getElementById("anNodeInfoDivId").innerHTML = html;
			} else if(data_.STEP == "3") {
				var html = '<h1><b>第3关：商机创建</b><i>' + statestr + '</i></h1>';
				html += '<div><p>' + data[0].CUST_NAME + '</p>';
				html += '<p>电话：' + data[0].MOBILE + '</p>';
				html += '<p>地址：' + data[0].LOCATION + '</p>';
				html += '</div>'+bstr;
				document.getElementById("anNodeInfoDivId").innerHTML = html;
			} else if(data_.STEP == "4") {
				var html = '<h1><b>第4关：商机达成</b><i>' + statestr + '</i></h1>';
				html += '<div><p>' + data[0].CUST_NAME + '</p>';
				html += '<p>电话：' + data[0].MOBILE + '</p>';
				html += '<p>地址：' + data[0].LOCATION + '</p>';
				html += '</div>'+bstr;
				document.getElementById("anNodeInfoDivId").innerHTML = html;
			}

            var test = function(){
            	data_.CUST_ID = "" + data[0].CUST_ID;
				data_.CUST_NAME = data[0].CUST_NAME;
				go2sceneOneDetail(data_);
            }
            document.getElementById('go2Detail').removeEventListener('tap',test);
            document.getElementById('go2Detail').addEventListener('tap',test);
//			mui("#anNodeInfoDivId").off('tap');
//			//绑定button onclick事件
//			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
//				data_.CUST_ID = "" + data[0].CUST_ID;
//				data_.CUST_NAME = data[0].CUST_NAME;
//				go2sceneOneDetail(data_);
//			});
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});

}

function go2sceneOneDetail(data) {
	var custName = encodeURIComponent(data.CUST_NAME);
	var url = "passScene3_1_detail.html?recordId=" + data.RECORD_ID + "&flowFinishFlag=" + data.PS_FINISH_FLAG + "&step=" + data.STEP + "&activityId=" + data.ACTIVITY_ID + "&passId=" + passId + "&custId=" + data.CUST_ID + "&cwebviewId=" + cwebviewId + "&custName=" + custName + "&activityRefId=" + data.ACTIVITY_REF_IDS + "&finishFlag=" + data.FINISH_FLAG + "&judgePass=" + judgePass + "&judgeContent=" + judgeContent + "&judge2A=" + judge2A+"&recordIdNoChange="+recordId;
	//	console.log("url>>>"+url);
	_App.util.goPage(url, {
		pageId: "passSceneOneDetail_id",
		refresh: true
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
		var url = "../../../finding/share/share.html?cwebviewObjId="+cwebviewId+"&bizType=SCENE&passId="+passId+"&recordId="+recordId+"&bizId="+recordId;
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