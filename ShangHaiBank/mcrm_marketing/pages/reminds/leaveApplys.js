var logName = plus.storage.getItem('userName');
var pageInfo;//判断是申请人页面还是审批人页面

if(logName != 'zhangjingli') {
	pageInfo = {};
} else {
	pageInfo = {
		url: basePath + 'ocrmFMobileLeaveApproveAction!searchMyApply.json', //查询URL
		pageSize: 6, //分页大小
		scrollerId: 'pullrefresh',
		ulId: 'ulId',
		getCondition: function() { //获取查询条件方法
			//			return "a=1&b=2";//查询条件
		},
		success: function(response) {
			document.getElementById('keySearch').value = '';
			var data = response.json.data;
			var table = document.getElementById('ulId');
			if(data.length != 0) {
				table.classList.add('dark-bg');
				var arr = ['<b class="tagTips c2 bdc2">审批中</b>',
					'<b class="tagTips c1 bdc1">已通过</b>',
					'<b class="tagTips c4 bdc4">已打回</b>'
				];
				for(var i = 0; i < data.length; i++) {
					var a;
					if(data[i].STATUS_NO1 == '0' || (data[i].STATUS_NO1 == '1' && data[i].STATUS_NO2 == '0')) {
						a = '0';
					} else if(data[i].STATUS_NO1 == '1' & data[i].STATUS_NO2 == '1') {
						a = '1';
					} else {
						a = '2';
					}
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">' +
						'<a class="mui-navigate-right" approveNameNo1="' + data[i].APPROVE_NAME_NO1 + '" approveNameNo2="' + data[i].APPROVE_NAME_NO2 + '"' +
						' statusNo1="' + data[i].STATUS_NO1 + '" statusNo2="' + data[i].STATUS_NO2 + '" applyTime="' + data[i].APPLY_TIME + '"' +
						' reason="' + data[i].APPLY_REASON + '" applyName="' + data[i].APPLY_NAME + '" href="' + data[i].FLOW_ID + '" startTime="' + data[i].START_TIME + '" endTime="' + data[i].END_TIME + '"' +
						' approveReason1="' + data[i].APPROVE_REASON_NO1 + '" approveReason2="' + data[i].APPROVE_REASON_NO2 + '" approveTime1="' + data[i].APPROVE_TIME_NO1 + '" approveTime2="' + data[i].APPROVE_TIME_NO2 + '">' +
						arr[a] +
						'<p>请假申请人：' + data[i].APPLY_NAME + '</p>' +
						'<p id="planDoName">申请时间：' + data[i].APPLY_TIME + '</p>' +
						'</a></li>';
					table.appendChild(ul);
				}
			}

		},
		error: function() {
			alert('error!');
		}
	}
}
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	pageInfoConfig: pageInfo,
	//ui加载完成调用
	uiReady: function() {
		getLogName();
		mui('#plId').on('tap', 'a', function() {
			goDetailPage(this, 2);
		});
		mui('#olId').on('tap', 'a', function() {
			goDetailPage(this, 1);
		});
		mui('#ulId').on('tap', 'a', function() {
			goDetailPage(this, 1);
		});
	},
	//设备资源加载完成调用
	deviceReady: function() {
		var pageQuery = _App.scroller;
		if(pageQuery) {
			pageQuery.loadData(true); //flag :true 下拉;false 上拉
		}
	}
};
_App.init(appConfig);
var refreshContent = function(){
	_App.scroller.loadData(true);
}

var getLogName = function() {
	if(logName != 'zhangjingli') {
		document.getElementById('superBt').style.display = 'none';
		if(document.getElementById('judge1').style.display != 'none') {
			document.getElementById('judge1').classList.remove('mui-active');
			document.getElementById('judge1').style.display = 'none';
			document.getElementById('item1mobile').style.display = 'none';
			document.getElementById('judge2').classList.add('mui-active');
			document.getElementById('item3mobile').classList.add('mui-active');
		}
		refreshNoApproved();
		refreshApproved();
	} else {
		if(document.getElementById('judge2').style.display != 'none') {
			document.getElementById('judge2').style.display = 'none';
			document.getElementById('judge3').style.display = 'none';
			document.getElementById('item3mobile').style.display = 'none';
			document.getElementById('item4mobile').style.display = 'none';
		}
		refreshMyApply();
	}
}

var refreshMyApply = function(searchVal) {
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmFMobileLeaveApproveAction!searchMyApply.json?searchVal=' + searchVal,
		//		data:{},
		cache: false,
		// 		async: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('ulId');
			table.innerHTML = '';
			if(data.length != 0) {
				table.classList.add('dark-bg');
				var arr = ['<b class="tagTips c2 bdc2">审批中</b>',
					'<b class="tagTips c1 bdc1">已通过</b>',
					'<b class="tagTips c4 bdc4">已打回</b>'
				];
				for(var i = 0; i < data.length; i++) {
					var a;
					if(data[i].STATUS_NO1 == '0' || (data[i].STATUS_NO1 == '1' && data[i].STATUS_NO2 == '0')) {
						a = '0';
					} else if(data[i].STATUS_NO1 == '1' & data[i].STATUS_NO2 == '1') {
						a = '1';
					} else {
						a = '2';
					}
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">' +
						'<a class="mui-navigate-right" approveNameNo1="' + data[i].APPROVE_NAME_NO1 + '" approveNameNo2="' + data[i].APPROVE_NAME_NO2 + '"' +
						' statusNo1="' + data[i].STATUS_NO1 + '" statusNo2="' + data[i].STATUS_NO2 + '" applyTime="' + data[i].APPLY_TIME + '"' +
						' reason="' + data[i].APPLY_REASON + '" applyName="' + data[i].APPLY_NAME + '" href="' + data[i].FLOW_ID + '" startTime="' + data[i].START_TIME + '" endTime="' + data[i].END_TIME + '" approveTime1="' + data[i].APPROVE_TIME_NO1 + '" approveTime2="' + data[i].APPROVE_TIME_NO2 + '">' +
						arr[a] +
						'<p>请假申请人：' + data[i].APPLY_NAME + '</p>' +
						'<p id="planDoName">申请时间：' + data[i].APPLY_TIME + '</p>' +
						'</a></li>';
					table.appendChild(ul);
				}
			}
		},
		error: function(a, b, c) {
			mui.toast("获取申请列表失败");
		}
	});
}

var refreshNoApproved = function() {
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmFMobileLeaveApproveAction!searchHaveNoApproved.json',
		//		data:{},
		cache: false,
		// 		async: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('plId');
			table.innerHTML = '';
			if(data.length != 0) {
				table.classList.add('dark-bg');
				var arr = ['<b class="tagTips c2 bdc2">审批中</b>',
					'<b class="tagTips c1 bdc1">已通过</b>',
					'<b class="tagTips c4 bdc4">已打回</b>'
				];
				for(var i = 0; i < data.length; i++) {
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">' +
						'<a class="mui-navigate-right" approveNameNo1="' + data[i].APPROVE_NAME_NO1 + '" approveNameNo2="' + data[i].APPROVE_NAME_NO2 + '"' +
						' statusNo1="' + data[i].STATUS_NO1 + '" statusNo2="' + data[i].STATUS_NO2 + '" applyTime="' + data[i].APPLY_TIME + '"' + ' approveReason1="' + data[i].APPROVE_REASON_NO1 + '" approveReason2="' + data[i].APPROVE_REASON_NO2 +
						'" reason="' + data[i].APPLY_REASON + '" applyName="' + data[i].APPLY_NAME + '"  href="' + data[i].FLOW_ID + '" startTime="' + data[i].START_TIME + '" endTime="' + data[i].END_TIME + '" approveTime1="' + data[i].APPROVE_TIME_NO1 + '" approveTime2="' + data[i].APPROVE_TIME_NO2 + '">' +
						'<b class="tagTips icon-star-empty c2 bdc2">进行中</b>' +
						'<p>请假申请人：' + data[i].APPLY_NAME + '</p>' +
						'<p id="planDoName">申请时间：' + data[i].APPLY_TIME + '</p>' +
						'</a></li>';
					table.appendChild(ul);
				}
			}
		},
		error: function(a, b, c) {
			mui.toast("获取申请列表失败");
		}
	});
}

var refreshApproved = function() {
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmFMobileLeaveApproveAction!searchHaveApproved.json',
		//		data:{},
		cache: false,
		// 		async: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('olId');
			table.innerHTML = '';
			if(data.length != 0) {
				table.classList.add('dark-bg');
				var arr = ['<b class="tagTips c2 bdc2">审批中</b>',
					'<b class="tagTips c1 bdc1">已通过</b>',
					'<b class="tagTips c4 bdc4">已打回</b>'
				];
				for(var i = 0; i < data.length; i++) {
					var a;
					if(data[i].STATUS_NO1 == '0' || (data[i].STATUS_NO1 == '1' && data[i].STATUS_NO2 == '0')) {
						a = '0';
					} else if(data[i].STATUS_NO1 == '1' & data[i].STATUS_NO2 == '1') {
						a = '1';
					} else {
						a = '2';
					}
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">' +
						'<a class="mui-navigate-right" approveNameNo1="' + data[i].APPROVE_NAME_NO1 + '" approveNameNo2="' + data[i].APPROVE_NAME_NO2 + '"' +
						' statusNo1="' + data[i].STATUS_NO1 + '" statusNo2="' + data[i].STATUS_NO2 + '" applyTime="' + data[i].APPLY_TIME + '"' + ' approveReason1="' + data[i].APPROVE_REASON_NO1 + '" approveReason2="' + data[i].APPROVE_REASON_NO2 +
						'" reason="' + data[i].APPLY_REASON + '" applyName="' + data[i].APPLY_NAME + '"  href="' + data[i].FLOW_ID + '" startTime="' + data[i].START_TIME + '" endTime="' + data[i].END_TIME + '" approveTime1="' + data[i].APPROVE_TIME_NO1 + '" approveTime2="' + data[i].APPROVE_TIME_NO2 + '">' + arr[a] +
						'<p>请假申请人：' + data[i].APPLY_NAME + '</p>' +
						'<p id="planDoName">申请时间：' + data[i].APPLY_TIME + '</p>' +
						'</a></li>';
					table.appendChild(ul);
				}
			}
		},
		error: function(a, b, c) {
			mui.toast("获取申请列表失败");
		}
	});
}

function addApply() {
	var id = null;
	_App.util.goPage('addApply.html?cwebviewId=leaveApply.html', {
		refresh: true,
		pageId: 'addApply.html'
	});
}

var search = function() {
	var searchVal = document.getElementById('keySearch').value;
	refreshMyApply(searchVal);
}

var goDetailPage = function(data, judge) {
	var applyReason = data.getAttribute('reason');
	var applyName = data.getAttribute('applyName');
	var applyTime = data.getAttribute('applyTime');
	var approveNameNo1 = data.getAttribute('approveNameNo1');
	var approveNameNo2 = data.getAttribute('approveNameNo2');
	var statusNo1 = data.getAttribute('statusNo1');
	var statusNo2 = data.getAttribute('statusNo2');
	var flowId = data.getAttribute('href');
	var startTime = data.getAttribute('startTime');
	var endTime = data.getAttribute('endTime');
	var approveTime1 = data.getAttribute('approveTime1');
	var approveTime2 = data.getAttribute('approveTime2');
	var approveReason1 = data.getAttribute('approveReason1');
	var approveReason2 = data.getAttribute('approveReason2');
	_App.util.goPage('leaveApplyDetail.html?applyReason=' + encodeURIComponent(applyReason) + '&applyName=' + encodeURIComponent(applyName) +
		'&applyTime=' + applyTime + '&approveNameNo1=' + encodeURIComponent(approveNameNo1) + '&startTime=' + startTime + '&endTime=' + endTime + '&approveTime1=' + approveTime1 + '&approveTime2=' + approveTime2 +
		'&statusNo1=' + encodeURIComponent(statusNo1) + '&approveNameNo2=' + encodeURIComponent(approveNameNo2) + '&approveReason1=' + encodeURIComponent(approveReason1) + '&approveReason2=' + encodeURIComponent(approveReason2) +
		'&statusNo2=' + encodeURIComponent(statusNo2) + '&logName=' + logName + '&flowId=' + flowId + '&judgeApproved=' + judge + '&cwebviewId=leaveApply.html', {
			refresh: true,
			pageId: 'leaveApplyDetail_id'
		});
}