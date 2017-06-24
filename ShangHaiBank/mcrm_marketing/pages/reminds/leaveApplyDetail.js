var applyReason = _App.util.getUrlParamByName("applyReason");
var applyName = _App.util.getUrlParamByName("applyName");
var applyTime = _App.util.getUrlParamByName("applyTime");
var approveNameNo1 = _App.util.getUrlParamByName("approveNameNo1");
var statusNo1 = _App.util.getUrlParamByName("statusNo1");
var approveNameNo2 = _App.util.getUrlParamByName("approveNameNo2");
var statusNo2 = _App.util.getUrlParamByName("statusNo2");
var logName = _App.util.getUrlParamByName("logName");
var startTime = _App.util.getUrlParamByName("startTime");
var endTime = _App.util.getUrlParamByName("endTime");
var judgeApproved = _App.util.getUrlParamByName("judgeApproved");
var approveReason1 = _App.util.getUrlParamByName("approveReason1");
var approveReason2 = _App.util.getUrlParamByName("approveReason2");
var approveTime1 = _App.util.getUrlParamByName("approveTime1");
var approveTime2 = _App.util.getUrlParamByName("approveTime2");
var flowId = _App.util.getUrlParamByName("flowId");
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		initDetail();
	},
	//设备资源加载完成调用
	deviceReady: function() {}
};

_App.init(appConfig);

var initDetail = function() {
	if(logName == 'zhangjingli') {
		document.getElementById('senLogId').style.display = 'none';
	}
	if(statusNo1 != '0' && statusNo2 == '0' && logName != 'zhangjingli') {
		document.getElementById('approveReason2').removeAttribute('readonly');
	}
	if(statusNo1 == '2') { //如果主管打回，则行长审批状态为空
		statusNo2 = '';
	} else if(statusNo2 == '0') { //如果行长为审批中
		statusNo2 = '审批中';
		document.getElementById('step3').style.backgroundColor = '#49a1e9';
	} else if(statusNo2 == '1') { //行长为审批通过
		statusNo2 = '审批通过';
		document.getElementById('step3').style.backgroundColor = '#fba011';
	} else if(statusNo2 == '2') { //如果行长为审批打回
		statusNo2 = '审批打回';
		document.getElementById('step3').style.backgroundColor = '#ff713c';
	}
	if(statusNo1 == '0') {
		statusNo1 = '审批中';
		statusNo2 = '待审批';
		if(logName != 'zhangjingli') {
			document.getElementById('approveReason1').removeAttribute('readonly');
		}
		document.getElementById('step2').style.backgroundColor = '#49a1e9';
		document.getElementById('step3').style.backgroundColor = '#a7a8aa';
	} else if(statusNo1 == '1') {
		statusNo1 = '审批通过';
		document.getElementById('step2').style.backgroundColor = '#fba011';
	} else if(statusNo1 == '2') {
		statusNo1 = '审批打回';
		document.getElementById('step2').style.backgroundColor = '#ff713c';
	}
	if(judgeApproved == '1') { //判断是审批界面还是非审批界面
		document.getElementById('senLogId').style.display = 'none';
	}
	document.getElementById('name').innerText = '申请人名称：' + applyName;
	document.getElementById('applyTime').innerText = '申请时间：' + applyTime;
	document.getElementById('applyReason').value = applyReason;
	document.getElementById('approveNameNo1').innerText = '客户经理主管：' + approveNameNo1;
	document.getElementById('statusNo1').innerText = statusNo1;
	document.getElementById('approveNameNo2').innerText = '分行行长：' + approveNameNo2;
	document.getElementById('statusNo2').innerText = statusNo2;
	//	document.getElementById('startTime').innerText = '开始时间：' + startTime;
	//	document.getElementById('endTime').innerText = '结束时间：' + endTime;
	document.getElementById('approveReason1').value = approveReason1;
	document.getElementById('approveReason2').value = approveReason2;
	document.getElementById('approveTime1').innerText = approveTime1;
	document.getElementById('approveTime2').innerText = approveTime2;

}

var judgePass = function(data) {
	var approveReason = '';
	if(statusNo1 == '审批中') {
		approveReason = document.getElementById('approveReason1').value;
	} else {
		approveReason = document.getElementById('approveReason2').value;
	}
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmFMobileLeaveApproveAction!judgePass.json?flowId=' + flowId + '&judge=' + data + '&approveReason=' + approveReason,
		cache: false,
		// 		async: false,
		dataType: "json",
		success: function(response) {
			var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
			cwebviewId = plus.webview.getWebviewById(cwebviewId);
			mui.fire(cwebviewId, 'refreshApprove', {});
			plus.webview.currentWebview().close();
		},
		error: function(a, b, c) {
			mui.toast("获取申请列表失败");
		}
	});
}

function doShare() {
	var potentialFlag = _App.util.getUrlParamByName('potentialFlag');
	var currentId = plus.webview.currentWebview().id;
	cutScreen("circleTag", function(data) {
		plus.storage.removeItem("_shareImgPath_")
		plus.storage.setItem("_shareImgPath_", data);
		var url = "../finding/share/share.html?cwebviewObjId=" + currentId + "&bizType=SP&bizId=" + flowId;
		_App.util.goPage(url, {
			pageId: 'share_id',
			refresh: true
		});
	});
}