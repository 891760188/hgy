var currentUsePhoto;
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {},
	//设备资源加载完成调用
	deviceReady: function() {
		currentUsePhoto = plus.storage.getItem("_photoUrl_");
		if(!currentUsePhoto || currentUsePhoto == "undefined")
			currentUsePhoto = "../homePage/tou1.png";
		document.getElementById("slftImgId").src=currentUsePhoto;
	}
}
/**
 * 页面初始化
 */
_App.init(appConfig);

function go2signCounts() {
	var url = "../../work/sign/signCounts.html";
	_App.util.goPage(url, {
		pageId: 'signCounts_id',
		refresh: true
	});
}

function go2hdsearch(){
//	_App.util.goPage("hdSearch.html", "none");
	mui.openWindow({
		url: "../../homePage/search.html",
		id: "search-viewId",
		extras: {},
		createNew:false,
		show:{
	      autoShow: true,//页面loaded事件发生后自动显示，默认为true
	      aniShow: "slide-in-right"//页面显示动画，默认为”slide-in-right“；
	    },
		waiting:{
	      autoShow: false,//自动显示等待框，默认为true
	      title: '正在载入...'//等待对话框上显示的提示内容
	    }
	});
}

function go2barcode() {
	var url = "../../system/barcode/barcode.html";
	_App.util.goPage(url, {
		pageId: 'barcode_Id',
		refresh: true
	});
}

function go2ChatList(){
	var url = "../../my/contacts/colleagues.html";
	_App.util.goPage(url, {
		pageId: 'colleagues_Id',
		refresh: true
	});
}
/**
 * 根据场景ID，做硬转化
 * @param {Object} passId 场景ID
 * @param {Object} recordId 记录ID
 */
function go2scene(passId, recordId){
	if(1 * passId == 1) { //第一个场景
		go2mktpass(passId, recordId);
	} else if(1 * passId == 3) {
		//第3个场景
		go2mktpass3(passId, recordId);
	} else if(1 * passId == 4) {
		//第4个场景
		go2mktpass4(passId, recordId);
	}
}

/**
 * @param {Object} psceneId 过关场景ID
 * @param {Object} recordId 记录ID
 */
function go2mktpass(psceneId, recordId) {
	//跳转到场景过关界面
	var url = "passScene1_1.html?passId=" + psceneId + "&recordId=" + recordId;
	_App.util.goPage(url, {
		pageId: "passScene1_1_Id",
		refresh: true
	});
}

function go2mktpass3(psceneId,recordId){
	//跳转到场景过关界面
	var url = "passScene3/passScene3_1.html?passId="+psceneId+"&recordId="+recordId;
	_App.util.goPage(url,{
		pageId:"passScene1_3_Id",
		refresh:true
	});
}

function go2mktpass4(psceneId, recordId) {
	//跳转到场景过关界面
	var url = "scene4/scene_4.html?passId=" + psceneId + "&recordId=" + recordId;
	_App.util.goPage(url, {
		pageId: "scene_4_Id",
		refresh: true
	});
}
