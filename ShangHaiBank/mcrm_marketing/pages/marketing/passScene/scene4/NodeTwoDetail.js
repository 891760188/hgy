var activeId = _App.util.getUrlParamByName("activeId"); //当前节点的activeId
var nowData = ""; // _App.util.getUrlParamByName("nowData"); //整个场景的节点信息   ios 传不了，使用storage
var backPage = _App.util.getUrlParamByName("currentId"); //父页面Id   
var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");

var activityRefId = _App.util.getUrlParamByName("activityRefId"); //活动记录映射具体活动id
var finish = _App.util.getUrlParamByName("finish"); //当前节点是否完成
var needClose = _App.util.getUrlParamByName("needClose"); //需要关闭的窗口

var needFlush = false; //需要刷新主页面
/***
 * 保存日程数据
 */
function saveScheduleInfo(formId) {
	var dataTmp = {};
	var schTitle = document.getElementById("schTitle").value;
	var parter = document.getElementById("parter").innerText;
	var notice = ""; //document.getElementById("notice").value;
	var addr = document.getElementById("addr").innerText;
	var isKey = document.getElementById("isKey").innerText;
	var startTime = document.getElementById("startTime").innerText;
	var endTime = document.getElementById("endTime").innerText;

	if(schTitle == null || schTitle == "undefined" || schTitle == "") {
		mui.alert("请输入日程标题！");
		return;
	}
	if(startTime == null || startTime == "undefined" || startTime == "") {
		mui.alert("请选择开始时间！");
		return;
	}
	if(endTime == null || endTime == "undefined" || endTime == "") {
		mui.alert("请输结束时间！");
		return;
	}

	if(compareDate(startTime, endTime, 1)) {
		mui.alert("结束时间不能早于开始时间！");
		return;
	}

	if(parter == null || parter == "undefined" || parter == "") {
		mui.alert("请选择参与人！");
		return;
	}
	if(addr == null || addr == "undefined" || addr == "") {
		mui.alert("请输入地址！");
		return;
	}
	plus.nativeUI.showWaiting("正在保存...");
	dataTmp.schTitle = schTitle;
	dataTmp.parter = parter;
	dataTmp.notice = notice;
	dataTmp.addr = addr;
	dataTmp.isKey = isKey;
	startTime += ":00";
	endTime += ":00";
	_App.ajax({
		type: "get",
		url: basePath + 'ScheduleAction!saveData.json?startTime=' + startTime + '&endTime=' + endTime,
		cache: false,
		data: dataTmp,
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		dataType: "json",
		success: function(response) {
			plus.nativeUI.closeWaiting();
			var data = response.json;
			activityRefId = data.schId;
			mui.toast("保存成功");
			needFlush = true;
			mui.fire(plus.webview.getWebviewById("scene_4_Id"), "RE_FLUSH");
			insertNextNode(); //插入下一节点的数据
			openShade();

		},
		error: function() {
			plus.nativeUI.closeWaiting();
			mui.alert('保存失败！');
		}
	});
};

function changeStatus() {
	var con = document.getElementById('isKey');
	var isActive = document.getElementById("switchBtnId").classList.contains("mui-active");
	if(isActive) { //默认为重要
		con.innerHTML = "1";

	} else {
		con.innerHTML = "0";
	}
}

//比较日期大小
function compareDate(startDate, endDate) {
	if(undefined != startDate && 　startDate.length > 0 &&
		undefined != endDate && endDate.length > 0) {

		var d1 = new Date(startDate.replace(/\-/g, "\/"));
		var d2 = new Date(endDate.replace(/\-/g, "\/"));

		if(d1 >= d2)
			return true;
		else
			return false;

	} else {
		mui.alert("时间不能为空!");
		return false;
	}
}
/**
 * 获取用户信息
 */
function getUserInfo() {
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data: {
			activeId: activeId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			if(data.length > 0) {
				var cust_id = data[0].CUST_ID;
				var cust_name = data[0].CUST_NAME;
				var schTitle = document.getElementById('schTitle');
				schTitle.innerHTML = "拜访" + cust_name;
				var parter = document.getElementById('parter');
				parter.innerHTML = plus.storage.getItem('_userName');

			}
		},
		error: function() {
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});
}
/**
 * 展示顶部图片中的数据
 */
var cmap; //当前进行节点的数据
function showStep(data) {
	var ps_finish_flag = "N"; //默认值
	for(var i = 0; i < data.length; i++) {
		var d = data[i];
		var step = "" + d.STEP;
		var psFinishFlag = "" + d.PS_FINISH_FLAG; //ps_finish_flag == Y -- 通关 
		var finishFlag = "" + d.FINISH_FLAG;

		if(psFinishFlag == "Y" && 1 * finishFlag == 1)
			ps_finish_flag = "Y";

		var status_css = "";
		if(finishFlag) {
			if(1 == 1 * finishFlag)
				status_css = "ed";
			else if(0 == 1 * finishFlag) {
				status_css = "ing";
				cmap = d;
			} else
				status_css = "";
		}
		var _obj_ = document.getElementById("anBoxDivId");
		var stepDivs = document.querySelector('#stepDiv').querySelectorAll('div');

		if(1 * step == 1) { //第一关
			stepDivs[0].setAttribute("class", "an-node " + status_css);
			stepDivs[0].setAttribute("style", "left: 58%;top: 83%;");
			stepDivs[0].innerHTML = "1<span>" + d.NAME + "<i></i></span>"
		} else if(1 * step == 2) { //第二关
			stepDivs[1].setAttribute("class", "an-node " + status_css);
			stepDivs[1].setAttribute('style', 'left: 45%;top: 69%;');
			stepDivs[1].innerHTML = "2<span style='left:-60px;top:-37px'>" + d.NAME + "<i style='left:50px;'></i></span>";
		} else if(1 * step == 3) { //第三关
			stepDivs[2].setAttribute("class", "an-node " + status_css);
			stepDivs[2].setAttribute('style', 'left: 50%;top: 60%;');
			stepDivs[2].innerHTML = "3<span>" + d.NAME + "<i></i></span>"
		}
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

}
/**
 * 预备下一节点的数据
 */
function insertNextNode() {
	//插入下一个record节点
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!exeFlowNode.json',
		data: {
			finishFlag: "1",
			recordId: cmap.RECORD_ID,
			flowFinishFlag: cmap.PS_FINISH_FLAG,
			step: cmap.STEP,
			//使用用户ID作为activeId
			activityId: activeId,
			activityRefId: activityRefId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			mui("#popover").popover('toggle');
			ws.close();
		},
		error: function() {
			ws.close();
			mui.alert('处理失败，请重试！');
		}
	});
}
/**
 * 获取本节点的详情(已完成此节点)
 * @param {Object} refId
 */
function getDetailByRefId(refId) {
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeTwoDetail.json?refId=' + refId,
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data[0];
			document.getElementById('startTime').innerHTML = data.START_TIME;
			document.getElementById('endTime').innerHTML = data.END_TIME;

			document.getElementById('schTitle').innerHTML = data.SCH_CONTENT;
			document.getElementById('schTitle').setAttribute('readonly', 'true')

			document.getElementById('parter').innerHTML = data.PARTER;
			document.getElementById('addr').innerHTML = data.ADDR;
			document.getElementById('switchBtnId').style.display = "none";
			if(data.IS_KEY == 1) {
				document.getElementById('switchBtnId2').innerHTML = "是";
			} else {
				document.getElementById('switchBtnId2').innerHTML = "否";
			}

		},
		error: function() {
			mui.alert('出错了！');
		}
	});
}

/*
 * 继续闯关，
 */
document.getElementById('nextPass').addEventListener('tap', function() {
	//	遍历nowData,转跳到哪一关
	var data = JSON.parse(nowData);
	for(var i = 0; i < data.length; i++) {
		if(data[i].FINISH_FLAG == "0") {
			//获取活动Id，传入下一个节点
			var activeId;
			_App.ajax({
				type: "get",
				url: basePath + 'mktSceneFourManageAction!getActiveId.json',
				data: {
					step: data[i].STEP
				},
				cache: false,
				dataType: "json",
				success: function(response) {
					activeId = response.json.data[0].ACTIVITY_ID
				},
				error: function() {
					mui.alert('处理失败，请重试！');
				}
			});
			if(data[i].STEP == "2") {
				plus.storage.removeItem('nowData');
				var url = "NodeTwoDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose" + currentId;
				_App.util.goPage(url, {
					pageId: "NodeTwoDetail_id",
					refresh: true
				});
			} else if(data[i].STEP == "3") {
				plus.storage.removeItem('nowData');
				var url = "NodeThreeDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose" + currentId;
				_App.util.goPage(url, {
					pageId: "NodeThreeDetail_id",
					refresh: true
				});
			}
			break;
		}
	}
});
/**
 * 下一关
 */
document.getElementById('nextLevel').addEventListener('tap', function() {
	plus.storage.removeItem('nowData');
	var url = "NodeThreeDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
	_App.util.goPage(url, {
		pageId: "NodeThreeDetail_id",
		refresh: true
	});
});

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
			showStep(data);
			nowData = JSON.stringify(data);

		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

/*
 * 继续闯关，
 */
document.getElementById('nextPass').addEventListener('tap', function() {
	//	遍历nowData,转跳到哪一关
	var data = JSON.parse(nowData);
	for(var i = 0; i < data.length; i++) {
		if(data[i].FINISH_FLAG == "0") {
			//获取活动Id，传入下一个节点
			var activeId;
			_App.ajax({
				type: "get",
				url: basePath + 'mktSceneFourManageAction!getActiveId.json',
				data: {
					step: data[i].STEP
				},
				cache: false,
				dataType: "json",
				success: function(response) {
					activeId = response.json.data[0].ACTIVITY_ID;
				},
				error: function() {
					mui.alert('处理失败，请重试！');
				}
			});
			if(data[i].STEP == "3") {
				plus.storage.removeItem('nowData');
				var url = "NodeThreeDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
				_App.util.goPage(url, {
					pageId: "NodeThreeDetail_id2",
					refresh: true
				});
				break;
			}
		}
	}
});
var old_back = mui.back;
mui.back = function() {
	plus.webview.getWebviewById(currentId).close();

}

/**
 * 图片详情点击
 */
mui('.an-Box').on('tap', '.an-node.ed', function() {
	var step = this.innerText.replace(/[^0-9]/ig, "");
	var data = JSON.parse(nowData);
	for(var i = 0; i < data.length; i++) {
		if(step == data[i].STEP && data[i].FINISH_FLAG == "1") {
			//可以展示详情
			if(step == "1") {
				getNowOneDetail(data[i].ACTIVITY_ID);
				document.getElementById('finishId').style.display = "none";
				document.getElementById('nextPass').style.display = "none";
				document.getElementById('nextPass2').style.display = "block";
			} else if(step == "2") {
				getNowTwoDetail(data[i].ACTIVITY_REF_IDS);
				document.getElementById('finishId').style.display = "none";
				document.getElementById('nextPass').style.display = "none";
				document.getElementById('nextPass2').style.display = "block";
			} else if(step == "3") {
				getNowThreeDetail(data[i].ACTIVITY_REF_IDS);
				document.getElementById('finishId').style.display = "none";
				document.getElementById('nextPass').style.display = "none";
				document.getElementById('nextPass2').style.display = "block";
			}
		}
	}
})

/*
 * 继续闯关  已经在当前页面了,只需要重新载入即可
 */
document.getElementById('nextPass2').addEventListener('tap', function() {
	plus.webview.currentWebview().reload();
});

function doShare() {
	//需要截屏
	_App.share.init(plus.webview.currentWebview(), function(path) {
		if(path){
			plus.storage.removeItem("_shareImgPath_");
			plus.storage.setItem("_shareImgPath_",path);
		}
		//跳转到分享界面
		var url = "../../../finding/share/share.html?cwebviewObjId="+currentId+"&bizType=SCENE&passId="+passId+"&recordId="+recordId+"&bizId=9999";
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
	},function(){
		
	});
	
}