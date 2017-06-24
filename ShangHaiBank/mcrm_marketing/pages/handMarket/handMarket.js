var curWebviewId;

function go2opport() {
	var url = "../marketing/opport/myResponsibleOpp.html";
	_App.util.goPage(url, {
		pageId: 'myResponsibleOppId',
		refresh: true
	});
}

function go2cust() {
	var url = "../custManage/myCusts/my-customers.html";
	_App.util.goPage(url, {
		pageId: 'my-customers_Id',
		refresh: true
	});
}

function go2tank() {
	var url = "../marketing/opport/thinkTankTop.html";
	_App.util.goPage(url, {
		pageId: 'thinkTankTop_Id',
		refresh: true
	});
}

function go2performOrg() {
	var url = "../marketing/pma/governor/main.html";
	_App.util.goPage(url, {
		pageId: 'main_Id',
		refresh: true
	});
}

function go2perform() {
	var url = "../marketing/pma/performance/performance.html";
	_App.util.goPage(url, {
		pageId: 'performance_Id',
		refresh: true
	});
}

function go2marketTool() {
	var url = "../marketing/tools/opportunityTools.html";
	_App.util.goPage(url, {
		pageId: 'opportunityTools_id',
		refresh: true
	});
}

function go2signCounts() {
	var url = "../work/sign/signCounts.html";
	_App.util.goPage(url, {
		pageId: 'signCounts_id',
		refresh: true
	});
}

function go2calendar() {
	var url = "../work/calendar/calendar.html";
	_App.util.goPage(url, {
		pageId: 'calendar_id',
		refresh: true
	});
}

function go2colleagues() {
	var url = "../SocialCol/marketingCircle/marketingCircle.html";
	_App.util.goPage(url, {
		pageId: 'marketingCircle_id',
		refresh: true
	});
}

function go2Relative(f) {
	if(f == '0') {
		var url = "../demo/echarts-relative/index.html";
		_App.util.goPage(url, {
			pageId: 'relative-id',
			refresh: true
		});
	}
	if(f == '1') {
		var url = "../demo/echarts-relative/relative-circle.html";
		_App.util.goPage(url, {
			pageId: 'relative_circle-id',
			refresh: true
		});
	}
}

//function go2mapDemos() {
//	var url = "../SocialCol/nearbyMate/map-demos.html";
//	_App.util.goPage(url, {
//		pageId: 'mapDemos_id',
//		refresh: true
//	});
//}

function go2opportList(typeId) {
	var url = "../marketing/opport/buiOpportList.html?typeId=" + typeId;
	_App.util.goPage(url, {
		pageId: 'buiOpportList_id',
		refresh: true
	});
}

function go2opportRank() {
	var url = "../marketing/opport/opportRank.html";
	_App.util.goPage(url, {
		pageId: 'opportRank_id',
		refresh: true
	});
}

function go2mktActivity() {
	var url = "../marketing/tools/addMktActivityLists.html";
	_App.util.goPage(url, {
		pageId: 'addMktActivityLists_id',
		refresh: true
	});
}

/**
 * 考勤设置
 * 
 */
function go2AttSetting() {
	var url = "../system/setting/signSetting.html";
	_App.util.goPage(url, {
		pageId: 'attSetting_id',
		refresh: true
	});
}

function go2kpi() {
	var url = "../marketing/pma/custmgr/item-query.html";
	_App.util.goPage(url, {
		pageId: 'item-query_id',
		refresh: true
	});
}

function go2rankMark() {
	var url = "../marketing/pma/custmgr/rankMark.html";
	_App.util.goPage(url, {
		pageId: 'rankMark_id',
		refresh: true
	});
}

function go2myBank() {
	var url = "../marketing/pma/custmgr/myBank.html";
	_App.util.goPage(url, {
		pageId: 'myBank_id',
		refresh: true
	});
}

function go2bonus() {
	var url = "../marketing/pma/custmgr/bonus-query.html";
	_App.util.goPage(url, {
		pageId: 'bonus-query_id',
		refresh: true
	});
}

function go2cost() {
	var url = "../marketing/pma/custmgr/cost-query.html";
	_App.util.goPage(url, {
		pageId: 'cost-query_id',
		refresh: true
	});
}

function go2employeesRank() {
	var url = "../marketing/pma/custmgr/employees-rank.html";
	_App.util.goPage(url, {
		pageId: 'employees-rank_id',
		refresh: true
	});
}

function go2costguess() {
	var url = "../marketing/pma/custmgr/cost-guess.html";
	_App.util.goPage(url, {
		pageId: 'cost-guess_id',
		refresh: true
	});
}
/**
 * 销售漏斗
 */
function go2BusOpportFunnel() {
	var url = "../marketing/tools/mktBusOpportFunnelLists.html";
	_App.util.goPage(url, {
		pageId: 'mktBusOpportFunnelLists_id',
		refresh: true
	});
}

function go2externalInfo() {
	var url = "../finding/externalInfo/externalInfo.html";
	_App.util.goPage(url, {
		pageId: 'externalInfo_id',
		refresh: true
	});
}

function go2SignSetting() {
	var url = "../work/sign/signStatistic.html";
	_App.util.goPage(url, {
		pageId: 'SignStatistic_id',
		refresh: true
	});
}

function go2barcode() {
	var url = "../system/barcode/barcode.html";
	_App.util.goPage(url, {
		pageId: 'barcode_Id',
		refresh: true
	});
}

function go2addopp() {
	var url = "../marketing/opport/addOpportunity.html?cwebviewId=" + curWebviewId;
	_App.util.goPage(url, {
		pageId: 'addOpportunity_id',
		refresh: true
	});
}

function go2addLog() {
	//	var url = "../finding/optLog/addLog.html";
	var url = "../finding/optLog/logLists.html";
	_App.util.goPage(url, {
		pageId: 'addLog_id',
		refresh: true
	});
}

function go2hdsearch() {
	//	_App.util.goPage("hdSearch.html", "none");
	mui.openWindow({
		url: "../homePage/search.html",
		id: "search-viewId",
		extras: {},
		createNew: false,
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "slide-in-right" //页面显示动画，默认为”slide-in-right“；
		},
		waiting: {
			autoShow: false, //自动显示等待框，默认为true
			title: '正在载入...' //等待对话框上显示的提示内容
		}
	});
}

function go2ChatList() {
	var url = "../reminds/chat/chatList.html";
	_App.util.goPage(url, {
		pageId: 'chatList_Id',
		refresh: true
	});
}

function myTask() {
	var url = "../reminds/makes.html";
	_App.util.goPage(url, {
		pageId: 'makes_Id',
		refresh: true
	});
}

function go2CustAdd() {
	var url = "../scan/visitingScan.html";
	_App.util.goPage(url, {
		pageId: 'visitingScan_id',
		refresh: true
	});
}

function go2apply() { //进入审批页面
	var url = "../reminds/leaveApplys.html";
	_App.util.goPage(url, {
		pageId: 'leaveApplys_id',
		refresh: true
	});
}