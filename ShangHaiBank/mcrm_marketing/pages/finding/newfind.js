//常量
var MODULE_TYPE = "LOG";
var MOBILE_SYS; //手机类型
var demoData = {};
var currentViewId;
var antStorage = [];
var chooseUserNamesStorage = ","; //过滤重名
var antInputCount = 0; //记录input变化次数
var oldAntValue, midAntValue; //缓存之前数据
var supName;
var judgeMore;
var userId ;//当前登录用户Id

var loadDataArray = new Array;

//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置
	pageInfoConfig: [
		//1
		allTabConfig,
		LogConfig,
		//3
		schConfig,
		//4
		sceneConfig,
		//5
		signConfig, {
			//6
			url: {
				demoData: demoData
			}, //demo
			pageSize: 6, //分页大小
			scrollerId: 'item4mobile', //mui滚动区域div的ID 
			getCondition: function() { //获取查询条件方法
				//searchContent();//查询条件
			},
			success: function(response) {

			},
			error: function() { //失败回调方法
				//			alert('error!');
			}

		}, {
			//7
			url: {
				demoData: demoData
			}, //demo
			pageSize: 6, //分页大小
			scrollerId: 'item4mobile', //mui滚动区域div的ID 
			getCondition: function() { //获取查询条件方法
				//searchContent();//查询条件
			},
			success: function(response) {

			},
			error: function() { //失败回调方法
				//			alert('error!');
			}

		}, spConfig,
		//9
		oppConfig,
		//10
		yejiConfig,
		//11
		GgConfig, 
		xtyxConfig, 
		khzjConfig
	],
	//ui加载完成调用
	uiReady: function() {

	},
	//设备资源加载完成调用
	deviceReady: function() {
		//初始化变量
		userId = plus.storage.getItem('_userId');
		//计算每个subPage的高度
		var _top = _androidSUBHeight.replace(/[^0-9]/ig, "");
		var _h = plus.screen.resolutionHeight - 49 - 38 - _top - 25;
		var cont = document.querySelectorAll('.mui-control-content');
		for(var i = 0; i < cont.length; i++) {
			cont[i].setAttribute('style', 'height: ' + _h + 'px;')
		}
		
		//监听评论输入@，弹出通讯录
		mui('#popover').on('input', '#commContent', function() {
			//随时检索是否有@符号
			var _s = this.value;
			_s = _s.split(" ").join("</br>");
			//				console.log("_s==="+_s);
			//				console.log("tt_>>>>>>>"+tt_);
			if(antInputCount == 0) { //开始，值一样
				midAntValue = _s;
				oldAntValue = _s;
			} else if(antInputCount == 1) { //第一次变化
				midAntValue = _s;
			} else if(antInputCount > 1) { //第n次变化
				oldAntValue = midAntValue; //保持了上一次的值
				midAntValue = _s;
			}

			var rmap = reloadStorage(antStorage, _s, chooseUserNamesStorage, oldAntValue);
			if(rmap) {
				_s = rmap.content;
				antStorage = rmap.list;
				chooseUserNamesStorage = rmap.cunStorage;
				var oldContent = rmap.oldContent;
				if(oldContent) {
					midAntValue = oldAntValue = oldContent;
				}
				_s = _s.split("</br>").join(" ");
				document.getElementById("commContent").value = _s;
				//测试用，查看下antStorage
				for(var i = 0; i < antStorage.length; i++) {
					var m = antStorage[i];
				}
			}
			//必须判断是否需要选择@人员
			if(isGo2AntChoose(_s)) {
				var pageViewId = encodeURIComponent(currentViewId);
				var url = "../SocialCol/contacts/colleagues.html?dataFnType=radio&pageVeiwId=" + pageViewId;
				_App.util.goPage(url, {
					pageId: 'colleagues-id',
					refresh: true
				});
			} else { //每次都需要重新组装antStorage
				antInputCount += 1;
			}
		});
		
		//加载数据监听，每个子页签 只会加载一次
		mui("#myScroll").on('tap', '.mui-control-item', function() {
			//去除调所有的mui-active
			var list = document.querySelectorAll('.mui-active');
			for(var i = 0; i < list.length; i++) {
				list[i].classList.remove('mui-active');
			}
			//按钮附上样式
			this.classList.add('mui-active');
			
			var href = this.getAttribute('href')
			document.querySelector(href).classList.add('mui-active');
			var flag = loadDataArray.indexOf(href);
			//是否需要加载数据，如果已经在数组中则证明已经加载，不要再加载。
			if(flag < 0) {
				var ws = plus.nativeUI.showWaiting();
				//不在数组中，没有初始化
				var id = href.replace(/[^0-9]/ig, "");
				id = id - 1;
				_App.pullToRefreshFactory.scrollers[id].loadData(true);
				loadDataArray.push(href);
				ws.close();
			}
		});
		
		
		
		MOBILE_SYS = _App.sessionUser.system(); //手机类型
		currentViewId = plus.webview.currentWebview().id;
		OpenDB();
		createArticle();
		createArticleApp(userId);
		createArticleDefault();
		//第一次加载工作圈，加载全部页签中的数据
		if(loadDataArray.length == 0) {
			_App.pullToRefreshFactory.scrollers[0].loadData(true);
			loadDataArray.push("#item1mobile");
		}
		//显示设置的页签
		queryArticle(userId, function(list) {
			var _html = '<a class="mui-control-item mui-active" id="allTab" href="#item1mobile">全部</a>';
			var scroll = document.getElementById('myScroll');
			for(var i = 0; i < list.length; i++) {
				var m = list[i].ID + 1;
				_html += '<a class="mui-control-item" id="' + list[i].ARTICLE + '" href="#item' + m + 'mobile">' + list[i].ARTICLE_NAME + '</a>'
			}
			scroll.innerHTML = _html;
		});

		//获取所有标题 包括设置的和没有设置的
		getArticle(userId, function(list) {
			var _html1 = "";
			var _html2 = "";
			for(var i = 0; i < list.length; i++) {
				if(list[i].STATUS == "1") {
					_html1 += "<span data-id='" + list[i].ARTICLE_ID + "'>" + list[i].ARTICLE_NAME + "<i>x</i><b>+</b></span>";
				} else if(list[i].STATUS == "0") {
					_html2 += "<span data-id='" + list[i].ARTICLE_ID + "'>" + list[i].ARTICLE_NAME + "<i>x</i><b>+</b></span>";
				}
			}
			_html1 += "<p>请从更多分类中选择！</p>";
			_html2 += "<p>没有更多分类…</p>";
			document.getElementById('myTags').innerHTML = _html1;
			document.getElementById('moreTags').innerHTML = _html2;
		});
	}

};
/**
 * 页面初始化
 */
_App.init(appConfig);

//————————————————————————————————————————————————————————————全部评论点赞关注
//点赞
function doSuppport(biz_type, recId) {
	var param = {
		recordId: recId,
		typeId: biz_type
	}
	_App.support.doSupport(param, supBack);
}

//取消点赞
function cancleSupport(biz_type, recId) {
	var param = {
		recordId: recId,
		typeId: biz_type
	}
	_App.support.cancleSupport(param, cancleSupBack);
}

//点赞回调
function supBack(param) {
	var count = param.count;
	var recId = param.recordId;
	var bizType = param.typeId;
	var e = document.getElementById('sup_'+recId);
	if(e){
		supNameAdd(recId, bizType,e);
		var commObj = e;
		commObj.className = "icon-line-132 iconBlue";
		commObj.setAttribute("data-issup", "1");
		
	}
	//全部
	e = document.getElementById('allSup_'+recId);
	if(e){
		supNameAdd(recId, bizType,e);
		var commObj = e;
		commObj.className = "icon-line-132 iconBlue";
		commObj.setAttribute("data-issup", "1");
	}
	

}

//取消点赞回调
function cancleSupBack(param) {
	var count = param.count;
	var recId = param.recordId;
	var bizType = param.typeId;
	//子页签
	var e = document.getElementById('sup_'+recId);
	if(e){
		var commObj = e;
		supNameDelete(recId, bizType,e);
		commObj.className = "icon-line-131";
		//		commObj.innerText = "赞";
		commObj.setAttribute("data-issup", "0");	
	}
	
	
	//全部
	e=document.getElementById('allSup_'+recId);
	if(e){
		var commObj = e;
		supNameDelete(recId, bizType,e);
		commObj.className = "icon-line-131";
		//		commObj.innerText = "赞";
		commObj.setAttribute("data-issup", "0");
	}
}

//关注
function doFocus(biz_type, recId) {
	var param = {
		recordId: recId,
		typeId: biz_type
	}
	_App.focus.doFocus(param, focBack);
}

//取消关注
function cancleFocus(biz_type, recId) {
	var param = {
		recordId: recId,
		typeId: biz_type
	}
	_App.focus.cancleFocus(param, cancleFocBack);
}

//关注回调
function focBack(param) {
	var count = param.count;
	var recId = param.recordId;

	var focObjs = document.querySelectorAll("#foc_" + recId);
	for(var i = 0; i < focObjs.length; i++) {
		var focObj = focObjs[i];
		focObj.className = "icon-line-1134 iconBlue";
		focObj.innerHTML = "取消";
		focObj.setAttribute("data-isFocus", "1");
	}

}
//取消关注回调
function cancleFocBack(param) {
	var count = param.count;
	var recId = param.recordId;

	var focObjs = document.querySelectorAll("#foc_" + recId);
	for(var i = 0; i < focObjs.length; i++) {
		var focObj = focObjs[i];
		focObj.className = "icon-line-133";
		focObj.innerHTML = "关注";

		focObj.setAttribute("data-isFocus", "0");
	}

}

//懒加载图片
function lazyLoad(that) {
	var thisSrc = that.getAttribute("data-src");
	_App.share.doDownloadPic(that, thisSrc, that.src);
}

//点赞
function doSupport(biz_type, biz_id, flag) {
	var sup = document.getElementById('sup_' + biz_id);
	var flag = sup.getAttribute('data-issup');
	if(flag == 0) {
		//当前用户还没有点赞
		doSuppport(biz_type, biz_id);
	} else {
		//当前用户已经点赞
		cancleSupport(biz_type, biz_id);
	}
}

//关注
function focusDetail(biz_type, biz_id) {
	var focus = document.getElementById('foc_' + biz_id);
	var flag = focus.getAttribute('data-isFocus');
	if(flag == 0) {
		//当前用户还没有点赞
		doFocus(biz_type, biz_id);
	} else {
		//当前用户已经点赞
		cancleFocus(biz_type, biz_id);
	}

}

/**
 * 评论保存方法
 */
function commentSave(biz_type, recordId) {
	var isCommType = "COMMENT";
	var commContent = document.getElementById("commContent").value;
	if(!commContent) {
		alert("请输入评论内容！");
		return false;
	}
	var dataTmp = {
		oprType: isCommType,
		commContent: commContent,
		recordId: recordId,
		terminal: MOBILE_SYS,
		typeId: biz_type,
		antDatas: JSON.stringify(antStorage)
	};
	var ws = plus.nativeUI.showWaiting();
	if(biz_type == 'LOG') {

	}
	_App.ajax({
		type: "GET",
		url: basePath + 'CommAndReplyAction!saveData.json',
		cache: false,
		data: dataTmp,
		dataType: "json",
		success: function(response) {
			var comm = response.comm;
			ws.close();
			isExeFlag = true;
			mui.toast("评论成功！");
			//评论成功后
			document.getElementById("commContent").value = "";
			mui('#popover').popover('toggle');
			commentBack(dataTmp, commContent,comm);
		},
		error: function() {
			ws.close();
			mui.alert('评论失败！');
		}
	});
}

//评论回调
function commentBack(param, commContent,data) {
	var biz_id = param.recordId;
	var comm = document.getElementById('comm_' + biz_id);
	var comDiv = document.getElementById('lessCom_' + biz_id);
	if(comDiv){
		var scr = comDiv.parentNode.parentNode.parentNode.parentNode.parentNode;
		var href = scr.id;
			var id = href.replace(/[^0-9]/ig, "");
				id = id - 1;
			_App.pullToRefreshFactory.scrollers[id].loadData(true);
	}
	_App.pullToRefreshFactory.scrollers[0].loadData(true);
}
//------------------------------------------------------------------------------------与@相关---------------------------------------------------------------------------------------------------------
/**
 * 打开评论div
 * 
 */
function openComment(biz_type, biz_id) {
	mui('#popover').popover('toggle');
	//评论监听
	mui('#popover').off('tap', '#commContentButId');
	mui('#popover').on('tap', '#commContentButId', function() {
			commentSave(biz_type, biz_id);
		})
		/**
		 * 监听@
		 */
		//		mui('#commContent').off('tap','#commContent');
		//		document.getElementById('commContent').addEventListener('input', function() {

}

//获取选择人员数据
window.addEventListener('chooseUserMesEvent__', function(event) {
	if(plus.nativeUI.showWaiting()) {
		plus.nativeUI.closeWaiting();
	}
	act = event.detail.act;
	chooseUserNames = decodeURIComponent(event.detail.chooseUserNames);
	chooseUserIds = event.detail.chooseUserIds;
	var type = event.detail.chooseType;
	var _s = "";
	//目标字符串
	var target = document.getElementById("commContent").value;
	target = target.split(" ").join("</br>");
	//如果没有选择，需要去掉@符号
	if(!chooseUserIds) {
		_s = delAntBackNull(target);
	} else {
		//过滤重名 chooseUserNamesStorage
		var temp = "," + chooseUserNames + ",";
		if(chooseUserNamesStorage.indexOf(temp) == -1) { //不重名
			chooseUserNamesStorage += chooseUserNames + ",";
			var repc = "[@" + chooseUserNames + "]"; //"<b id='index_"+antChooseIndex+"' contenteditable='true'>@"+chooseUserNames+"</b>&nbsp;";//contenteditable='true' -- 运行删除，一个一个字符删除
			//在添加前，必须记下添加的位置
			var iof = target.indexOf("@");
			var st, ed;
			if(iof == 0 && target.length == 1) { //起始就是@符号；并排除掉后面的@符号
				st = 0;
			} else {
				st = target.length - 1;
			}
			ed = st + repc.length;
			//缓存选择数据
			var m = {
				model: 'COMMENT',
				chooseType: type,
				chooseId: chooseUserIds,
				chooseName: chooseUserNames,
				start: st,
				end: ed
			};
			antStorage.push(m);
			_s = antCharachterFun(target, repc);
		} else {
			_s = delAntBackNull(target);
			mui.toast("已选择！");
		}

		midAntValue = _s;
		oldAntValue = _s;
		antInputCount += 1;
	}
	//替换完后，展示
	_s = _s.split("</br>").join(" ");
	document.getElementById("commContent").value = _s;
});
