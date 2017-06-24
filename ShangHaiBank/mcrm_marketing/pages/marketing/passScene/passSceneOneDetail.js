var flowFinishFlag = _App.util.getUrlParamByName("flowFinishFlag");//场景完成标识
var sceneName_ = decodeURIComponent(_App.util.getUrlParamByName("name"));
var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");
var _step_ = _App.util.getUrlParamByName("step");
var activityId = _App.util.getUrlParamByName("activityId");
var _finishFlag_ = _App.util.getUrlParamByName("finishFlag");
var activityRefId = _App.util.getUrlParamByName("activityRefId");
var custId = _App.util.getUrlParamByName("custId");//客户ID是下一步的activityId
var custName = decodeURIComponent(_App.util.getUrlParamByName("custName"));//客户名称在某些步骤中用到
var pwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
var cwebviewId;
var backPage;//返回界面对象
var _currentStep_ = "";//记录当前关

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		cwebviewId = plus.webview.currentWebview().id;
		cwebviewId = encodeURIComponent(cwebviewId);
		backPage = plus.webview.getWebviewById(pwebviewId);
		if(sceneName_ && sceneName_ != "undefined")
			document.getElementById("titileId").innerHTML = ""+_step_+sceneName_;
		var objSenLog = document.getElementById("senLogId");
		if(_finishFlag_ && 1*_finishFlag_ == 1){//完成状态为1时，主界面过来是看详情，需改变操作按钮
			objSenLog.removeEventListener("tap", finishCurrentStep, false);  
//			objSenLog.innerHTML = "继续闯关";
			objSenLog.addEventListener('tap',continueStepFun,false);
		}else{
			objSenLog.removeEventListener("tap", continueStepFun, false);  
//			objSenLog.innerHTML = "过关";
			objSenLog.addEventListener('tap',finishCurrentStep,false);
		}
		getSceneFlowMes();
		
		document.querySelector('.myShade').addEventListener('tap',function(){
			closeShade();
			go2homepage();
		});
		document.querySelector('#ballon').addEventListener('tap',function(){
			closeShade();
			go2homepage();
		});
		document.querySelector('#nextButId').addEventListener('tap',function(){
			closeShade();
			if(1*_step_ == 5 && 1*_finishFlag_ == 1){
				go2homepage();
			}else{
				//直接跳转到下一关业务处理
				getSceneFlowMes();
			}
		});
		document.querySelector('#shareButId').addEventListener('tap',function(){
			doShare();
			//分享暂时未做
//			mui.toast("努力开发中...");
		});
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

var ps_finish_flag = "N";
function showSceneFlowMes(data){
	for(var i = 0; i < data.length; i++){
		var d = data[i];
		var step = ""+d.STEP;
		var psFinishFlag = ""+d.PS_FINISH_FLAG;//ps_finish_flag == Y -- 通关 
		var finishFlag = ""+d.FINISH_FLAG; 
		
		if(psFinishFlag == "Y" && 1*finishFlag == 1){
			_currentStep_ = step;
			ps_finish_flag = "Y";
		}
			
		var status_css = "";
		if(finishFlag){
			if(1 == 1*finishFlag)
				status_css = "ed";
			else if(0 == 1*finishFlag){
				if(1*_finishFlag_ == 0){//只有完成状态为执行时，才改变下面值（主界面详情过来时，值不变）
					_step_ = step;
					activityId = ""+d.ACTIVITY_ID;
					activityRefId = ""+d.ACTIVITY_REF_IDS;
					recordId = ""+d.RECORD_ID;
					document.getElementById("titileId").innerHTML = ""+step+d.NAME;
					var objSenLog = document.getElementById("senLogId");
					objSenLog.removeEventListener("tap", continueStepFun, false);  
//					objSenLog.innerHTML = "过关";
					objSenLog.addEventListener('tap',finishCurrentStep,false);
				}
				_currentStep_ = step;
				status_css = "ing";
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
		var objSenLog = document.getElementById("senLogId");
		objSenLog.style.display = "none";
	}else{
		obj_.classList.remove("finished");
		obj_.innerHTML = "进行中";
	}
	
//	var _h=document.getElementById('anBg').clientHeight-document.getElementsByClassName('an-wrapper')[0].clientHeight;
//	mui('.mui-scroll-wrapper').scroll({startY:-(_h-50)});//
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
		if(1*_currentStep_ >= 1*m.STEP){
			var objSenLog = document.getElementById("senLogId");
			if(1*_currentStep_ == 1*m.STEP){//点击的是当前关
				_step_ = m.STEP;
				activityId = ""+m.ACTIVITY_ID;
				activityRefId = ""+m.ACTIVITY_REF_IDS;
				recordId = ""+m.RECORD_ID;
				objSenLog.removeEventListener("tap", continueStepFun, false);  
//				objSenLog.innerHTML = "过关";
				objSenLog.addEventListener('tap',finishCurrentStep,false);
				clickCurrentScene(m);
			}else{//已过关卡，查看详情
				objSenLog.removeEventListener("tap", finishCurrentStep, false);  
//				objSenLog.innerHTML = "继续闯关";
				objSenLog.addEventListener('tap',continueStepFun,false);
				//查看已处理步骤详情
				queryNodeDetail(m);
			}
		}
	});
	//展示详情
	if(1*_step_ == 1)
		getActivityDetail();
	else if(1*_step_ == 2){
		getActivityDetail2();
	}else if(1*_step_ == 3){
		getActivityDetail3();
	}else if(1*_step_ == 4){
		getActivityDetail4();
	}else if(1*_step_ == 5){
		getActivityDetail5();
	}
}
//----------------------------------------------------第五关------------------------------------------------------------
function getActivityDetail5(){
	if(1*_finishFlag_ == 0)
		exeActivityDetail5();
	else
		queryActivityDetail5();
	
}

function exeActivityDetail5(){
	if(!custName || custName == "undefined")
		custName = "陈群智";
	var html = '<form class="mui-input-group"><div class="ys-custTitle">商机基本信息</div><div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>'+custName+'</span></p><p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>营销产品：</b><span>流动资金贷款</span><span>、现金管理</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p></div>';
	html += '<div class="mui-input-row"><label style="width: 45%;">确认落地：</label>';
	html += '<div class="mui-switch mui-switch-blue mui-active" style="float: left;" id="switchBtnId">';
	html += '<div class="mui-switch-handle"></div></div></div>';
	html += '<div id="doPlan"><div class="mui-input-row"><label>落地规模：</label>';
	html += '<input id="doScale" type="text" class="mui-input-clear" placeholder="落地规模(万元)">';
	html += '</div><div class="mui-input-row"><label>落地产品：</label>';
	html += '<input id="prodChooseId" type="text" readonly="true" class="mui-input-clear" placeholder="--选择--"></div>';
	html += '<div class="mui-input-row"><label>落地描述：</label></div></div>';
	html += '<div class="mui-input-row" style="height:5em;">';
	html += '<textarea id="t2" type="text" class="mui-input-clear" placeholder="描述"></textarea></div>';
//	html += '<div class="mui-button-row">';
//	html += '<button type="button" class="mui-btn mui-btn-danger">保   存</button>';
//	html += '</div>';
	html += '</form>';
	document.getElementById("des").innerHTML = html;
//	mui("#des").on('tap','button',function(){
//		saveOpportData5();
//	});
}

function queryActivityDetail5(){
	if(!custName || custName == "undefined")
		custName = "陈群智";
	var html = '<div id="mcc-custView" class="mui-control-content mui-active">';
	html += '<div class="ys-custTitle">商机基本信息';
	html += '</div>';
	html += '<div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>'+custName+'</span></p><p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>规模：</b><span>1200万</span></p><p><b>状态：</b><span>已落地</span></p>';
	html += '<p><b>产品名称：</b><span>流动资金贷款</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>产品经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p></div>';
	html += '<div class="ys-custTitle" id="salePlanTitle">营销方案信息</div>';
	html += '<div class="ys-custInfo ys-bothNeat" id="salePlanCon"><h5 class="mui-content-padded">基本信息</h5>';
	html += '<div class="ys-custInfo mui-card"><p><b>方案名称：</b><span>出口企业融资营销方案</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销流程</h5><div class="ys-custInfo mui-card">';
	html += '<span class="ys-step-node" >锁定客户</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >接触推销</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >反馈</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >铺垫下次营销</span></div>';
	html += '<h5 class="mui-content-padded">产品定价描述</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1基准利率：</b><span>10%</span></p><p><b>2上下浮动：</b><span>1%</span></p>';
	html += '<p><b>3手续费率：</b><span>0.5%</span></p><p><b>4其他：</b><span>1000万以上手续费可减免</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销注意事项</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>点击某条商机可以看到客户具体信息</span></p><p><b>2：</b><span>产品定价准确性</span></p></div>';
	html += '<h5 class="mui-content-padded">营销话术</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>融资需求必须使用某产品</span></p><p><b>2：</b><span>产品定价准确性</span></p>';
	html += '</div></div>';
	html += '<div class="ys-custTitle" id="doPlanTitle">营销落地信息</div>';
	html += '<div class="ys-custInfo" id="doPlanCon"><p><b>确认落地：</b><span>已落地</span></p>';
	html += '<p><b>落地规模：</b><span>3000万</span></p><p><b>落地产品：</b><span>基础授信，基础结算及中间业务</span></p>';
	html += '<p><b>落地描述：</b><span>根据与客户的沟通，商机已落地</span></p>';
	html += '</div>';
	document.getElementById("des").innerHTML = html;
}

var is5saveFlag = false;
function saveOpportData5(){
	is5saveFlag = true;
	flowExeFu();
}

//-----------------------------------------------------第四关---------------------------------------------------
function getActivityDetail4(){
	if(1*_finishFlag_ == 0)
		exeActivityDetail4();
	else
		queryActivityDetail4();
}

function queryActivityDetail4(){
	if(!custName || custName == "undefined")
		custName = "陈群智";
	var html = '<div id="mcc-custView" class="mui-control-content mui-active">';
	html += '<div class="ys-custTitle">商机基本信息';
	html += '</div>';//<button id="setImptBt" type="button" class="mui-btn icon-flag">设为重点</button>
	html += '<div class="ys-custInfo">';
	html += '<p><b>客户名称：</b><span>'+custName+'</span></p><p><b>所属行业：</b><span>IT企业</span></p>';
	html += '<p><b>规模：</b><span>1200万</span></p><p><b>状态：</b><span>已落地</span></p>';
	html += '<p><b>产品名称：</b><span>流动资金贷款</span></p>';
	html += '<p><b>产品经理：</b><span>方成平</span></p>';
	html += '<p><b>产品经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>主办机构：</b><span>北京中关村支行</span></p>';
	html += '<p><b>主办客户经理：</b><span>陈一峰</span></p>';
	html += '<p><b>主办客户经理电话：</b><span>010-99999999</span></p>';
	html += '<p><b>商机描述：</b><span>商机描述</span></p></div>';
	html += '<div class="ys-custTitle" id="salePlanTitle">营销方案信息</div>';
	html += '<div class="ys-custInfo ys-bothNeat" id="salePlanCon"><h5 class="mui-content-padded">基本信息</h5>';
	html += '<div class="ys-custInfo mui-card"><p><b>方案名称：</b><span>出口企业融资营销方案</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销流程</h5><div class="ys-custInfo mui-card">';
	html += '<span class="ys-step-node" >锁定客户</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >接触推销</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >反馈</span>';
	html += '<i class="icon-arrow-right2"></i><span class="ys-step-node" >铺垫下次营销</span></div>';
	html += '<h5 class="mui-content-padded">产品定价描述</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1基准利率：</b><span>10%</span></p><p><b>2上下浮动：</b><span>1%</span></p>';
	html += '<p><b>3手续费率：</b><span>0.5%</span></p><p><b>4其他：</b><span>1000万以上手续费可减免</span></p></div>';
	html += '<h5 class="mui-content-padded">产品营销注意事项</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>点击某条商机可以看到客户具体信息</span></p><p><b>2：</b><span>产品定价准确性</span></p></div>';
	html += '<h5 class="mui-content-padded">营销话术</h5><div class="ys-custInfo mui-card">';
	html += '<p><b>1：</b><span>融资需求必须使用某产品</span></p><p><b>2：</b><span>产品定价准确性</span></p>';
	html += '</div></div></div>';
	document.getElementById("des").innerHTML = html;
}

function exeActivityDetail4(){
	if(!custName || custName == "undefined")
		custName = "陈群智";
	var html = '<form class="mui-input-group">';
	html += '<div class="mui-input-row">';
	html += '<label>客户名称：</label>';
	html += '<input id="custName" type="text" readonly="readonly" value="'+custName+'"></div>';
	html += '<div class="mui-input-row">';
	html += '<label>机构代码：</label>';
	html += '<input id="bodyCodeId" type="text" class="mui-input-clear" readonly="readonly" value="600040439305"></div>';
	html += '<div class="mui-input-row">';
	html += '<label>资产规模：</label></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>存款</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" />';
	html += '</div></div><div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>贷款</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" /></div></div>';
	html += '<div><div class="mui-input-row mui-checkbox mui-left mui-input-row-left"><label>结算</label>';
	html += '<input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right"><label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" />';
	html += '</div></div><div>';
	html += '<div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>贴现</label><input name="checkbox1" value="1" type="checkbox">';
	html += '</div><div class="mui-input-row mui-input-row-right">';
	html += '<label>规模：</label><input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" />';
	html += '</div></div><div>';
	html += '<div class="mui-input-row mui-checkbox mui-left mui-input-row-left">';
	html += '<label>其他</label><input name="checkbox1" value="1" type="checkbox"></div>';
	html += '<div class="mui-input-row mui-input-row-right">';
	html += '<label>规模：</label>';
	html += '<input id="t2" type="text" class="mui-input-clear" placeholder="规模(万)" />';
	html += '</div></div>';
	html += '<div class="mui-input-row"><label>商机描述：</label>';
	html += '</div><div class="mui-input-row" style="height:5em;">';
	html += '<textarea id="t2" type="text" class="mui-input-clear" placeholder="商机描述"></textarea>';
//	html += '</div><div class="mui-button-row">';
//	html += '<button type="button" class="mui-btn mui-btn-danger">保 存</button>';
//	html += '</div>';
	html += '</form>';
	document.getElementById("des").innerHTML = html;
	mui("#des").on('tap','button',function(){
		saveOpportData();
	});
}

var is4saveFlag = false;
function saveOpportData(){  
	var userName = document.getElementById("custName").value;
	var bodyCodeId = document.getElementById("bodyCodeId").value;
	var zcgmvalue = document.getElementById("t2").value;
	if(1*zcgmvalue >= 5000){  
		mui.alert("资产规模超5000万，给团队长发短信中...");
	}
	var vmap = {"custName":userName,"bodyCode":bodyCodeId,"oppStep":"1",oppId:"oppId1"};//oppStep:1-商机录入；2-确认方案；3-业务落地；-1：已过期
	var newAddOpportunity = plus.storage.getItem("newAddOpportunity");
	if(!newAddOpportunity){
		newAddOpportunity = [];
	}else{
		newAddOpportunity = JSON.parse(newAddOpportunity);
	}
	newAddOpportunity.push(vmap); 
	plus.storage.removeItem("newAddOpportunity");
	plus.storage.setItem("newAddOpportunity",JSON.stringify(newAddOpportunity));
	is4saveFlag = true;
	flowExeFu();
}
//----------------------------------------------------第三关-------------------------------------------------------------
var longitude,latitude;
function getActivityDetail3(){
	if(1*_finishFlag_ == 0)
		exeActivityDetail3();
	else
		queryActivityDetail3();
}

function queryActivityDetail3(){
	var ws = plus.nativeUI.showWaiting();
	var data_ = {};
	data_.signId = ""+activityRefId;
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneOneManageAction!getSignMes.json',
		data:data_,
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

function showActivityMes(data){
	custName = data[0].custNames;//暂时已这个客户名称
	var html = '<ul class="mui-table-view mui-table-view-group">';
	html += '<li class="mui-table-view-cell">';
	html += '<a><span class="mui-icon mui-icon-minus"></span>';
	var time = data[0].createDate + " " + data[0].signTime;
	html += '<b>时间:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div1">'+time+'</span>';
	html += '</a></li>';
	html += '<li class="mui-table-view-cell">';
	html += '<a class="mui-navigate-right">';
	html += '<span class="mui-icon mui-icon-location"></span>';
	html += '<b>地址:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div2">'+data[0].signAddress+'</span>';
	html += '</a></li></ul>';
	html += '<ul class="mui-table-view mui-table-view-group">';
	html += '<li class="mui-table-view-cell">';
	html += '<a class="mui-navigate-right">';
	html += '<span class="mui-icon mui-icon-star"></span>';
	html += '<b>拜访客户:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custName">'+data[0].custNames+'</span>';
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
	html += '<textarea type="text"  id="ts" class="mui-input-clear" style="height:6em;" readonly="readonly">'+data[0].signMemo+'</textarea>';
	html += '</span>';
	html += '</a></li>';
	html += '</ul>';
	document.getElementById("des").innerHTML = html;
}

function exeActivityDetail3(){
	//时间
	var nowDate = new Date();
	var ndate = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1) + "-" + nowDate.getDate() + " " + nowDate.getHours() + ":" + nowDate.getMinutes();
	var html = '<ul class="mui-table-view mui-table-view-group">';
	html += '<li class="mui-table-view-cell">';
	html += '<a><span class="mui-icon mui-icon-minus"></span>';
	html += '<b>时间:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div1">'+ndate+'</span>';
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
	html += '<b>拜访客户:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custName">'+custName+'</span>';
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
//	html += '<div class="mui-button-row">';
//	html += '<button type="button" class="mui-btn mui-btn-danger">保存</button>';
//	html += '</div>';
	document.getElementById("des").innerHTML = html;
//	mui("#des").on('tap','button',function(){
//		saveSignData();
//	});
	getLocation();
}


function getLocation(){
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
			console.log("longitude>>>"+longitude+"<<latitude>>>"+latitude);
		}

	}, function(e) {
//		ws.close();
		mui.alert("Geolocation error: " + e.message);
		plus.webview.currentWebview().close();
	}
//	, {
//		provider: 'baidu'
//	}
	);
}
var is3save = false;
function saveSignData(){
	if(!longitude || longitude == "undefined"){
		mui.alert("获取地址信息出错，不能保存！");
		return false;
	}
	var ws = plus.nativeUI.showWaiting();
	var data_ = {};
	data_.dataAddress = document.getElementById("div2").innerHTML;
	data_.dataCustName = custName;
	data_.dataCustNames = "王菀之";//document.getElementById("custNames").innerHTML;
	data_.dataMemo = document.getElementById("ts").value;
	data_.longitude = longitude;
	data_.latitude = latitude;
	data_.custId = activityId;
	_App.ajax({
		type: "get",
		url: basePath + 'signCountAction!addSignCount.json',
		data:data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var da = response.json;
			activityRefId = da.signId;
			is3save = true;
			flowExeFu();
		},
		error: function(a, b, c) {
			mui.alert("签到失败");
			ws.close();
		}
	});
}
//--------------------------------------------------第二关-----------------------------------------------------
function getActivityDetail2(){
	var ws = plus.nativeUI.showWaiting();
	var des = document.getElementById("des");
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data:{activeId:activityId},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var custType = data[0].CUST_TYPE;
			var custId = data[0].IDENT_TYPE;
			var cidv = "";
			var ctv = "";
			if("1" == ""+custType){
				ctv = "对公客户";
				cidv = "企业号";
			}else{
				ctv = "对私客户";
				cidv = "身份证";
			}
			var custName = data[0].CUST_NAME;
			
			var html = '<form class="mui-input-group" id="changeDis">';
			html += '<div class="mui-input-row">';
			html += '<label>姓名：</label>';
			html += '<input id="name" type="text" readonly="readonly" value="'+custName+'">';
			html += '</div>';
			html += '<div class="mui-input-row">';
			html += '<label>客户类型：</label>';
			html += '<input id="CUST_TYPE" type="text" readonly="readonly" value="'+ctv+'">';
			html += '</div>';
			html += '<div class="mui-input-row">';
			html += '<label>证件类型：</label>';
			html += '<input id="IDENT_TYPE" type="text" readonly="readonly" value="'+cidv+'">';
			html += '</div>';
			html += '<div class="mui-input-row">';
			html += '<label>证件号码：</label>';
			html += '<input id="IDENT_NO" type="text" readonly="readonly" value="'+data[0].IDENT_NO+'">';
			html += '</div>';
			html += '<div class="mui-input-row">';
			html += '<label>手机号：</label>';
			html += '<input id="name" type="text" readonly="readonly" value="'+data[0].MOBILE+'">';
			html += '</div>';
			html += '<div class="mui-input-row">';
			html += '<label>地址：</label>';
			html += '<input id="LOCATION" type="text" readonly="readonly" value="'+data[0].LOCATION+'">';
			html += '</div>';
			html += '<div class="mui-button-row">';
			html += '<button type="button" class="mui-btn mui-btn-danger">客户视图</button>';
			html += '</div>';
			html += '</form>';
			des.innerHTML = html;
			mui("#des").on('tap','button',function(){
				var url = "";
				custName = encodeURIComponent(custName);
				var name = "张晶丽";
				name = encodeURIComponent(name);
				var pageId = "";
				if("1" == ""+custType){
					url = "../../custManage/comCustView.html?company="+custName+"&name="+name;
					pageId = "comCustView_id";
				}else{
					url = "../../custManage/priCustView.html?company="+custName+"&name="+custName;
					pageId = "priCustView_id";
				}
				_App.util.goPage(url,{
					pageId:pageId,
					refresh:true
				})
			});
		},
		error:function(){
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

//--------------------------------------------------------------步骤一的处理-------------------------------------------------------------
var mkModeArr = ['','市场开拓计划','市场、产品推介活动','客户联谊活动'];//营销方式
var mkChannelArr = ['','柜面','CC','短信','邮件','微信','电话'];//营销渠道
var marketStateArr = ['','暂存','已提交','执行中','正常关闭','到期关闭','已退回'];//营销活动状态
var mkTypeArr = ['','风险产品类营销','理财产品类营销','增值服务类营销','存款产品类营销','贷款产品类营销','代理产品类营销','国债类产品营销','信用卡产品营销','基金类产品营销','事件类营销'];//营销活动类型
function getActivityDetail(){
	var ws = plus.nativeUI.showWaiting();
	var condition={id:activityId};
	var des = document.getElementById("des");
	_App.ajax({
		type: "get",
		url: basePath + 'marketActivityAction.json?conditions=' + JSON.stringify(condition),
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			var yxqd = mkChannelArr[data[0].MKT_CHANEL];
			if(!yxqd || yxqd == "undefined")
				yxqd = "事件类营销";
			des.innerHTML='<form class="mui-input-group"><div class="mui-input-row"><label>营销活动名称:</label><input id="actName" type="text" readonly="readonly" value="'+data[0].MKT_ACTI_NAME+'"></div>'
			+'<div class="mui-input-row"><label>营销渠道:</label><input id="actName" type="text" readonly="readonly" value="'+yxqd+'"></div>'
			+'<div class="mui-input-row"><label>营销活动类型:</label><input id="actName" type="text" readonly="readonly" value="'+mkTypeArr[data[0].MKT_ACTI_TYPE]+'"></div>'
			+'<div class="mui-input-row"><label>营销活动状态:</label><input id="actName" type="text" readonly="readonly" value="'+marketStateArr[data[0].MKT_ACTI_STAT]+'"></div>'
			+'<div class="mui-input-row"><label>营销方式:</label><input id="actName" type="text" readonly="readonly" value="'+mkModeArr[data[0].MKT_ACTI_MODE]+'"></div>'
			+'<div class="mui-input-row"><label>费用预算:</label><input id="cost" type="text" readonly="readonly" value="'+data[0].MKT_ACTI_COST+'"></div>'
			+'<div class="mui-input-row"><label>计划开始时间:</label><input type="text" readonly="readonly" value="'+data[0].PSTART_DATE+'"></div>'
			+'<div class="mui-input-row"><label>计划结束时间:</label><input type="text" readonly="readonly" value="'+data[0].PEND_DATE+'"></div>'
			+'<div class="mui-input-row"><label>活动地点:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].MKT_ACTI_ADDR+'</textarea></div>'
			+'<div class="mui-input-row"><label>营销活动内容:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].MKT_ACTI_CONT+'</textarea></div>'
			+'<div class="mui-input-row" style="height: 60px;"><label>涉及客户群描述:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].ACTI_CUST_DESC+'</textarea></div>'
			+'<div class="mui-input-row" style="height: 60px;"><label>涉及执行人描述:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].ACTI_OPER_DESC+'</textarea></div>'
			+'<div class="mui-input-row"><label>涉及产品描述:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].ACTI_PROD_DESC+'</textarea></div>'
			+'<div class="mui-input-row"><label>营销活动目的:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].MKT_ACTI_AIM+'</textarea></div>'
			+'<div class="mui-input-row"><label>备注:</label><textarea type="text" class="mui-input-clear" readonly="readonly">'+data[0].ACTI_REMARK+'</textarea></div></form>';
		},
		error:function(){
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

var go2back = mui.back;
mui.back = function(){
	mui.fire(backPage,'finishTheNodeEvent__',{
	});
	plus.webview.currentWebview().close();
}
/**
 * 完成当前步骤
 */
function finishCurrentStep(){
	if(1*_step_ == 3){//第三关，客户拜访（签到）
		saveSignData();
	}else if(1*_step_ == 4){
		saveOpportData();
	}else if(1*_step_ == 5){
		saveOpportData5();
	}else{
		flowExeFu();
	}
}

function flowExeFu(){
	if(!activityRefId || activityRefId == "undefined")
		activityRefId = "";
	if(1*_step_ == 5)
		flowFinishFlag = "Y";
	else
		flowFinishFlag = "N";
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!exeFlowNode.json',
		data:{finishFlag:"1",recordId:recordId,flowFinishFlag:flowFinishFlag,step:_step_,activityId:custId,activityRefId:activityRefId},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			//最后一关完成后，提示已通关；右上角的按钮消失
			if(1*_step_ == 5){
				document.getElementById("nextImgId").src = "wc.png";
				
				document.getElementById("ballon").src = "2.png";
				_finishFlag_ = "1";
			}else{
				document.getElementById("nextImgId").src = "l.png";
				
				document.getElementById("ballon").src = "1.png";
			}
			openShade();
			
			//完成当前步骤，提示是否进行下一关
//			mui('.mui-popover').popover('toggle');
		},
		error:function(){
			ws.close();
			mui.alert('处理失败，请重试！');
		}
	});
}

function continueStepFun(){
	_finishFlag_ = 0;
	getSceneFlowMes();
}
/**
 * 查看选中节点详情
 * @param {Object} data_
 */
function queryNodeDetail(data_){
	document.getElementById("titileId").innerHTML = ""+data_.STEP+data_.NAME;
	if(1*data_.STEP == 1){
		activityId = data_.ACTIVITY_ID;
		getActivityDetail();
	}else if(1*data_.STEP == 2){
		activityId = data_.ACTIVITY_ID;
		getActivityDetail2();
	}else if(1*data_.STEP == 3){
		activityRefId = data_.ACTIVITY_REF_IDS;
		queryActivityDetail3();
	}else if(1*data_.STEP == 4){
		queryActivityDetail4();
	}else if(1*data_.STEP == 5){
		queryActivityDetail5();
	}
}
/**
 * 点击当前正在过关的关卡:
 * 1.右上角变为“过关”
 * @param {Object} data_
 */
function clickCurrentScene(data_){
	var sstep = data_.STEP;
	document.getElementById("titileId").innerHTML = ""+sstep+data_.NAME;
	if(1*sstep == 1)
		getActivityDetail();
	else if(1*sstep == 2){
		getActivityDetail2();
	}else if(1*sstep == 3){
		getActivityDetail3();
	}else if(1*sstep == 4){
		getActivityDetail4();
	}else if(1*sstep == 5){
		getActivityDetail5();
	}
}

function go2homepage(){
	mui.back();
}

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
		//失败回调
		//到这里才关闭
		closeShade();
		getSceneFlowMes();
	});
	/*
	_App.share.init(plus.webview.currentWebview(), function() {//成功回调
		var myParams = {};
		myParams.passId = passId;
		myParams.recordId = recordId;
		myParams.shareTitle = "";
		_App.share.doUploadPic(plus.webview.currentWebview(), myParams, function() {//成功回调
			//到这里才关闭
			closeShade();
			//分享完成后，刷选界面
			getSceneFlowMes();
		},function(){//失败回调
			//到这里才关闭
			closeShade();
			getSceneFlowMes();
		});
	},function(){//失败回调
		//到这里才关闭
		closeShade();
		getSceneFlowMes();
	});
	*/
}
/**
 * 分享后的监听
 */
window.addEventListener('finishShareEvent__',function(event){
	//到这里才关闭
	closeShade();
	//分享完成后，刷选界面
	getSceneFlowMes();
});