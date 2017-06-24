var activeId = _App.util.getUrlParamByName("activeId"); //当前节点的activeId
var nowData = ""; //_App.util.getUrlParamByName("nowData"); //整个场景的节点信息
var backPage = _App.util.getUrlParamByName("currentId"); //父页面Id   
var activityRefId = _App.util.getUrlParamByName("activityRefId"); //活动记录映射具体活动id

var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");

var needClose = _App.util.getUrlParamByName("needClose"); //需要关闭的页面
var needFlush = false; //需要刷新主界面
var finish = _App.util.getUrlParamByName("finish"); //当前节点是否完成
var div1 = document.getElementById('div1');
var addedit = document.getElementById('addedit');
var div2 = document.getElementById('div2');
var ws;
var longitude = '';
var latitude = '';
var custId;
var backPage;
var currentId;
//初始化相应信息：时间，地址
mui.plusReady(function() {

	currentId = plus.webview.currentWebview().id;
	nowData = plus.storage.getItem('nowData');
	if(nowData != null) {
		//正常进入
		var data = JSON.parse(nowData);
		showStep(data);
	} else {
		//使用ajax请求服务端，
		getSceneFlowMes();

	}
	//初始化 右上角的按钮
	if(cmap == null || cmap == undefined) {
		//已经通关

	} else if(cmap.STEP == "3" && cmap.FINISH_FLAG == "0") {
		//正在进行此关卡
		mui('.an-Box').on('tap', '.an-node.ing', function() {
			var title = document.querySelector('.mui-title').innerHTML;
			if(title != "3客户拜访") {
				plus.webview.currentWebview().reload();
			}
		});

		document.getElementById('finishId').style.display = "block";
	} //没有继续闯关

	if(finish == "1") {
		//此节点已完成,查询详情
		getNowThreeDetail(activityRefId);
	} else {
		var t = new Date();
		div1.innerHTML = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
		getUserInfo();
		var ws = plus.nativeUI.showWaiting();
		plus.geolocation.getCurrentPosition(function(p) {
				if(!p.addresses) {
					mui.alert('定位失败，请检查相关设备!', '提示', function() {
						plus.webview.currentWebview().close();
						ws.close();
					});
				} else {
					div2.innerHTML = p.address.province + p.address.district + p.address.street;
					longitude = p.coords.longitude;
					latitude = p.coords.latitude;
					ws.close();
				}

			}, function(e) {
				alert("Geolocation error: " + e.message);
				plus.webview.currentWebview().close();
			}
			//		, {
			//			provider: 'baidu'
			//		}
		);
	}

	var need = plus.webview.getWebviewById(needClose);
	if(need) {
		need.close();
	}
});
//定位：选取自身地址
function selects() {
	var s = div2.innerHTML;
};

/*
 * 保存
 */
function saveSignData() {
	if(!longitude || longitude == "undefined") {
		mui.alert("获取地址信息出错，不能保存！");
		return false;
	}
	var data_ = {};
	data_.dataAddress = document.getElementById("div2").innerHTML;
	data_.dataCustName = document.getElementById("custName").innerHTML;
	data_.dataCustNames = document.getElementById("custNames").innerHTML;
	data_.dataMemo = document.getElementById("ts").value;
	data_.longitude = longitude;
	data_.latitude = latitude;
	data_.custId = activeId;
	_App.ajax({
		type: "get",
		url: basePath + 'signCountAction!addSignCount.json',
		data: data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json;
			activityRefId = data.signId;
			needFlush = true;
			mui.fire(plus.webview.getWebviewById("scene_4_Id"), "RE_FLUSH");
			insertNextNode();
			mui("#popover").popover('toggle');
		},
		error: function(a, b, c) {
			mui.alert("签到失败");
		}
	});
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
				document.getElementById('custName').innerHTML = cust_name;
				document.getElementById('custNames').innerHTML = "13121014011";
			}
		},
		error: function() {
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
			ws.close();
			//			plus.webview.getWebviewById(backPage).reload();
			//			mui.back();
		},
		error: function() {
			ws.close();
			mui.alert('处理失败，请重试！');
		}
	});
}

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
			nowData = JSON.stringify(data);
			showStep(data);

		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

document.getElementById('finishId').addEventListener('tap', function() {
		openShade();
		saveSignData();
	})
	/*
	 * 退出
	 */
var old_back = mui.back;
mui.back = function() {
		if(needFlush) {
			plus.webview.getWebviewById("scene_4_Id").reload();

		}
		plus.webview.getWebviewById(currentId).close();
	}
	/**
	 * 通关
	 */
document.getElementById('nextLevel').addEventListener('tap', function() {
	//	var url = "scene_4.html?passId=" + passId + "&recordId=" + recordId;
	//	_App.util.goPage(url, {
	//		pageId: "scene_4_Id",
	//		refresh: true
	//	});
	plus.webview.getWebviewById('scene_4_Id').reload();
	plus.webview.getWebviewById(currentId).close();
})

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
			} else if(step == "2") {
				getNowTwoDetail(data[i].ACTIVITY_REF_IDS);
				document.getElementById('finishId').style.display = "none";
			} else if(step == "3") {
				getNowThreeDetail(data[i].ACTIVITY_REF_IDS);
				document.getElementById('finishId').style.display = "none";
			}
		}
	}
})

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