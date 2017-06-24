var chatRoomId = _App.util.getUrlParamByName("chatRoomId");
var chatRoomName = decodeURIComponent(_App.util.getUrlParamByName("chatRoomName"));
var createRoomPeo = _App.util.getUrlParamByName("createRoomPeo");
var accountName;
var isEditName = false;

var backPage;
var go2MarketingCirclePage;
function plusReady(){
	accountName = plus.storage.getItem("accountName");
	backPage = plus.webview.getWebviewById("im-chat-id");
	go2MarketingCirclePage = plus.webview.getWebviewById("marketingCircleId");
	document.getElementById("groupNameId").innerHTML = chatRoomName;
	//获取成员信息
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!getChatRoomMembers.json',
		data:{
			chatRoomId:chatRoomId
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			document.getElementById("muiTitleId").innerHTML = "聊天信息("+data.length+")";
   			document.getElementById("allMembersId").innerHTML = "全部成员("+data.length+")";
   			var html_ = "";
   			if(data.length > 0){
   				for(var i = 0; i < data.length; i++){
   					var uname_ = data[i].USER_NAME;
   					if(!uname_){
   						uname_ = data[i].PEOPLENAME;
   					}
   					html_ += '<span onclick="go2PeoDetail(\''+data[i].PEOPLENAME+'\');"><i class="im-user icon-user"></i><b>'+uname_+'</b></span>';
   				}
   			}
			html_ += '<span onclick="addMember(\''+chatRoomId+'\');"><i class="im-user icon-plus"></i></span>';
			if(createRoomPeo == accountName){
				html_ += '<span onclick="minusMember(\''+chatRoomId+'\');"><i class="im-user icon-minus"></i></span>';
				document.getElementById("exeButId").innerHTML = "删除并退出";
			}else{
				document.getElementById("exeButId").innerHTML = "退出";
			}
   			document.getElementById("membersId").innerHTML = html_;
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}

function go2EditGroupName(){
	var url = "im-editGroupsName.html?chatRoomId="+chatRoomId+"&chatRoomName="+encodeURIComponent(chatRoomName);
	_App.util.goPage(url, {
		pageId:'im-editGroupsName-id', //viewId可以通过plus.webview.getWebviewById('view001');取到
		refresh: true   //是否刷新viewId为view001的webview
	});
}
window.addEventListener('saveChatNameEvent__',function(event){
	isEditName = true;
	chatRoomId = event.detail.chatRoomId;
	chatRoomName = event.detail.chatRoomName;
	document.getElementById("groupNameId").innerHTML = chatRoomName;
});

window.addEventListener('chooseLinkManEvent__',function(event){
	chatRoomId = event.detail.chatRoomId;
	chatRoomName = event.detail.chatRoomName;
	var act = event.detail.act;
	if(act == "refresh")
		plusReady();
});

window.addEventListener('minusLinkManEvent__',function(event){
	chatRoomId = event.detail.chatRoomId;
	chatRoomName = event.detail.chatRoomName;
	var act = event.detail.act;
	if(act == "refresh")
		plusReady();
});


var oldback = mui.back;
mui.back = function(){
	if(!backPage){
		mui.alert("页面还未准备好，请稍后...");
		return false;
	}
	var act = "";
	if(isEditName)
		act = "refresh";
	mui.fire(backPage,'back2ImChatEvent__',{
			  	 chatRoomId:chatRoomId,
			  	 chatRoomName:chatRoomName,
			  	 act:act
			});
	oldback();
}

function addMember(roomId){
	var url = "../contacts/chooselinkman.html?chatRoomId="+roomId+"&chatRoomName="+encodeURIComponent(chatRoomName);
	_App.util.goPage(url, {
		pageId:'im-chooselinkman-id', //viewId可以通过plus.webview.getWebviewById('view001');取到
		refresh: true   //是否刷新viewId为view001的webview
	});
}

function go2PeoDetail(accountName){
	var url = "im-UserView.html?accountName="+encodeURIComponent(accountName);
	_App.util.goPage(url, {
		pageId:'im-UserView-id', //viewId可以通过plus.webview.getWebviewById('view001');取到
		refresh: true   //是否刷新viewId为view001的webview
	});
}
function minusMember(roomId){
	var url = "../contacts/minuslinkman.html?chatRoomId="+roomId+"&chatRoomName="+encodeURIComponent(chatRoomName);
	_App.util.goPage(url, {
		pageId:'im-minuslinkman-id', 
		refresh: true   
	});
}
function exitChatRoom(){
	var btn = ["确定","取消"];
	if(createRoomPeo == accountName){//创建人直接退群，删除所有数据
		mui.confirm('该群所有记录都会清除，确认删除？','温馨提醒',btn,function(e){
		    if(e.index==0){
		    	//执行删除
		    	delChatRoom();
		    }
		});
	}else{//属个人退群
		mui.confirm('确认退群？','温馨提醒',btn,function(e){
		    if(e.index==0){
		    	//执行删除
		    	delIndividualChatRoom();
		    }
		});
	}
}
function delChatRoom(){
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!delChatRoom.json',
		data:{
			roomId:chatRoomId
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			if(!go2MarketingCirclePage){
   				var url_ = "../marketingCircle/marketingCircle.html?closeId="+encodeURIComponent("im-groupsView-id|im-chat-id");
				_App.util.goPage(url_, {
					pageId:'marketingCircleId', 
					refresh: true   
				});
			}else{
				//跳转到营销圈
	   			mui.fire(go2MarketingCirclePage,'back2MCEvent__',{
				  	act:"refresh"
				});
				plus.webview.getWebviewById("im-chat-id").close();
				plus.webview.currentWebview().close();
			}
   			
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}
function delIndividualChatRoom(){
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!delIndividualChatRoom.json',
		data:{
			roomId:chatRoomId,
			member:accountName
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			if(!go2MarketingCirclePage){
				var url_ = "../marketingCircle/marketingCircle.html?closeId="+encodeURIComponent("im-groupsView-id|im-chat-id");
				_App.util.goPage(url_, {
					pageId:'marketingCircleId', //viewId可以通过plus.webview.getWebviewById('view001');取到
					refresh: true   //是否刷新viewId为view001的webview
				});
			}else{
				//跳转到营销圈
	   			mui.fire(go2MarketingCirclePage,'back2MCEvent__',{
				  	 act:"refresh"
				});
				plus.webview.getWebviewById("im-chat-id").close();
				plus.webview.currentWebview().close();
			}
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}
