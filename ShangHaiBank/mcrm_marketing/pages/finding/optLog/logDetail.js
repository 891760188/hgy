//常量
var MODULE_TYPE="LOG";
var COMMENT_TYPE= "COMMENT";
var recordId = _App.util.getUrlParamByName("id");
var parentViewId=decodeURIComponent(_App.util.getUrlParamByName("pageId"));
var isExeFlag = false;//操作后返回判断是否需要刷新父界面
var refreshType;
var isCommType;
var MOBILE_SYS;
var commIdUseAply;
var commUserIdUseAply;
var currentViewId;
var antStorage = [];
var chooseUserNamesStorage = ",";//过滤重名
var antInputCount=0;//记录input变化次数
var oldAntValue,midAntValue;//缓存之前数据

var backPage;
function plusReady(){
	currentViewId = plus.webview.currentWebview().id;
	currentViewId = encodeURIComponent(currentViewId);
	backPage = plus.webview.getWebviewById(parentViewId);
	MOBILE_SYS = _App.sessionUser.system();
	initDetail();
    var btn = document.getElementById("comm_btn");
    //分享
	document.getElementById('shares').addEventListener("tap",function(){
		//跳转到分享界面
		plus.storage.removeItem("_shareImgPath_");
		var url = "../share/share.html?cwebviewObjId="+currentViewId+"&bizType=LOG&passId=&recordId=&bizId="+recordId+"&sign=1";
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
   	});
    //评论
	document.getElementById("commonId").addEventListener('tap',function() {
		go2Comment1();
	});
	//点赞	
   	document.getElementById("suportId").addEventListener('tap', function() {
   	    var isSup = this.getAttribute("data-issup");
		if(isSup == "0"){
			
			doSuppport(this,recordId,MODULE_TYPE);
							this.className = "icon-like icon-line-132";
							this.setAttribute("style","color:orangered;border-color: orangered;");
		}else{
			
			cancleSupport(this,recordId,MODULE_TYPE);
							this.className = "icon-like icon-line-131";
							this.setAttribute("style","");
		}

	});		
  	//关注
  	document.getElementById("focusId").addEventListener('tap', function() {
//		  		alert("关注");
        var isSup = this.getAttribute("data-issup");
        if(isSup == "0"){
			doFocus(this,recordId);
		}else{
			cancleFocus(this,recordId);
		}

	});	
	
	document.querySelector("#commContent").addEventListener('input',function(){
		//随时检索是否有@符号
		var _s = this.value;
		_s = _s.split(" ").join("</br>");
//				console.log("_s==="+_s);
//				console.log("tt_>>>>>>>"+tt_);
		if(antInputCount == 0){//开始，值一样
			midAntValue = _s;
			oldAntValue = _s;
		}else if(antInputCount == 1){//第一次变化
			midAntValue = _s;
		}else if(antInputCount > 1){//第n次变化
			oldAntValue = midAntValue;//保持了上一次的值
			midAntValue = _s;
		}
		
		
		var rmap = reloadStorage(antStorage,_s,chooseUserNamesStorage,oldAntValue);
		if(rmap){
			_s = rmap.content;
			antStorage = rmap.list;
			chooseUserNamesStorage = rmap.cunStorage;
			var oldContent = rmap.oldContent;
			if(oldContent){
				midAntValue = oldAntValue = oldContent;
			}
			_s = _s.split("</br>").join(" ");
			document.getElementById("commContent").value = _s;
			//测试用，查看下antStorage
			for(var i = 0; i < antStorage.length; i++){
				var m = antStorage[i];
			}
		}
		//必须判断是否需要选择@人员
		if(isGo2AntChoose(_s)){
			var pageViewId = encodeURIComponent(currentViewId);
			var url = "../../SocialCol/contacts/colleagues.html?dataFnType=radio&pageVeiwId=" + pageViewId;
			_App.util.goPage(url, {
				pageId: 'colleagues-id',
				refresh: true
			});
		}else{//每次都需要重新组装antStorage
			antInputCount += 1;
		}
	});
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}

//获取选择人员数据
window.addEventListener('chooseUserMesEvent__', function(event) {
	if(plus.nativeUI.showWaiting()){
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
	if(!chooseUserIds){
		_s = delAntBackNull(target);
	}else{
		//过滤重名 chooseUserNamesStorage
		var temp = ","+chooseUserNames+",";
		if(chooseUserNamesStorage.indexOf(temp) == -1){//不重名
			chooseUserNamesStorage += chooseUserNames+",";
			var repc = "[@"+chooseUserNames+"]";//"<b id='index_"+antChooseIndex+"' contenteditable='true'>@"+chooseUserNames+"</b>&nbsp;";//contenteditable='true' -- 运行删除，一个一个字符删除
			//在添加前，必须记下添加的位置
			var iof = target.indexOf("@");
			var st,ed;
			if(iof == 0 && target.length == 1){//起始就是@符号；并排除掉后面的@符号
				st = 0;
			}else{
				st = target.length-1;
			}
			ed = st+repc.length;
			//缓存选择数据
			var m = {
				model:'COMMENT',
				chooseType:type,
				chooseId:chooseUserIds,
				chooseName:chooseUserNames,
				start:st,
				end:ed
			};
			antStorage.push(m);
			_s = antCharachterFun(target,repc);
		}else{
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

//初始化详情页面
function initDetail(){
	var condition = {};//查询条件
	condition.logId = recordId;
	_App.ajax({
    	type : "get",
  		url :basePath + 'ocrmFMobileLogAction!getLogDetailById.json',
		data:condition,
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			if(data.length > 0){
				var dTmp = data[0];
				var uId = dTmp.USER_ID;
				var cont = dTmp.LOG_CONTENT;
				var logDate= dTmp.LOG_DATE;
				var title = dTmp.LOG_TITLE;
				var uName = dTmp.USER_NAME;
				var terminal = dTmp.TERMINAL;
				var shares=document.getElementById('shares');
// 					shares.setAttribute("data-issup",dTmp.LOG_ID+"&"+dTmp.USER_NAME+"&"+cont.substring(0,5));
				document.getElementById("userId").innerText = uName;
				document.getElementById("logDate").innerText = logDate+" 来自"+terminal;
				document.getElementById("logContent").innerHTML = cont;
				
   			}else{
   				mui.toast("已全部加载完成");
   			}
   			getLogExeMes();
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
};

//日志评论、关注等汇总信息
function getLogExeMes(){
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
    	type : "get",
  		url :basePath + 'ocrmFMobileLogAction!getLogExeMes.json?logId='+recordId,
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			ws.close();
   			var data = response.json.data;
   			if(data.length > 0){
   				//根据类型set界面值
   				for(var i = 0; i < data.length; i++){
   					var type = data[i].TYPES;
   					var counts = data[i].COUNTS;
// 					alert("type>>"+type+"<<counts>>"+counts);
   					if(type == "COMMENT"){
   						if(1*counts > 0){
							document.getElementById("isViewed").innerText = "日志 - 有点评";
						}else{
							document.getElementById("isViewed").innerText = "日志 - 未点评";
						}
						document.getElementById("commonId").innerText = "评论("+counts+")";
   					}else if(type == "FOCUS"){
   						var focO = document.getElementById("focusId");
		                focO.setAttribute("data-issup",counts);
		                if(1*counts > 0){
		                	focO.setAttribute("style","color:orangered;border-color: orangered;");
							focO.innerHTML = '取消';
		                }else{
		                	focO.setAttribute("style","color:#333;border-color: #ccc;");
							focO.innerHTML = '关注';
		                }
   					}else if(type == "SUPPORT"){
   						var sup = document.getElementById("suportId");
		                sup.setAttribute("data-issup",counts);
		                sup.innerHTML ='赞('+counts+') ';
		                if(1*counts > 0){
		                	sup.className = "icon-like icon-line-132";
		                	sup.setAttribute("style","color:orangered;border-color: orangered;");
		                }
   					}
   				}
   			}else{
   				document.getElementById("isViewed").innerText = "日志 - 未点评";
   				mui.toast("已全部加载完成");
   			}
			
   			getLogCommentMes();
		},
 		error:function(a,b,c){
 			ws.close();
 			mui.alert("网络连接出错!");
 		}
 	});
}

//日志评论信息
function getLogCommentMes(){
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
    	type : "get",
  		url :basePath + 'ocrmFMobileLogAction!getLogCommentMes.json?logId='+recordId,
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			ws.close();
   			var data = response.json.data;
   			if(data.length > 0){
   				document.getElementById("commentDivId").style.display="";
   				//根据类型set界面值 commentDivId
   				var html = '<h1 class="icon-circle-right">以下为点评信息：</h1>';
   				for(var i = 0; i < data.length; i++){
   					var d = data[i];
   					var time = d.CREATE_TIME;
   					var title = "";
   					var parentId = d.RECORD_ID;
   					if(parentId && 1*parentId > 0){//回复
   						title = ""+d.SEND_USER_NAME+" 回复<b style=\"color:blue\">@"+d.USER_NAME+"</b>";
   					}else{//评论
   						title = ""+d.USER_NAME;
   					}
   					html += '<p class="darkText"><span class="c1">'+title+'：</span>'+d.COMM_CONTENT+'</p>';
   					html += '<p>'+time+'，&nbsp;&nbsp;<b class="c3" onclick="replyFun(\''+d.COMM_ID+'\',\''+d.CREATE_USERID+'\',\''+d.USER_NAME+'\');">点评</b>&nbsp;&nbsp;，来自'+d.TERMINAL+'</p>';
   				}
   				document.getElementById("commentDivId").innerHTML=html;
   			}else{
   				document.getElementById("commentDivId").style.display="none";
   				mui.toast("已全部加载完成");
   			}
		},
 		error:function(a,b,c){
 			ws.close();
 			document.getElementById("commentDivId").style.display="none";
 			mui.alert("网络连接出错!");
 		}
 	});
}

function replyFun(commId,commUserId,commUserName){
	commIdUseAply = commId;
	commUserIdUseAply = commUserId;
	isCommType = "REPLY";
	mui('#popover').popover('toggle');
	document.getElementById("commContent").placeholder = "回复@"+commUserName+"：";
//	var param = {
//		recordId: recordId,
//		typeId: MODULE_TYPE,
//		oprType:'REPLY',
//		parentId:commId,
//		pUserId:commUserId,
//		pName:commUserName
//	};
//	_App.commReply.showPanel(param,commentBack);
}
//显示评论面板 -- 没用到
function go2Comment(){
	isCommType = "COMMENT";
	var param = {
		recordId: recordId,
		typeId: MODULE_TYPE
	};
	_App.commReply.showPanel(param,commentBack);
}

//显示评论面板
function go2Comment1(){
	isCommType = "COMMENT";
	mui('#popover').popover('toggle');
}

/**
 * 评论保存方法
 */
function commentSave(){
	var commContent = document.getElementById("commContent").value;
	if(!commContent){
		alert("请输入评论内容！");
		return false;
	}
	var dataTmp = {
		oprType:isCommType,
		commContent:commContent,
		recordId:recordId,
		terminal:MOBILE_SYS,
		typeId:MODULE_TYPE,
		antDatas:JSON.stringify(antStorage)
	};
	if(isCommType == "REPLY"){
		dataTmp.parentId=commIdUseAply;
		dataTmp.pUserId=commUserIdUseAply;
	}
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'CommAndReplyAction!saveData.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			ws.close();
			isExeFlag = true;
			if(isCommType == "COMMENT")
				mui.toast("评论成功！");
			if(isCommType == "REPLY")
				mui.toast("回复成功！");
			//评论成功后
			document.getElementById("commContent").value = "";
			commIdUseAply = "";
			commUserIdUseAply = "";
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
function commentBack(param){
	isExeFlag = true;
	if(isCommType == "COMMENT")
		refreshType = "commentRefresh";
	else
		refreshType = "replyRefresh";
	//刷新数据
	getLogExeMes();
}

//删除评论--暂时没做
function delCommReply(obj,recId,id){
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE,
		id:id
	}
	_App.commReply.remove(param,commentBack);
}


//关注回调
function focBack(param){
	isExeFlag = true;
	refreshType = "focusRefresh";
	var count = param.count;
	var recId = param.recordId;
	
	var focObj = document.getElementById("focusId");

		focObj.setAttribute("style","color:orangered;border-color: orangered;");
		focObj.innerHTML = "取消";

	
    focObj.setAttribute("data-issup","1");
    
//  refreshBack("foc_",recId,count,"1");
}
//取消关注回调
function cancleFocBack(param){
	isExeFlag = true;
	refreshType = "focusRefresh";
	var count = param.count;
	var recId = param.recordId;
	
	var focObj = document.getElementById("focusId");
		focObj.setAttribute("style","");
		focObj.innerHTML = "关注";
	
    focObj.setAttribute("data-issup","0");
    
//  refreshBack("foc_",recId,count,"0");
}

//初始化数据显示
function initOpr(){
	   //评论
	   document.getElementById("commonId").addEventListener('tap',function() {
//				showPrompt(this);//评论
				mui.alert("在开发");
		});	
	   //点赞	
       document.getElementById("suportId").addEventListener('tap', function() {
       	    
       	    var isSup = this.getAttribute("data-issup");
			if(isSup == "0"){
				doSuppport(this,recordId,MODULE_TYPE);
			}else{
				cancleSupport(this,recordId,MODULE_TYPE);
			}

		});		
	  //关注
	  document.getElementById("focusId").addEventListener('tap', function() {
            var isSup = this.getAttribute("data-issup");
            if(isSup == "0"){
				doFocus(this,recordId);
			}else{
				cancleFocus(this,recordId);
			}

		});	
		//分享
	  document.getElementById("shares").addEventListener('tap', function() {
            mui.alert("待开发");
//			var ids=this.getAttribute('id');
//			var type="分享日志";
//			var title=this.getAttribute('data-sor');
//			var content=(this.getAttribute('data-con')).substring(0,5);
//			_App.util.goPage("share_list.html?id="+ids+"&type="+encodeURIComponent(type)+"&title="+encodeURIComponent(title)+"&content="+encodeURIComponent(content),{
//				pageId:'share_list'
//			});
		});	
}






//点赞
function doSuppport(obj,recId,oprType){
	var param = {
		recordId: recId,
		typeId: oprType
	}
	
	if(oprType == MODULE_TYPE)
	    _App.support.doSupport(param,supBack);
	else if(oprType == COMMENT_TYPE)
	    _App.support.doSupport(param,supBackComm);
}

//取消点赞
function cancleSupport(obj,recId,oprType){
	var param = {
		recordId: recId,
		typeId: oprType
	}
	if(oprType == MODULE_TYPE)
	    _App.support.cancleSupport(param,cancleSupBack);
	else if(oprType == COMMENT_TYPE)
	    _App.support.cancleSupport(param,cancleSupBackComm);
}

//点赞回调
function supBack(param){
	isExeFlag = true;
	refreshType = "supRefresh";
	var count = param.count;
	var recId = param.recordId;
	
	var commObj = document.getElementById("suportId");
	commObj.className = "icon-like sup_state_1";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","1");
//  refreshBack("sup_",recId,count,"1");
}

//取消点赞回调
function cancleSupBack(param){
	isExeFlag = true;
	refreshType = "supRefresh";
	var count = param.count;
	var recId = param.recordId;
	
	var commObj = document.getElementById("suportId");
	commObj.className = "icon-like sup_state_0";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","0");
    
//  refreshBack("sup_",recId,count,"0");
}

//评论点赞回调
function supBackComm(param){
	var commId = param.recordId;
	var count = param.count;
	
	var commObj = document.getElementById("sup_id_"+commId);
	commObj.className = "minText icon-like mui-sup-btn-flag";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","1");
}

//评论取消点赞回调
function cancleSupBackComm(param){
	isExeFlag = true;
	refreshType = "supRefresh";
	var commId = param.recordId;
	var count = param.count;
	
	var commObj = document.getElementById("sup_id_"+commId);
	commObj.className = "minText icon-like mui-sup-btn-flag";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","0");
}

//关注
function doFocus(obj,recId){
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.focus.doFocus(param,focBack);
}

//取消关注
function cancleFocus(obj,recId){
	var param = {
		recordId: recId,
		typeId: MODULE_TYPE
	}
	_App.focus.cancleFocus(param,cancleFocBack);
}




//更新前一页面相关数据
function refreshBack(type,recId,val,opFlag){
  	  if(!backPage){
	  	mui.alert("页面还未准备好，请稍后...");
	  	return false;
	  }
	  mui.fire(backPage,'BACK_REFRESH_EVENT_',{
	    type:type,
	    val:val,
	    recId:recId,
	    flag:opFlag
	  });
}
//返回处理
var oldback = mui.back;
mui.back = function(){
	if(isExeFlag){
		if(antStorage.length > 0){//有@信息
			if(refreshType)
				refreshType = "refresh";
			else
				refreshType = "antRefresh";
		}
		mui.fire(backPage,'paramBackEvent__',{
			act:refreshType
		});
	}
	oldback();
}