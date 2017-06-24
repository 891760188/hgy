var pageQuery = null;
var condition = "a=1&b=2";
var closeId = decodeURIComponent(_App.util.getUrlParamByName("closeId"));
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		url: basePath + 'chat!getChatRoom.json', //查询URL
		pageSize: 50,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return condition;//查询条件
		},
		success: function(response){			 //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('ulId');
			for (var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				//javascript:go2ChatRoom(\''+data[i].ROOMID+'\',\''+data[i].CREATEPEOPLE+'\',\''+data[i].ROOMNAME+'\',\''+data[i].ROOMTYPE+'\');
//				var url_ = "../../public/chat/im-chat.html?chatRoomId="+data[i].ROOMID+"&chatRoomName="+data[i].ROOMNAME+"&createRoomPeo="+data[i].CREATEPEOPLE+"&type="+data[i].ROOMTYPE;
				li.innerHTML = '<a class="mui-navigate-right" href="../chat/im-chat.html?chatRoomId='+data[i].ROOMID+'&chatRoomName='+encodeURIComponent(data[i].ROOMNAME)+'&createRoomPeo='+data[i].CREATEPEOPLE+'&type='+data[i].ROOMTYPE+'">'
								+ '<span class="bigIco icon-bubbles3 bc3"></span>'
//								+ '<span class="bigIco icon-bubble2 bc1"></span>'
								+ '<div class="mui-media-body">'+data[i].ROOMNAME
								+ '<p class="mui-ellipsis">创建人：'+data[i].USER_NAME+'</p>'
								+ '</div>'
//								+ '<span class="mui-badge mui-badge-danger"></span>'
								+ '</a>';
				table.appendChild(li);
			}
		},
		error: function(){						//失败回调方法
			alert('error!');
		}
	},
	//ui加载完成调用
	uiReady: function() {
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
	   	var ds=plus.webview.getWebviewById('share_list');
	   	if(ds){
	   		ds.close();
	   	}
	   	mui('#ulId').on('tap', 'a', function() {
			var para = this.getAttribute('href');
			_App.util.goPage(para, {
				pageId:'im-chat-id', 
				refresh: false   
			});
		});
	}
};

_App.init(appConfig);


function go2ChatRoom(roomId,createRoomPeo,roomName,roomType){//
	var url = "../chat/im-chat.html?chatRoomId="+roomId+"&chatRoomName="+roomName+"&createRoomPeo="+createRoomPeo+"&type="+roomType;
	_App.util.goPage(url, {
		pageId:'im-chat-id', 
		refresh: false   
	});
}


window.addEventListener('back2MCEvent__',function(event){
	var act = event.detail.act;
	if(act == "refresh"){
		 _App.scroller.loadData(true)
	}
});

var oldback = mui.back;
mui.back = function(){
	if(closeId && closeId != "undefined"){//需要关闭该ID
		var closeId_ = closeId.split("|");
		for(var i = 0; i < closeId_.length; i++){
			if(closeId_[i]){
				plus.webview.getWebviewById(closeId_[i]).close();
			}
		}
	}
	//指定跳转界面
//	var url = "../found.html";
//	_App.util.goPage(url, {
//		pageId:'foundId', //viewId可以通过plus.webview.getWebviewById('view001');取到
//		refresh: false   //是否刷新viewId为view001的webview
//	});
	oldback();
}