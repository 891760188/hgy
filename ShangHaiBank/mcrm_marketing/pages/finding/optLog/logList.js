//常量
var MODULE_TYPE = "LOG";
var MOBILE_SYS;
var commentIdVal;
var currentViewId;
/*
 * antStorage：@功能缓存数组；去重请到后台去
 * [
 * 	{
 * 		model:'自定义模块，比如：评论，回复',
 * 		chooseType:'选择值的类型，比如：机构-ORG，人员-PEO',
 * 		chooseId:'选择值的Id：机构ID 或者 人员ID',
 * 		chooseName:'选择值的名称：机构名称 或者 人员名称',
 * 		start:'在整个字符串中的起始位置',
 * 		end:'结束位置'
 * 	}
 * ]
 */
var antStorage = [];
var chooseUserNamesStorage = ","; //过滤重名
var antInputCount = 0; //记录input变化次数
var oldAntValue, midAntValue; //缓存之前数据

//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'ocrmFMobileLogAction!getLogListDatas.json', //查询URL
		pageSize: 6, //分页大小
		scrollerId: 'pullrefresh', //mui滚动区域div的ID
		ulId: 'ulId', //ul的ID
		getCondition: function() { //获取查询条件方法
			//searchContent();//查询条件
		},
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('ulId');
			var len = data.length;
			if(len > 0) {
				var s = "";
				for(var i = 0; i < len; i++) {
					var dTmp = data[i];
					if(undefined == dTmp || null == dTmp || "" == dTmp) {
						break;
					}
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';

					var logId = dTmp.LOG_ID;
					var uId = dTmp.USER_ID;
					var cont = dTmp.LOG_CONTENT.replace(/\<br\>/g,'');
					var logDate = dTmp.LOG_DATE;
					var uName = dTmp.USER_NAME;
					var terminal = dTmp.TERMINAL;

					var supCount = dTmp.SUPPORT_COUNTS;
					var focCount = dTmp.FOCUS_COUNTS;
					var commCount = dTmp.COMM_COUNTS;
					if(!supCount)
						supCount = 0;
					if(!focCount)
						focCount = 0;
					var isSup = supCount;
					var isFoc = focCount;

					if(commCount && 1 * commCount > 0)
						s = "已点评";
					else {
						s = "未点评";
						commCount = 0;
					}

					ul.innerHTML = '<li class="mui-table-view-cell" id="li_' + logId + '" style="margin-top:-10px;">' +
						'<div>' +
						'<div class="mui-table-view-cell-top">' +
						'<div class="mtvcLeft">' +
						'<span class="mlUserPic"><img src="../../../themes/default/images/temp/pic_07.png" /></span>' +
						'<span class="mlUserInfo"><b>' + uName + '</b><i>' + logDate + '，' + terminal + '</i></span>' +
						'</div>' +
						'<div class="mtvcRight minText" id="commFlag_' + logId + '">' + s + '</div>' +
						'<span class="cl">&nbsp;</span>' +
						'</div>'

					+
					'<a class="mui-navigate-right" data-ids="' + logId + '">' +
						'<p class="darkText">' + cont.substring(0, 50) + '...</p>' +
						'</a>'

					+
					'<div class="mui-table-view-cell-bt find-button">'
					//									+'<button class="icon-share2" id="'+logId+'" data-sor="'+uName+'" data-con="'+cont+'">分享</button>'
					+
					'<button class="icon-share2 share" id="share_' + logId + '">分享</button>' +
					'<button class="icon-bubble3" data-val="' + logId + '" id="comm_' + logId + '">评论(' + commCount + ')</button>' +
						'<button class="zan icon-line-131 sup_state_'+isSup+'" data-issup="' + isSup + '" id="sup_' + logId + '">赞(' + supCount + ')</button>' +
						'<button class="hehe icon-line-133" data-issup="' + isFoc + '" id="foc_' + logId + '">关注</button>' +
						'</div>' +
						'</li>';
					table.appendChild(ul);

					if(isFoc != "0") {
						var focObj = document.getElementById("foc_" + logId);
						focObj.classList.remove('icon-line-133');
						focObj.classList.add('icon-line-1134');
						focObj.setAttribute("style", "color:orangered;border-color: orangered;");
						focObj.innerHTML = '取消';
					}
					
					if(isSup != "0"){
						var focObj = document.getElementById("sup_" + logId);
						focObj.classList.remove('icon-line-131');
						focObj.classList.add('icon-line-132');
						focObj.setAttribute("style","color:orangered;border-color: orangered;");
					}
					//					//分享
					//					document.getElementById(logId).addEventListener("tap",function(){
					//						var ids=this.getAttribute('id');
					//						var type="分享日志";
					//						var title=this.getAttribute('data-sor');
					//						var content=(this.getAttribute('data-con')).substring(0,5);
					//						_App.util.goPage("share_list.html?id="+ids+"&type="+encodeURIComponent(type)+"&title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content),{
					//							pageId:'share_list'
					//						});	
					//				   	});
					//评论
					document.getElementById('comm_' + logId).addEventListener("tap", function() {
						showPrompt1(this);
					});
					//点赞
					document.getElementById('sup_' + logId).addEventListener("tap", function() {
						var id = this.getAttribute("id");
						var lenth = id.length;
						var idTmp = id.substring(4, lenth);
						var isSup = this.getAttribute("data-issup");

						if(isSup == "0") {
							doSuppport(this, idTmp);
							this.classList.remove('icon-line-131');
							this.classList.add('icon-line-132');
							this.setAttribute("style","color:orangered;border-color: orangered;");
						} else {
							cancleSupport(this, idTmp);
							this.classList.remove('icon-line-132');
							this.classList.add('icon-line-131');
							this.setAttribute("style","");
						}
					});
					//关注
					document.getElementById('foc_' + logId).addEventListener("tap", function() {
						var id = this.getAttribute("id");
						var lenth = id.length;
						var idTmp = id.substring(4, lenth);

						var isSup = this.getAttribute("data-issup");

						if(isSup == "0") {
							doFocus(this, idTmp);
							this.classList.remove('icon-line-133');
						    this.classList.add('icon-line-1134');
						} else {
							cancleFocus(this, idTmp);
							this.classList.remove('icon-line-1134');
						    this.classList.add('icon-line-133');
						}
					});
				}
			} else {
				table.innerHTML = '<div style="margin-left: 40%;margin-top: 50%;">暂无记录！</div>';
			}
		},
		error: function() { //失败回调方法
			//			alert('error!');
		}
	},
	//ui加载完成调用
	uiReady: function() {

	},
	//设备资源加载完成调用
	deviceReady: function() {
		MOBILE_SYS = _App.sessionUser.system();
		currentViewId = plus.webview.currentWebview().id;
		var pageViewId = encodeURIComponent(currentViewId);
		var inputDiv = document.getElementById('commContent');
		var url = '../../my/contacts/colleagues.html?dataFnType=radio&pageVeiwId'; //打开选择页面的url
		_App.ant.init(inputDiv, pageViewId, url);

		//详情页面跳转
		mui('#ulId').on('tap', 'a', function() {
			var id = this.getAttribute('data-ids');
			if(undefined != id && "" != id) {
				var currWebId = plus.webview.currentWebview().id;
				currWebId = encodeURIComponent(currWebId);
				_App.util.goPage('logDetail.html?id=' + id + '&pageId=' + currWebId, {
					refresh: true,
					pageId: 'work_logDetail_html'
				});
			}
		});
		//分享
		mui('#ulId').on('tap','.mui-table-view-cell-bt>.share',function(){
			var bizId = this.getAttribute('id').replace(/[^0-9]/ig,'');
			doShare(bizId);
		});
		var pageQuery = _App.scroller;
		if(pageQuery) {
			pageQuery.loadData(true); //flag :true 下拉;false 上拉
		}
	}
};

_App.init(appConfig);

//获取选择人员数据
//window.addEventListener('chooseUserMesEvent__', function(event) {
//	if(plus.nativeUI.showWaiting()){
//		plus.nativeUI.closeWaiting();
//	}
//	act = event.detail.act;
//	chooseUserNames = decodeURIComponent(event.detail.chooseUserNames);
//	chooseUserIds = event.detail.chooseUserIds;
//	var type = event.detail.chooseType;
//	var _s = "";
//	var target = document.getElementById("commContent").innerHTML;
//	if(!chooseUserIds){
//		target=target.replace("@","");
//		console.log(target);
//	}else{
//		console.log(chooseUserNames);
//		var _b='<b contenteditable="false">'+chooseUserNames+'</b> ';
//		//添加到ant 数组中
//		target=target.replace("@",_b);
//		console.log(target);
//	}
//	//替换完后，展示
//	document.getElementById("commContent").innerHTML = target;
//});

//搜索数据
function searchContent() {
	var key = document.getElementById("keySearch").value;
	if(undefined != key && key.trim() != "") {
		var condition = {
			logContent: key
		}

		appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileLogAction!getLogListDatas.json?conditions=' + JSON.stringify(condition);
	} else {
		appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileLogAction!getLogListDatas.json'
	}

	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if(pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}

}
////详情页面跳转
//function goToDetail(id){
//	if(undefined != id && "" != id){
//		var currWebId = plus.webview.currentWebview().id;
//		currWebId = encodeURIComponent(currWebId);
//		_App.util.goPage('logDetail.html?id='+id+'&pageId='+currWebId, 
//		                  {refresh:true,pageId:'work_logDetail_html'});
//	}
//}

//显示评论面板  -- 没用到
function showPrompt(obj) {
	var id = obj.getAttribute("data-val");
	var param = {
		recordId: id,
		typeId: MODULE_TYPE,
		parentId: 0
	}
	_App.commReply.showPanel(param, commentBack);
}

//显示评论面板
function showPrompt1(obj) {
	commentIdVal = obj.getAttribute("data-val"); //指定是哪条数据的评论

	mui('#popover').popover('toggle');
}
/**
 * 评论保存方法
 */
function commentSave() {
	var commContent = document.getElementById("commContent").innerHTML;
	if(!commContent) {
		mui.alert("请输入评论内容！");
		return false;
	}
	var antArry;
	var imgList = document.getElementById('commContent').childNodes;
	for(var i = 0; i < imgList.length; i++) {
		if(imgList[i].nodeName == "IMG") {
				var chooseType = imgList[i].getAttribute('chooseType');
				var chooseId = imgList[i].getAttribute('chooseId');
				var chooseName = imgList[i].getAttribute('chooseName');
				var chooseNameTmp = chooseName.replace(/@/,"");//去掉@
				commContent = commContent.replace(/<img[^@]+/, "");//去掉@前的字符
				commContent = commContent.replace(/"[a-z>\s>]+/, "");
				antArry={
					model:"COMMENT",
					chooseType:chooseType,
					chooseId:chooseId,
					chooseName:chooseNameTmp
				};
				antStorage.push(antArry);
			}

	}
				console.log(commContent);
				
				
	var dataTmp = {
		oprType: 'COMMENT',
		commContent: commContent,
		recordId: commentIdVal,
		terminal: MOBILE_SYS,
		typeId: MODULE_TYPE,
		antDatas: JSON.stringify(antStorage)
	};
		var ws = plus.nativeUI.showWaiting();
		_App.ajax({
			type : "GET",
			url : basePath+'CommAndReplyAction!saveData.json',
			cache: false, 
			data:dataTmp,
			dataType: "json", 
			success : function(response){
				ws.close();
				mui.toast("评论成功！");
				//评论成功后
				commentIdVal="";
				document.getElementById("commContent").value = "";
				mui('#popover').popover('toggle');
				commentBack(dataTmp);
			},
			error:function(){
				ws.close();
				mui.alert('评论失败！');
			}
		});	
}

//评论回调
function commentBack(param) {
	var commId = param.recordId;
	var count;
	var commObj = document.getElementById("comm_" + commId);
	var c__ = commObj.innerText;
	if(c__.indexOf("(") != -1)
		c__ = c__.substring(c__.indexOf("(") + 1, c__.length);
	if(c__.indexOf(")") != -1)
		c__ = c__.replace(")", "");
	count = 1 * c__ + 1;
	commObj.innerText = "评论(" + count + ")";
	var commFlag = document.getElementById("commFlag_" + commId);
	commFlag.innerHTML = "已点评";
}

//点赞
function doSuppport(obj, recId) {
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.support.doSupport(param, supBack);
}

//取消点赞
function cancleSupport(obj, recId) {
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.support.cancleSupport(param, cancleSupBack);
}

//点赞回调
function supBack(param) {

	var count = param.count;
	var recId = param.recordId;
	var commObj = document.getElementById("sup_" + recId);
	commObj.className = "icon-like sup_state_1";

	commObj.innerText = "赞(" + count + ")";
	commObj.setAttribute("data-issup", "1");
}

//取消点赞回调
function cancleSupBack(param) {
	var count = param.count;
	var recId = param.recordId;

	var commObj = document.getElementById("sup_" + recId);
	commObj.className = "icon-like sup_state_0";

	commObj.innerText = "赞(" + count + ")";
	commObj.setAttribute("data-issup", "0");
}

//关注
function doFocus(obj, recId) {
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.focus.doFocus(param, focBack);
}

//取消关注
function cancleFocus(obj, recId) {
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.focus.cancleFocus(param, cancleFocBack);
}

//关注回调
function focBack(param) {
	var count = param.count;
	var recId = param.recordId;

	var focObj = document.getElementById("foc_" + recId);
	focObj.setAttribute("style", "color:orangered;border-color: orangered;");
	focObj.innerHTML = "取消";

	focObj.setAttribute("data-issup", "1");
}
//取消关注回调
function cancleFocBack(param) {
	var count = param.count;
	var recId = param.recordId;

	var focObj = document.getElementById("foc_" + recId);
	focObj.setAttribute("style", "");
	focObj.innerHTML = "关注";

	focObj.setAttribute("data-issup", "0");
}

function initLog() {
	plus.nativeUI.showWaiting("正在加载...");
	appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileLogAction!getLogListDatas.json'; //查询URL
	_App.init(appConfig);

	var pageQuery = _App.scroller;
	if(pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
	plus.nativeUI.closeWaiting();
}
/*
 * 分享
 */
function doShare(bizId) {
//			var currentId = plus.webview.currentWebview().id;
		//跳转到分享界面
		var url = "../share/share.html?cwebviewObjId="+currentViewId+"&bizType=LOG&&bizId="+bizId;
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
}