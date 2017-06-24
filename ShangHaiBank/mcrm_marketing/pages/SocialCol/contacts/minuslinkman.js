var chatRoomId = _App.util.getUrlParamByName("chatRoomId");
var chatRoomName = decodeURIComponent(_App.util.getUrlParamByName("chatRoomName"));
var choosePeos_ = ",";
function chooseThePeos(id,name){
	var obj = document.getElementById(id);
	if(obj.classList.contains("icon-radio-checked")){
		choosePeos_ = choosePeos_.replace(","+name+"|"+id+",","");
		obj.classList.add('icon-radio-unchecked');
		obj.classList.remove('icon-radio-checked');
	}
	else{
		choosePeos_ += name+"|"+id+",";
		obj.classList.remove('icon-radio-unchecked');
		obj.classList.add('icon-radio-checked');
	}				
};

function saveChoose(){
	if(choosePeos_ == ","){//没有选择人员，不需要保存数据库
		mui.back();//关闭并不需要刷新主界面
	}else{//保存数据库
		var datas = zzDatas();
		var data_ = {para:JSON.stringify(datas)};
		_App.ajax({
    	type : "get",
  		url :basePath + 'chat!delChatRoomMembers.json',
		data:data_,
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			selectBack();
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
	}
}

function zzDatas(){
	var datas = [];
	var sp = choosePeos_.split(",");
	for(var i = 0; i < sp.length; i++){
		if(sp[i]){//有值
			var v_ = sp[i].split("|");
			var mp = {
				id:v_[1],
				roomId:chatRoomId,
				peopleName:v_[0]
			};
			datas.push(mp);
		}
	}
	return datas;
}

var backPage;
function plusReady(){
	backPage = plus.webview.getWebviewById("im-groupsView-id");
	accountName = plus.storage.getItem("accountName");
	//根据roomId获取聊天组人员信息
	getChatRoomMembers();
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
function selectBack(){
	if(!backPage){
  		alert("页面还未准备好，请稍后...");
  		return false;
  	}
	//触发详情页面的newsId事件
 	mui.fire(backPage,'minusLinkManEvent__',{
    	act:"refresh",
    	chatRoomId:chatRoomId,
    	chatRoomName:chatRoomName
  	});
  	plus.webview.currentWebview().close();
}
function getChatRoomMembers(){//需要过滤创建者
	_App.ajax({
    	type : "get",
  		url :basePath + 'chat!getChatRoomMembers.json',
		data:{
			chatRoomId:chatRoomId,
			isFilter:'true' 
		},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			var html_ = "";
   			if(data.length > 0){
   				for(var i = 0; i < data.length; i++){
   					var tagsName = data[i].PEOPLENAME;
   					var name_ = data[i].USER_NAME;;
   					if(!name_)
   						name_ = tagsName;
   					html_ += '<li data-value="ANJ" data-fn="chooseThePeos(\''+data[i].ID+'\',\''+tagsName+'\');" data-tags="AnJie" class="mui-table-view-cell mui-indexed-list-item">'+name_+'<span id="'+data[i].ID+'" class="mui-icon icon-radio-unchecked phone-right"></span></li>';
				}
   				document.getElementById("phoneCallUl").innerHTML = html_;
   			}else{
   				mui.toast("已全部加载完成");
   			}
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
}