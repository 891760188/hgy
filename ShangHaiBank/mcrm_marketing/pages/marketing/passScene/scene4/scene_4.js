var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");
var nowData; //记录当前场景走在当前节点的所有节点信息
var currentId; //当前页面Id
var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {},
	//设备资源加载完成调用
	deviceReady: function() {
		currentId = plus.webview.currentWebview().id;
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
			nowData = data;
			showSceneFlowMes(data);
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}
var cmap; //当前关流程信息
function showSceneFlowMes(data) {
	var ps_finish_flag = "N";
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
				//需要加载当前关的信息
				cmap = d;
			} else
				status_css = "";
		}
		var _obj_ = document.getElementById("anBoxDivId");
		var div_str = document.createElement("div");
		if(1 * step == 1) { //第一关
			div_str.className = 'an-node ' + status_css + '';
			div_str.setAttribute("style", "left: 58%;top: 83%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + finishFlag + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "1<span>" + d.NAME + "<i></i></span>";
		} else if(1 * step == 2) { //第二关
			div_str.className = 'an-node ' + status_css + '';
			div_str.setAttribute("style", "left: 45%;top: 69%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + finishFlag + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "2<span style='left:-60px;top:-37px'>" + d.NAME + "<i style='left:50px;'></i></span>";
		} else if(1 * step == 3) { //第三关
			div_str.className = 'an-node ' + status_css + '';
			div_str.setAttribute("style", "left: 50%;top: 60%;");
			div_str.setAttribute("data-info", '' + d.RECORD_ID + ',' + d.STEP + ',' + d.PASS_ID + ',' + d.P_NODE_ID + ',' + d.ACTIVITY_ID + ',' + d.PS_FINISH_FLAG + ',' + finishFlag + ',' + d.ACTIVITY_REF_IDS + '');
			div_str.innerHTML = "3<span>" + d.NAME + "<i></i></span>";
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
		m.FINISH = di[6];
		m.ACTIVITY_REF_IDS = di[7];
		loadCurrentSceneData(m);
	});
	loadCurrentSceneData(cmap);
}

function loadCurrentSceneData(data) {
	if(!data) {
		//说明已经通过
		var html = '<h1><b>已通关</b><i>已通关</i></h1>';
		html += '<div style="color: #ff713c;text-align: center;line-height: 90px;margin-right:0px;font-size:18px">恭喜你，通关了！</div>';
		document.getElementById("anNodeInfoDivId").innerHTML = html;
		return;
	}
	var step = "" + data.STEP;
	if(1 * step == 1) { //第一关
		getSceneOneStepMes(data);
	} else if(1 * step == 2) { //第二关
		//场景4主页面 中展示第二个节点详情
		sceneNodeTwoDetail(data); //也需要查询出第一个节点活动的部分详情
	} else if(1 * step == 3) { //第三关
		sceneNodeThreeDetail(data);
	}

}

function sceneNodeThreeDetail(data_) {
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data: {
			activeId: data_.ACTIVITY_ID
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var title = "";
			var detailText = "";
			if(data_.FINISH == "1") {
				//已完成
				title = "已通过";
				detailText="<button id='go2Detail'>详情</button>";
//				detailText = '<img src="../xq.png" class="xqPng"></img>';
			} else {
				title = "正在进行";
				//				detailText="过关"
				detailText = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';
			}
			var data = response.json.data[0];
			if(!data) {
				return;
			}
			var html = "";
			html += '<h1><b>第3关：客户拜访</b><i>' + title + '</i></h1>';
			html += '<div><p>' + data.CUST_NAME + '</p>';
			html += '<p>电话:13121014011</p>';
			html += '<p>地址:四川省武侯区天府大道中段辅路</p>'
			html += '</div>' + detailText ;
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			mui("#anNodeInfoDivId").off('tap','#go2Detail');
			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
				var d = JSON.stringify(nowData);
				plus.storage.setItem("nowData", d);
				var url = "NodeThreeDetail.html?activeId=" + data_.ACTIVITY_ID + "&currentId=" + currentId + "&finish=" + data_.FINISH + "&activityRefId=" + data_.ACTIVITY_REF_IDS + "&passId=" + passId + "&recordId=" + recordId;
				_App.util.goPage(url, {
					pageId: "NodeThreeDetail_id",
					refresh: true
				});
			});
		},
		error: function() {
			ws.close();
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});
}
/**
 * 进入第二个节点
 * @param {Object} 当前节点的activeID
 */
function sceneNodeTwoDetail(data_) {
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data: {
			activeId: data_.ACTIVITY_ID
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var title = "";
			var detailText = "";
			if(data_.FINISH == "1") {
				//已完成
				title = "已通过";
				detailText="<button id='go2Detail'>详情</button>";
//				detailText = '<img src="../xq.png" class="xqPng"></img>';
			} else {
				title = "正在进行";
				//				detailText="过关"
				detailText = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';
			}
			var data = response.json.data[0];
			var html = "";
			html += '<h1><b>第2关：日程安排</b><i>' + title + '</i></h1>';
			html += '<div><p>' + data.CUST_NAME + '</p>';
			html += '<p>电话:13121014011</p>';
			html += '<p>地址:四川省武侯区天府大道中段辅路</p>'
			html += '</div>' + detailText;
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			mui("#anNodeInfoDivId").off('tap','#go2Detail');
			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
				var d = JSON.stringify(nowData);
				plus.storage.setItem("nowData", d);
				var url = "NodeTwoDetail.html?activeId=" + data_.ACTIVITY_ID + "&currentId=" + currentId + "&finish=" + data_.FINISH + "&activityRefId=" + data_.ACTIVITY_REF_IDS + "&passId=" + passId + "&recordId=" + recordId;
				_App.util.goPage(url, {
					pageId: "NodeTwoDetail_id",
					refresh: true
				});
			});
		},
		error: function() {
			ws.close();
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});

}
/**
 * 场景主页面的 bottom信息
 * @param {Object} data_
 */
function getSceneOneStepMes(data_) {
	//	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data: {
			activeId: data_.ACTIVITY_ID
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var title = "";
			var detailText = "";
			if(data_.FINISH == "1") {
				//已完成
				title = "已通过";
				detailText="<button id='go2Detail'>详情</button>";
//				detailText = '<img src="../xq.png" class="xqPng"></img>';
			} else {
				title = "正在进行";
				//				detailText="过关"
				detailText = '<div id="go2Detail"><img src="../tg.png" class="tgPng"></img></div>';
			}
			var data = response.json.data[0];
			var name = data.CUST_NAME;
			var birth = "7月20日";
			var addr = "四川省武侯区天府大道中段辅路";
			var html = '<h1><b>第1关：客户信息查看</b><i>' + title + '</i></h1>';
			html += '<div><p>' + name + '</p>';
			html += '<p>生日：' + birth + '</p>';
			html += '<p>地址：' + addr + '</p>';
			html += '</div>' + detailText;
			document.getElementById("anNodeInfoDivId").innerHTML = html;
			//绑定button onclick事件
			mui("#anNodeInfoDivId").off('tap','#go2Detail'); //绑定之前先取消之前绑定的事件
			mui("#anNodeInfoDivId").on('tap', '#go2Detail', function() {
				go2sceneOneDetail(data_);
			});
		},
		error: function() {
			ws.close();
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});
}

/*
 * 进入第一个节点
 */
function go2sceneOneDetail(data) {
	var d = JSON.stringify(nowData);
	plus.storage.setItem("nowData", d);
	var url = "NodeDetail.html?activeId=" + data.ACTIVITY_ID + "&currentId=" + currentId + "&passId=" + passId + "&recordId=" + recordId;
	_App.util.goPage(url, {
		pageId: "NodeOne_id",
		refresh: true
	});
}

//绑定返回刷新事件
window.addEventListener("BACKFRESH", function(event) {
	getSceneFlowMes();
});

window.addEventListener('RE_FLUSH', function() {
	getSceneFlowMes();

})


var go2back = mui.back;
mui.back = function(){
	mui.fire(backPage,'refreshHPEvent__',{
	});
	plus.webview.currentWebview().close();
};


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