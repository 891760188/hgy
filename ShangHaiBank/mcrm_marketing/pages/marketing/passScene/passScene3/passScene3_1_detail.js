var flowFinishFlag = _App.util.getUrlParamByName("flowFinishFlag"); //场景完成标识
var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");
var recordIdNoChange = _App.util.getUrlParamByName("recordIdNoChange");
var _step = _App.util.getUrlParamByName("step");
var activityId = _App.util.getUrlParamByName("activityId");
var custId = _App.util.getUrlParamByName("custId"); //客户ID是下一步的activityId
var pwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
var activityRefId = _App.util.getUrlParamByName("activityRefId");
var finishCurrentStep = _App.util.getUrlParamByName("finishFlag"); //当前节点是否完成，完成为1，未完成为0
var backPage; //返回界面对象
var custName = decodeURIComponent(_App.util.getUrlParamByName("custName")); //客户名称在某些步骤中用到
var judgePass = _App.util.getUrlParamByName("judgePass"); //判断当前流程是否完成，如果完成则为1
var judgeContent = _App.util.getUrlParamByName("judgeContent");
var judge2A = _App.util.getUrlParamByName("judge2A"); //判断2A步骤是否已经完成
var judgeAB;
var judgeA = 0; //判断2A和2B流程是否走完，judgeA=1则2B走完，judgeA=2则2A走完
var a = "0"; //判断2A节点是否完成
var colorJudge = 0; //判断详情中正在执行的分支节点是2A还是2B，2A则为1，2B则为2
var judgeBA = 0; //在非详情界面点击第一关进入详情界面，点击继续通关，如果正在通关为第二关，则judgeBA = 1，否则judgeBA = 0；
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		backPage = plus.webview.getWebviewById(pwebviewId);
		if(finishCurrentStep == "1" && judgePass != "1") {
			document.getElementById("senLogId").setAttribute("data-info", '继续闯关');
		} else if(finishCurrentStep == "0" && judgePass != "1") {
			document.getElementById("senLogId").setAttribute("data-info", '过关');
		}
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
			recordId: recordIdNoChange
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
			judgeA = 2; //2A走完
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
			document.getElementById("senLogId").style.display = "none";
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
			if(d.PS_FINISH_FLAG == "Y") { //2B关卡
				div_str.id = "first";
				//				var colorJudge = 0;//判断详情中正在执行的分支节点是2A还是2B，2A则为1，2B则为2
				if(colorJudge == "1") { //若正在执行2A
					div_str.className = 'an-node ';
				} else if(judgeA == 2) {
					div_str.className = 'an-node ';
				} else {
					div_str.className = 'an-node ' + status_css + '';
				}
				div_str.setAttribute("style", "left: 55%;top: 57%;");
				div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + ',' + colorJudge);
				div_str.innerHTML = "2B<span>" + d.NAME + "<i></i></span>";
			} else {
				div_str.id = "second";
				if(finishFlag == "1") {
					judge2A = "1";
				}
				if(colorJudge == "2") { //若正在执行2B
					div_str.className = 'an-node ';
				} else if(judgeA == 1) { //2B走完
					div_str.className = 'an-node ';
				} else {
					div_str.className = 'an-node ' + status_css + '';
				}

				div_str.setAttribute("style", "left: 40%;top: 62%;");
				div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + d.FINISH_FLAG + ',' + d.ACTIVITY_REF_IDS + ',' + colorJudge);
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

	var _h = document.getElementById('anBg').clientHeight - document.getElementsByClassName('an-min-wrapper')[0].clientHeight;
	mui('.mui-scroll-wrapper').scroll({
		startY: -(_h - 50)
	}); //

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
		var judgeColor = di[8];
		if(m.PS_FINISH_FLAG == "Y" && judgeColor == "1") { //正在执行2A
			mui.toast("无法操作，正在执行另一分支！");
		} else if(m.PS_FINISH_FLAG != "Y" && judgeColor == "2") { //正在执行2B
			mui.toast("无法操作，正在执行另一分支！");
		} else if(m.FINISH_FLAG == "0" || m.FINISH_FLAG == "1") {
			loadCurrentSceneData(m);
		} else {
			mui.toast("未进行到此步骤！");
		}

	});

	//展示详情
	if(1 * _step == 1) {
		getActivityDetail();
	} else if(1 * _step == 2) { //客户拜访
		if(flowFinishFlag == "Y") {
			document.getElementById("titileId").innerHTML = "2B日常关怀";
		} else {
			document.getElementById("titileId").innerHTML = "2A客户拜访";
		}
		getActivityDetail2();
	} else if(1 * _step == 3) {
		document.getElementById("titileId").innerHTML = "3A创建商机";
		getActivityDetail3(); //商机录入
	} else if(1 * _step == 4) {
		document.getElementById("titileId").innerHTML = "4A商机达成";
		getActivityDetail4(); //商机达成
	}
}
//商机达成
function getActivityDetail4() {
	if(1 * finishCurrentStep == 0) {
		exeActivityDetail4();
	} else {
		queryActivityDetail4();
	}
}
//商机录入
function getActivityDetail3() {
	if(1 * finishCurrentStep == 0) {
		exeActivityDetail3();
	} else {
		queryActivityDetail3();
	}
}
//客户拜访
function getActivityDetail2() {
	if(1 * finishCurrentStep == 0) {
		exeActivityDetail2();
	} else {
		queryActivityDetail2();
	}
}
//客户拜访（完成）
function queryActivityDetail2() {
	finishCurrentStep = "1";
	var ws = plus.nativeUI.showWaiting();
	var data_ = {};
	data_.signId = "" + activityRefId;
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneThreeManageAction!getSignMes.json',
		data: data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			showActivityMes(data);
		},
		error: function(a, b, c) {
			mui.alert("获取信息失败");
			ws.close();
		}
	});
}
//客户拜访(未完成)
function exeActivityDetail2() {
	finishCurrentStep = "0";
	if(judge2A == "1") {
		mui.toast("已发起另一分支流程，无法操作！");
		a = "1";
		mui.back();
	} else {
		var buttonContent = document.getElementById("senLogId");
		document.getElementById("senLogId").setAttribute("data-info", '过关');
		removeListener();

		//时间
		var nowDate = new Date();
		var ndate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes();
		var html = '<ul class="mui-table-view mui-table-view-group">';
		html += '<li class="mui-table-view-cell">';
		html += '<a><span class="mui-icon mui-icon-minus"></span>';
		html += '<b>时间:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div1">' + ndate + '</span>';
		html += '</a></li>';
		html += '<li class="mui-table-view-cell">';
		html += '<a class="mui-navigate-right">';
		html += '<span class="mui-icon mui-icon-location"></span>';
		html += '<b>地址:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div2"></span>';
		html += '</a></li></ul>';
		html += '<ul class="mui-table-view mui-table-view-group">';
		html += '<li class="mui-table-view-cell">';
		html += '<a class="mui-navigate-right">';
		html += '<span class="mui-icon mui-icon-star"></span>';
		html += '<b>拜访客户:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custName">' + custName + '</span>';
		html += '</a></li>';
		html += '<li class="mui-table-view-cell">';
		html += '<a class="mui-navigate-right">';
		html += '<span class="mui-icon mui-icon-personadd"></span>';
		html += '<b>联系电话:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custNames">13880218113</span>';
		html += '</a></li>';
		html += '<li class="mui-table-view-cell">';
		html += '<a><span class="mui-icon mui-icon-compose"></span>';
		html += '<b>拜访详情:</b><br /><br />';
		html += '<span>';
		html += '<textarea type="text"  id="ts" class="mui-input-clear" style="height:6em;" placeholder="详情"></textarea>';
		html += '</span>';
		html += '</a></li>';
		html += '</ul>';
		html += '<div class="mui-button-row">';
		html += '</div>';
		document.getElementById("des").innerHTML = html;

		buttonContent.addEventListener('tap', saveSignData, false); //继续闯关
		getLocation();
	}

}

//新增商机
function exeActivityDetail3() {
	finishCurrentStep = "0";
	var buttonContent = document.getElementById("senLogId");
	//	buttonContent.innerHTML = '<button type="button2" class="mui-btn mui-pull-right" id="button2">过关</button>';
	document.getElementById("senLogId").setAttribute("data-info", '过关');
	removeListener();
	var html = '<form class="mui-input-group">';
	html += '<div class="mui-input-row">';
	html += '<label>客户名称：</label>';
	html += '<input id="custName" type="text" placeholder="客户名称">';
	html += '<span class="mui-icon mui-ipt-ico"></span>';
	html += '</div><div class="mui-input-row">';
	html += '<label>机构代码：</label>';
	html += '<input id="bodyCodeId" type="text" class="mui-input-clear" placeholder="机构代码"></div>';
	html += '<div class="mui-input-row"><label>资产规模：</label></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>存款</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>贷款</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>结算</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>	';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>贴现</label><input name="checkbox1" value="1" type="checkbox">';
	html += '</div><div class="mui-input-row mui-input-row-right">';
	html += '<label>规模：</label><input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>其他</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>';
	html += '<div class="mui-input-row"><label>商机描述：</label></div>';
	html += '<div class="mui-input-row" style="height:5em;"><textarea id="t2" type="text" class="mui-input-clear" placeholder="商机描述"></textarea>';
	html += '</div>';
	html += '</form>';
	document.getElementById("des").innerHTML = html;
	document.getElementById("custName").value = custName;
	document.getElementById("bodyCodeId").value = custId;
	buttonContent.addEventListener('tap', saveBusiData, false); //继续闯关
}
//商机详情查看
function queryActivityDetail3() {
	finishCurrentStep = "1";
	var html = '<div id="mcc-custView" class="mui-control-content mui-active">';
	html += '<div class="ys-custTitle">商机基本信息';
	html += '</div><div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>北京进出口有限公司</span></p>';
	html += '<p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>规模：</b><span>1200万</span></p>';
	html += '<p><b>状态：</b><span>已落地</span></p>';
	html += '<p><b>产品名称：</b><span>流动资金贷款</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>产品经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p>';
	html += '</div>';
	html += '<div class="ys-custTitle" id="salePlanTitle">营销方案信息</div>';
	html += '<div class="ys-custInfo ys-bothNeat" id="salePlanCon">';
	html += '<h5 class="mui-content-padded">基本信息</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>方案名称：</b><span>出口企业融资营销方案</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销流程</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<span class="ys-step-node">锁定客户</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">接触推销</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">反馈</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">铺垫下次营销</span>';
	html += '</div><h5 class="mui-content-padded">产品定价描述</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1基准利率：</b><span>10%</span></p>';
	html += '<p><b>2上下浮动：</b><span>1%</span></p>';
	html += '<p><b>3手续费率：</b><span>0.5%</span></p>';
	html += '<p><b>4其他：</b><span>1000万以上手续费可减免</span></p>';
	html += '</div><h5 class="mui-content-padded">产品营销注意事项</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>点击某条商机可以看到客户具体信息</span></p>';
	html += '<p><b>2：</b><span>产品定价准确性</span></p></div>';
	html += '<h5 class="mui-content-padded">营销话术</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>融资需求必须使用某产品</span></p>';
	html += '<p><b>2：</b><span>产品定价准确性</span></p>';
	html += '</div></div></div>';
	document.getElementById("des").innerHTML = html;
	var buttonContent = document.getElementById("senLogId");
	removeListener();
	if(document.getElementById("senLogId").getAttribute("data-info") == "过关") {
		buttonContent.addEventListener('tap', backSaveFlowMes, false); //继续闯关
	} else {
		buttonContent.addEventListener('tap', refreshContent, false); //继续闯关
	}
}

//商机达成（过关）
function exeActivityDetail4() {
	finishCurrentStep = "0";
	var buttonContent = document.getElementById("senLogId");
	//	buttonContent.innerHTML = '<button type="button2" class="mui-btn mui-pull-right" id="button2">过关</button>';
	document.getElementById("senLogId").setAttribute("data-info", '过关');
	removeListener();
	var html = '<div id="mcc-custView" class="mui-control-content mui-active">';
	html += '<div class="ys-custTitle">商机基本信息';
	html += '</div><div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>北京进出口有限公司</span></p>';
	html += '<p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>规模：</b><span>1200万</span></p>';
	html += '<p><b>状态：</b><span>已落地</span></p>';
	html += '<p><b>产品名称：</b><span>流动资金贷款</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>产品经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p>';
	html += '</div></div>';

	html += '<form class="mui-input-group">';
	html += '<div class="mui-input-row mui-select ">';
	html += '<label>营销产品：</label>';
	html += '<input id="productName" type="text" class="mui-input-clear" placeholder="填写营销产品">';
	html += '</div>';
	html += '<div class="mui-input-row">';
	html += '<label style="width: 45%;">产品经理介入：</label>';
	html += '<div class="mui-switch mui-switch-blue mui-active" style="float: left;" id="switchBtnId">';
	html += '<div class="mui-switch-handle"></div>';
	html += '</div>';
	html += '</div><div id="contentDivId" class="ys-minView">请选择数据！</div>';
	html += '<div class="mui-button-row"><button type="button" class="mui-btn mui-btn-danger">完    成</button></div>';
	html += '</form>';
	document.getElementById("des").innerHTML = html;

	buttonContent.addEventListener('tap', saveBusiCompleteData, false); //继续闯关

}
//商机达成过关
function queryActivityDetail4() {
	finishCurrentStep = "1";
	var html = '<div id="mcc-custView" class="mui-control-content mui-active">';
	html += '<div class="ys-custTitle">商机基本信息';
	html += '</div><div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>北京进出口有限公司</span></p>';
	html += '<p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>规模：</b><span>1200万</span></p>';
	html += '<p><b>状态：</b><span>已落地</span></p>';
	html += '<p><b>产品名称：</b><span>流动资金贷款</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>产品经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p>';
	html += '</div>';
	html += '<div class="ys-custTitle" id="salePlanTitle">营销方案信息</div>';
	html += '<div class="ys-custInfo ys-bothNeat" id="salePlanCon">';
	html += '<h5 class="mui-content-padded">基本信息</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>方案名称：</b><span>出口企业融资营销方案</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销流程</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<span class="ys-step-node">锁定客户</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">接触推销</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">反馈</span>';
	html += '<i class="icon-arrow-right2"></i>';
	html += '<span class="ys-step-node">铺垫下次营销</span>';
	html += '</div><h5 class="mui-content-padded">产品定价描述</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1基准利率：</b><span>10%</span></p>';
	html += '<p><b>2上下浮动：</b><span>1%</span></p>';
	html += '<p><b>3手续费率：</b><span>0.5%</span></p>';
	html += '<p><b>4其他：</b><span>1000万以上手续费可减免</span></p>';
	html += '</div><h5 class="mui-content-padded">产品营销注意事项</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>点击某条商机可以看到客户具体信息</span></p>';
	html += '<p><b>2：</b><span>产品定价准确性</span></p></div>';
	html += '<h5 class="mui-content-padded">营销话术</h5>';
	html += '<div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>融资需求必须使用某产品</span></p>';
	html += '<p><b>2：</b><span>产品定价准确性</span></p>';
	html += '</div></div>';
	html += '<div class="ys-custTitle" id="doPlanTitle">营销落地信息</div>';
	html += '<div class="ys-custInfo" id="doPlanCon"">';
	html += '<p><b>确认落地：</b><span>已落地</span></p>';
	html += '<p><b>落地规模：</b><span>3000万</span></p>';
	html += '<p><b>落地产品：</b><span>基础授信，基础结算及中间业务</span></p>';
	html += '<p><b>落地描述：</b><span>根据与客户的沟通，商机已落地</span></p>';
	html += '</div></div>';
	document.getElementById("des").innerHTML = html;
	var buttonContent = document.getElementById("senLogId");
	removeListener();
	if(document.getElementById("senLogId").getAttribute("data-info") == "过关") {
		buttonContent.addEventListener('tap', backSaveFlowMes, false); //继续闯关
	} else {
		buttonContent.addEventListener('tap', refreshContent, false); //继续闯关
	}
}
//签到（已完成）展示详情
function showActivityMes(data) {
	var buttonContent = document.getElementById("senLogId");
	removeListener();

	var html = '<ul class="mui-table-view mui-table-view-group">';
	html += '<li class="mui-table-view-cell">';
	html += '<a><span class="mui-icon mui-icon-minus"></span>';
	html += '<b>时间:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div1">' + data[0].signAddress + '</span>';
	html += '</a></li>';
	html += '<li class="mui-table-view-cell">';
	html += '<a class="mui-navigate-right">';
	html += '<span class="mui-icon mui-icon-location"></span>';
	var time = data[0].createDate + " " + data[0].signTime;
	html += '<b>地址:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div2">' + time + '</span>';
	html += '</a></li></ul>';
	html += '<ul class="mui-table-view mui-table-view-group">';
	html += '<li class="mui-table-view-cell">';
	html += '<a class="mui-navigate-right">';
	html += '<span class="mui-icon mui-icon-star"></span>';
	html += '<b>拜访客户:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custName">' + data[0].custNames + '</span>';
	html += '</a></li>';
	html += '<li class="mui-table-view-cell">';
	html += '<a class="mui-navigate-right">';
	html += '<span class="mui-icon mui-icon-personadd"></span>';
	html += '<b>联系电话:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custNames">13880218113</span>';
	html += '</a></li>';
	html += '<li class="mui-table-view-cell">';
	html += '<a><span class="mui-icon mui-icon-compose"></span>';
	html += '<b>拜访详情:</b><br /><br />';
	html += '<span>';
	html += '<textarea type="text"  id="ts" class="mui-input-clear" style="height:6em;" readonly="readonly">' + data[0].signMemo + '</textarea>';
	html += '</span>';
	html += '</a></li>';
	html += '</ul>';
	document.getElementById("des").innerHTML = html;
	if(document.getElementById("senLogId").getAttribute("data-info") == "过关") {
		buttonContent.addEventListener('tap', backSaveFlowMes, false); //继续闯关
	} else {
		buttonContent.addEventListener('tap', refreshContent, false); //继续闯关
	}
}
var is3save = false;

function saveSignData() {
	if(judgeContent == "1" && judgePass == "1") {
		mui.toast("流程已结束，无法操作！");
		mui.back();
	} else {
		if(!longitude || longitude == "undefined") {
			mui.alert("获取地址信息出错，不能保存！");
			return false;
		}
		var ws = plus.nativeUI.showWaiting();
		var data_ = {};
		data_.dataAddress = document.getElementById("div2").innerHTML;
		data_.dataCustName = custName;
		data_.dataCustNames = document.getElementById("custNames").innerHTML;
		data_.dataMemo = document.getElementById("ts").value;
		data_.longitude = longitude;
		data_.latitude = latitude;
		data_.custId = activityId;
		_App.ajax({
			type: "get",
			url: basePath + 'signCountAction!addSignCount.json',
			data: data_,
			cache: false,
			dataType: "json",
			success: function(response) {
				ws.close();
				var da = response.json;
				activityRefId = da.signId;
				is3save = true;
				//				if(judgeAB == "1") {
				//					plus.webview.currentWebview().close();
				//				}
				mui.back("1");
			},
			error: function(a, b, c) {
				mui.alert("签到失败");
				ws.close();
			}
		});
	}
}

function getLocation() {
	var div2 = document.getElementById("div2");
	//获取当前地址
	//	var ws = plus.nativeUI.showWaiting();
	plus.geolocation.getCurrentPosition(function(p) {
		//		ws.close();
		if(!p.addresses) {
			mui.alert('定位失败，请检查相关设备!', '提示', function() {
				plus.webview.currentWebview().close();
			});
		} else {
			div2.innerHTML = p.address.province + p.address.district + p.address.street;
			longitude = p.coords.longitude;
			latitude = p.coords.latitude;
		}

	}, function(e) {
		//		ws.close();
		plus.webview.currentWebview().close();
	});
}

function getActivityDetail(judge) {
	document.getElementById("titileId").innerHTML = "1理财产品查看";

	var buttonContent = document.getElementById("senLogId");
	removeListener();

	var ws = plus.nativeUI.showWaiting();
	var condition = {
		id: activityId
	};
	var des = document.getElementById("des");
	_App.ajax({
		type: "get",
		url: basePath + 'sceneThreeAction.json?conditions=' + JSON.stringify(condition),
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			des.innerHTML = '<form class="mui-input-group"><div class="mui-input-row"><label>产品名称:</label><input id="actName" type="text" readonly="readonly" value="' + data[0].DP_NAME + '"></div>' +
				'<div class="mui-input-row"><label>产品收益率:</label><input id="cost" type="text" readonly="readonly" value="' + data[0].DP_SYL + '"></div>' +
				'<div class="mui-input-row"><label>产品到期日期:</label><input type="text" readonly="readonly" value="' + data[0].DP_DQRQ + '"></div>' +
				'<div class="mui-input-row"><label>业务规模:</label><input type="text" readonly="readonly" value="' + data[0].DP_YWGM + '"></div>' +
				'<div class="mui-input-row"><label>购买历史信息:</label><textarea type="text" class="mui-input-clear" readonly="readonly">' + data[0].DP_GMLSXX + '</textarea></div></form>';
			if(document.getElementById("senLogId").getAttribute("data-info") == "过关") {
				buttonContent.addEventListener('tap', backSaveFlowMes, false);
			} else {
				buttonContent.addEventListener('tap', refreshContentBA, false); //继续闯关
			}
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

mui.back = function(dataJudge) {
	if(judgeContent == "1" && judgePass == "1") {
		mui.toast("流程已结束，无法操作");
		plus.webview.currentWebview().close();
	} else if(dataJudge == "1") {
		if(1 * _step == 2) { //第二关，客户拜访（签到）
			if(a == "1") {
				a = "0";
				plus.webview.currentWebview().close();
			} else if(1 * finishCurrentStep == 1) {
				plus.webview.currentWebview().close();
			} else {
				if(!is3save) {
					var btnArray = ['是', '否'];
					mui.confirm('您未保存信息，此关未通过，是否返回？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							plus.webview.currentWebview().close();
						}
					});
				} else {
					backSaveFlowMes();
				}
			}
		} else if(1 * _step == 3) {
			if(1 * finishCurrentStep == 1) {
				plus.webview.currentWebview().close();
			} else {
				if(!is3save) {
					var btnArray = ['是', '否'];
					mui.confirm('您未保存信息，此关未通过，是否返回？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							plus.webview.currentWebview().close();
						}
					});
				} else {
					backSaveFlowMes();
				}
			}
		} else if(1 * _step == 4) {
			if(1 * finishCurrentStep == 1) {
				plus.webview.currentWebview().close();
			} else {
				if(!is3save) {
					var btnArray = ['是', '否'];
					mui.confirm('您未保存信息，此关未通过，是否返回？', '提示', btnArray, function(e) {
						if(e.index == 0) {
							plus.webview.currentWebview().close();
						}
					});
				} else {
					backSaveFlowMes();
				}
			}
		} else if(1 * _step == 1) {
			//			backSaveFlowMes();
			plus.webview.currentWebview().close();
		}
	} else {
		plus.webview.currentWebview().close();
	}
}

function backSaveFlowMes() {
	if(!activityRefId || activityRefId == "undefined") {
		activityRefId = "";
	}
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!exeFlowNode.json',
		data: {
			finishFlag: "1",
			recordId: recordId,
			flowFinishFlag: flowFinishFlag,
			step: _step,
			activityId: custId,
			activityRefId: activityRefId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			if(_step == "4") {
				document.getElementById("ballon").src = "../2.png";
				document.getElementById("nextImgId").src = "../wc.png";
			}
			if(judgeAB == "1" && _step == "2") {
				document.getElementById("ballon").src = "../2.png";
				document.getElementById("nextImgId").src = "../wc.png";
			}

			mui.fire(backPage, 'finishTheNodeEvent__', {});
			document.querySelector('#nextButId').removeEventListener('tap', stepJ);
			document.querySelector('#shareButId').removeEventListener('tap', doShare);
			document.querySelector('#ballon').removeEventListener('tap', doBallon);
			openShade();
			document.querySelector('#nextButId').addEventListener('tap', stepJ);
			document.querySelector('#shareButId').addEventListener('tap', doShare);
			document.querySelector('#ballon').addEventListener('tap', doBallon);
		},
		error: function() {
			ws.close();
			mui.alert('处理失败，请重试！');
		}
	});
}

function saveBusiData() {
	is3save = true;
	mui.back("1");
}

function saveBusiCompleteData() {
	is3save = true;
	mui.back("1");
}

function refreshContent(dataStep, dataInfo) { //dataInfo==2A或者2B,加载正在进行的流程节点
	var ws = plus.nativeUI.showWaiting();
	finishCurrentStep = "0";
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
			for(var k = 0; k < data.length; k++) {
				if(dataStep != "2") {
					if(data[k].FINISH_FLAG == "0") {
						_App.ajax({
							type: "get",
							url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
							data: {
								activeId: data[k].ACTIVITY_ID
							},
							cache: false,
							dataType: "json",
							success: function(response) {
								ws.close();
								custId = response.json.data[0].CUST_ID;
								custName = response.json.data[0].CUST_NAME;
							},
							error: function() {
								ws.close();
								mui.alert('加载失败！');
							}
						});
						recordId = data[k].RECORD_ID;
						flowFinishFlag = data[k].PS_FINISH_FLAG;
						_step = data[k].STEP;
						activityId = custId;
						activityRefId = data[k].ACTIVITY_REF_IDS;
						custName = custName;
					}
				} else {
					if(dataInfo == "2A") {
						judgeAB = "0";
						if(data[k].FINISH_FLAG == "0" && data[k].PS_FINISH_FLAG == "N") {
							_App.ajax({
								type: "get",
								url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
								data: {
									activeId: data[k].ACTIVITY_ID
								},
								cache: false,
								dataType: "json",
								success: function(response) {
									ws.close();
									custId = response.json.data[0].CUST_ID;
									custName = response.json.data[0].CUST_NAME;
								},
								error: function() {
									ws.close();
									mui.alert('加载失败！');
								}
							});
							recordId = data[k].RECORD_ID;
							flowFinishFlag = data[k].PS_FINISH_FLAG;
							_step = data[k].STEP;
							activityId = custId;
							activityRefId = data[k].ACTIVITY_REF_IDS;
							custName = custName;
						}
					} else {
						judgeAB = "1";
						if(data[k].FINISH_FLAG == "0" && data[k].PS_FINISH_FLAG == "Y") {
							_App.ajax({
								type: "get",
								url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
								data: {
									activeId: data[k].ACTIVITY_ID
								},
								cache: false,
								dataType: "json",
								success: function(response) {
									ws.close();
									custId = response.json.data[0].CUST_ID;
									custName = response.json.data[0].CUST_NAME;
								},
								error: function() {
									ws.close();
									mui.alert('加载失败！');
								}
							});
							recordId = data[k].RECORD_ID;
							flowFinishFlag = data[k].PS_FINISH_FLAG;
							_step = data[k].STEP;
							activityId = custId;
							activityRefId = data[k].ACTIVITY_REF_IDS;
							custName = custName;
						}
					}
				}
			}
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
	getSceneFlowMes();
}

function loadCurrentSceneData(data) { //加载当前正在进行的流程
	refreshData(data);
	if(ps_finish_flag == "Y" && !data) {
		//说明已经通过
		return;
	}
	if(data.STEP == "2" && judgeA == "1" && data.PS_FINISH_FLAG != "Y") { //2B走完
		return;
	}
	if(data.STEP == "2" && judgeA == "2" && data.PS_FINISH_FLAG == "Y") {
		return;
	}
	var step = "" + data.STEP; //获取正在进行的流程步数
	var judge = data.FINISH_FLAG; //0正在进行，1已经完成
	if(1 * step == 1 && judge == "0") { //第一关正在进行
		getActivityDetail();
		setbutton("1");
	} else if(1 * step == 1 && judge == "1") { //第一关已经完成
		setbutton("2");
		getActivityDetail(judge);
		var buttonContent = document.getElementById("senLogId");
		//		buttonContent.innerHTML = '<button type="button2" class="mui-btn mui-pull-right" id="button2">继续闯关</button>';
		document.getElementById("senLogId").setAttribute("data-info", '继续闯关');
	} else if(1 * step == 2) {
		if(data.PS_FINISH_FLAG == "Y" && judge == "0") { //第二关的流程2B正在进行
			document.getElementById("titileId").innerHTML = "2B日常关怀";
			judgeAB = "1";
			setbutton("1");
			exeActivityDetail2();
		} else if(data.PS_FINISH_FLAG == "Y" && judge == "1") { //第二关的流程2B已经完成
			document.getElementById("titileId").innerHTML = "2B日常关怀";
			setbutton("2");
			queryActivityDetail2();
		} else if(data.PS_FINISH_FLAG == "N" && judge == "0") { //第二关的流程2A正在进行
			document.getElementById("titileId").innerHTML = "2A客户拜访";
			judgeAB = "0";
			setbutton("1");
			exeActivityDetail2();
		} else if(data.PS_FINISH_FLAG == "N" && judge == "1") { //第二关的流程2A已经完成
			document.getElementById("titileId").innerHTML = "2A客户拜访";
			setbutton("2");
			queryActivityDetail2();
		}
	} else if(1 * step == 3 && judge == "0") { //第三关流程正在进行
		document.getElementById("titileId").innerHTML = "3A创建商机";
		setbutton("1");
		exeActivityDetail3();
	} else if(1 * step == 3 && judge == "1") { //第三关流程已经完成
		document.getElementById("titileId").innerHTML = "3A创建商机";
		setbutton("2");
		queryActivityDetail3();
	} else if(1 * step == 4 && judge == "0") { //第四关的流程正在进行
		document.getElementById("titileId").innerHTML = "4A商机达成";
		setbutton("1");
		exeActivityDetail4();
	} else if(1 * step == 4 && judge == "1") { //第四关流程已经完成
		document.getElementById("titileId").innerHTML = "4A商机达成";
		setbutton("2");
		queryActivityDetail4();
	}
}

function refreshData(data) { //用于刷新详情界面图片点击事件
	flowFinishFlag = data.PS_FINISH_FLAG;
	_step = data.STEP;
	activityRefId = data.ACTIVITY_REF_IDS;
	activityId = data.ACTIVITY_ID;
	recordId = data.RECORD_ID;
	if(data.STEP != "1") {
		var ws = plus.nativeUI.showWaiting();
		_App.ajax({
			type: "get",
			url: basePath + 'mktSceneThreeManageAction!getCustInfo.json',
			data: {
				activeId: data.ACTIVITY_ID
			},
			cache: false,
			dataType: "json",
			success: function(response) {
				ws.close();
				custId = response.json.data[0].CUST_ID;
				custName = response.json.data[0].CUST_NAME;
				activityId = custId;
			},
			error: function() {
				ws.close();
				mui.alert('加载失败！');
			}
		});
	}
}

function setbutton(data) { //data=1为过关data=2为继续闯关
	var buttonContent = document.getElementById("senLogId");
	if(data == "1") {
		document.getElementById("senLogId").setAttribute("data-info", '过关');
	} else {
		document.getElementById("senLogId").setAttribute("data-info", '继续闯关');
	}

}

function stepJ() { //用于添加分享和下一步图片
	closeShade();
	if(_step == "1") {
		var btnArray = ['是', '否'];
		mui.confirm('大额变动频繁，是否有流失风险？', '提示', btnArray, function(e) {
			if(e.index == 0) {
				colorJudge = 1;
				refreshContent("2", "2A");
			} else {
				colorJudge = 2;
				refreshContent("2", "2B");
			}
		});
	} else if(_step == "2") {
		if(judgeAB == "1") {
			refreshContent();
			plus.webview.currentWebview().close();
		} else {
			refreshContent();
		}
	} else if(_step == "3") {
		refreshContent();
	} else {
		plus.webview.currentWebview().close();
	}
}

function doShare() {
	//需要截屏
	_App.share.init(plus.webview.currentWebview(), function(path) {
		var cwebviewId = plus.webview.currentWebview().id;
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
		//到这里才关闭
	});
}

function doBallon() {
	if(_step == "1") {
       refreshContent("2", "2A"); 
	} else if(_step == "2") {
		refreshContent();
	} else if(_step == "3") {
		refreshContent();
	} else {
		plus.webview.currentWebview().close();
	}
	closeShade();
	mui.back();
}

function refreshContentBA() {
	refreshContent();
	if(_step == "2") {
		var btnArray = ['是', '否'];
		mui.confirm('大额变动频繁，是否有流失风险？', '提示', btnArray, function(e) {
			if(e.index == 0) {
				colorJudge = 1;
				refreshContent("2", "2A");
			} else {
				colorJudge = 2;
				refreshContent("2", "2B");
			}
		});
	}
}

function removeListener() {
	var Content = document.getElementById("senLogId");
	Content.removeEventListener("tap", refreshContentBA, false);
	Content.removeEventListener("tap", backSaveFlowMes, false);
	Content.removeEventListener("tap", saveSignData, false);
	Content.removeEventListener("tap", saveBusiData, false);
	Content.removeEventListener("tap", saveBusiCompleteData, false);
	Content.removeEventListener("tap", refreshContent, false);
}