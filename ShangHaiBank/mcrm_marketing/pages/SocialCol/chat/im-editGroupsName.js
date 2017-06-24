//获取聊天组ID
var chatRoomId = _App.util.getUrlParamByName("chatRoomId");
var chatRoomName = decodeURIComponent(_App.util.getUrlParamByName("chatRoomName"));
var backPage;
mui.plusReady(function() {
	document.getElementById("groupNameId").value = chatRoomName;
	backPage = plus.webview.getWebviewById("im-groupsView-id");
});
function saveGroupName(){
	var groupName = document.getElementById("groupNameId").value;
	if(!groupName){
		mui.alert("群聊名称不能为空");
		return false;
	}
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!saveChatRoom.json',
		data:{
			chatRoomId:chatRoomId,
			chatRoomName:groupName,
			roomtype:'2',
			actType:"edit"
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			if(!backPage){
   				mui.alert("页面还未准备好，请稍后...");
				return false;
   			}
   			mui.fire(backPage,'saveChatNameEvent__',{
			  	 chatRoomId:chatRoomId,
			  	 chatRoomName:groupName
			});
			mui.back();
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}

