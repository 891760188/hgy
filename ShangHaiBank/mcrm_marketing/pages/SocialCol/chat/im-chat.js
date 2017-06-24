var record = [];
var chatRoomId;
var chatRoomName;
var createRoomPeo;
var loginName;
var bindMsgList;
var start=0;
var limit=10;
var sc_;
var backPage;
var onLinetime_;
var dtask = null; 
var act_;

var chatType = _App.util.getUrlParamByName("type");//类型：1-单人（两人）聊天；2-聊天组
createRoomPeo = _App.util.getUrlParamByName("createRoomPeo");
if(1*chatType == 2){//聊天组
	chatRoomId = _App.util.getUrlParamByName("chatRoomId");
	chatRoomName = decodeURIComponent(_App.util.getUrlParamByName("chatRoomName"));
}else
	chatRoomName = decodeURIComponent(_App.util.getUrlParamByName("toUserName"));
function getServerDatas(){
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!getChatMessages.json',
		data:{
			roomId:chatRoomId,
			time:onLinetime_,
			start:start,
			limit:limit
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			if(data.length > 0){
   				start = start+limit;
   				iteratorFun(data);
   			}else{
   				mui.toast("已全部加载完成");
   			}
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}
var iteCount = 0;
function iteratorFun(data){
	if(iteCount == data.length){
		if(bindMsgList){
			bindMsgList();
		}
   		difHeight();
   		return true;
	}
	var sender_ = "";
	var content_="";
	if(data[iteCount].SENDER == loginName){
		sender_ = "self";
		content_ = data[iteCount].CONTENT;
	}else{
		sender_ = data[iteCount].SENDER;
		content_ = data[iteCount].SENDER+"："+data[iteCount].CONTENT;
	}
	var msg = {
		sender:sender_,
		type: data[iteCount].SENDTYPE,
		content: content_
	};
	if(""+msg.type != "text"&&""+msg.type != "share"){
		judFile(msg,"load","yes",data);
	}else{
		record.unshift(msg);
		iteCount++;
		iteratorFun(data);
	}
}

function difHeight(){
	var h1 = document.querySelector('#msg-list').offsetHeight;//列表的高度
   	var h2 = document.querySelector('#pullrefresh').offsetHeight;//刷新框的高度
	var dif = 0;//差值
	if(h1 >= h2){
		dif = h2 - h1;
	}
	sc_.scrollTo(0,dif);
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
function go2ManagerGroups(){
	var url = "im-groupsView.html?chatRoomId="+chatRoomId+"&chatRoomName="+encodeURIComponent(chatRoomName)+"&createRoomPeo="+createRoomPeo;
	_App.util.goPage(url, {
		pageId:'im-groupsView-id', 
		refresh: true  
	});
}
window.addEventListener('back2ImChatEvent__',function(event){
	act_ = event.detail.act;
	chatRoomId = event.detail.chatRoomId;
	chatRoomName = event.detail.chatRoomName;
	document.getElementById("muiTitleId").innerHTML = chatRoomName;
});


var oldback = mui.back;
mui.back = function(){
	if(backPage){  
		var url_ = "../marketingCircle/marketingCircle.html?closeId="+encodeURIComponent("im-chat-id|");
		_App.util.goPage(url_, {
			pageId:'marketingCircleId', 
			refresh: true   
		});
	}else{
		mui.fire(backPage,'back2MCEvent__',{
	  	 act:act_
		});
		oldback();
	}
}

function downFile(msg,type,isIterator,data){
	var surl = msg.content;
	//需要截取文件名
	var fileName = surl;
	if(surl.indexOf("/") != -1)
		fileName = surl.substring(surl.lastIndexOf("/")+1,surl.length);
	if(fileName.indexOf("：") != -1)
		fileName = fileName.split("：")[1];
	var durl = basePath+"AnnexeDownload?filename="+fileName+"&annexeName="+fileName;
	var saveLocalFile = "_doc";
	var type_ = msg.type;
	if(type_ == "sound")
		saveLocalFile += "/audio/"+fileName;
	else{
		saveLocalFile += "/"+fileName;
	}
	var options = {method:"GET",filename:saveLocalFile};
	dtask = plus.downloader.createDownload(durl, options, function ( d, status ) {
		// 下载完成
		if (status == 200) {
			if(type_ == "sound")
				msg.content = d.filename;
			else{
				var path=plus.io.convertLocalFileSystemURL(d.filename);
				path = "file://"+path;
				msg.content = path;
			}
			if(type == "load")
				record.unshift(msg);//数据装载
			else
				record.push(msg);
			if(isIterator == "yes"){//进行递归
				iteCount++;
				iteratorFun(data);
			}else{
				bindMsgList();
				difHeight();
			}
		} else {
//			alert( "Download failed: " + status ); 
		}  
	});
	//dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start(); 
}
// 暂停下载任务 
function pauseDownload() {
	dtask.pause();
}
// 取消下载任务 
function abortDownload() {
	dtask.pause();
}
//判断文件是否存在
function judFile(msg,type,isIterator,data){
	var furl = msg.content;
	//需要截取文件名
	if(furl.indexOf("/") != -1)
		furl = furl.substring(furl.lastIndexOf("/")+1,furl.length);
	if(furl.indexOf("：") != -1)
		furl = furl.split("：")[1];
	var judurl = "_doc";
	var type_ = msg.type;
	if(type_ == "sound")
		judurl += "/audio/"+furl;
	else{
		judurl += "/"+furl;
	}
	plus.io.resolveLocalFileSystemURL(judurl, function(entry ){
		if(type_ == "sound")
			msg.content = judurl;
		else{
			var path=plus.io.convertLocalFileSystemURL(judurl);
			path = "file://"+path;
			msg.content = path;
		}
		
		if(type == "load"){
			record.unshift(msg);//数据装载
		}else
			record.push(msg);
		if(isIterator == "yes"){//进行递归
			iteCount++;
			iteratorFun(data);
		}else{
			bindMsgList();
			difHeight();
		}
	}, function(error){
		//文件不存在，下载
		downFile(msg,type,isIterator,data);
	} );
}
//删除文件
function delFile(msg){
	var furl = msg.content;
	var fileName = "";
	if(furl.indexOf("/") != -1)
		fileName = furl.substring(furl.lastIndexOf("/")+1,furl.length);
	if(fileName.indexOf("：") != -1)
		fileName = fileName.split("：")[1];
	var type_ = msg.type;
	var judurl = "_doc";
	if(type_ == "sound")
		judurl += "/audio/"+fileName;
	else{
		judurl += "/"+fileName;
	}
	plus.io.resolveLocalFileSystemURL(judurl, function(entry ){
		entry.remove( function ( entry ) {
//			plus.console.log( "Remove succeeded" );
		}, function ( e ) {
//			alert( e.message );
		} );
	}, function(error){
	} );
}

