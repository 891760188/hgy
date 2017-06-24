var activeId = _App.util.getUrlParamByName("activeId"); //当前节点的activeId
var nowData = ""; //_App.util.getUrlParamByName("nowData"); //整个场景的节点信息
var backPage = _App.util.getUrlParamByName("currentId"); //父页面Id    
var passId = _App.util.getUrlParamByName("passId");
var recordId = _App.util.getUrlParamByName("recordId");

var needFlush = false; //需要刷新主界面
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {},
	//设备资源加载完成调用
	deviceReady: function() {
		currentId = plus.webview.currentWebview().id;
		nowData = plus.storage.getItem('nowData');
		getNowOneDetail(activeId);
		showStep();
		if(cmap == null) {
			//已经通关

		} else if(cmap.STEP == "1" && cmap.FINISH_FLAG == "0") {
			//当前正在进行的是步骤一,正在闯关

			mui('.an-Box').on('tap', '.an-node.ing', function() {
				plus.webview.currentWebview().reload();
			})
			document.getElementById('finishId').style.display = "block";
		} else {
			//当前关卡已完成,详情
			document.getElementById('nextPass').style.display = "block";
			mui('.an-Box').on('tap', '.an-node.ing', function() {
				var step = this.innerText.replace(/[^0-9]/ig, "");
				if(step == "2") {
					plus.storage.removeItem('nowData');
					var url = "NodeTwoDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
					_App.util.goPage(url, {
						pageId: "NodeTwoDetail_id",
						refresh: true
					});
				} else if(step == "3") {
					plus.storage.removeItem('nowData');
					var url = "NodeThreeDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
					_App.util.goPage(url, {
						pageId: "NodeThreeDetail_id",
						refresh: true
					});
				}
			});
		}

	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

var cmap; //当前进行节点的数据
function showStep() {
	var data = JSON.parse(nowData);
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

var old_back = mui.back;
mui.back = function() {
		plus.webview.getWebviewById(currentId).close();
	}
	/*
	 * 完成监听，
	 */
document.getElementById('finishId').addEventListener('tap', function() {
	openShade();
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
			activityId: activeId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			needFlush = true;
			mui.fire(plus.webview.getWebviewById("scene_4_Id"), "RE_FLUSH");
			ws.close();
			mui("#popover").popover('toggle');
		},
		error: function() {
			ws.close();
			mui.alert('处理失败，请重试！');
		}
	});

});
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
				var url = "NodeTwoDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
				_App.util.goPage(url, {
					pageId: "NodeTwoDetail_id",
					refresh: true
				});
			} else if(data[i].STEP == "3") {
				plus.storage.removeItem('nowData');
				var url = "NodeThreeDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;
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
	var url = "NodeTwoDetail.html?passId=" + passId + "&recordId=" + recordId + "&activeId=" + activeId + "&needClose=" + currentId;;
	_App.util.goPage(url, {
		pageId: "NodeTwoDetail_id",
		refresh: true
	});
});

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
			} else if(step == "2") {
				getNowTwoDetail(data[i].ACTIVITY_REF_IDS);
			} else if(step == "3") {
				getNowThreeDetail(data[i].ACTIVITY_REF_IDS);
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