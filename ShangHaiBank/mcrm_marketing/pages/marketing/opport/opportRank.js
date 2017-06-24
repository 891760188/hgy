var parentwebviewid = decodeURIComponent(_App.util.getUrlParamByName("cwebviewObjId"));
var backPage;

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	
	//ui加载完成调用
	uiReady: function() {
		var data = custManaData.json.data;
			var table = document.getElementById('rankUlId');
		
			for (var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media toolHover';
				li.innerHTML = ''
								+'	<span class="rankNum">'+(parseInt(data[i].rankNum))+'</span>'
								+'	<span class="bigIco"><img src="'+data[i].rankImg+'" /></span>'
								+'	<div class="mui-media-body">'
								+'	'+data[i].rankName+''
								+'	<p class="rankSumNum" >'+data[i].rankValue+'</p>'
								+'	<p>'
								+'	部门：能源矿产事业部'								
								+'	</p>';								
				table.appendChild(li);
			}
	},
	//设备资源加载完成调用
	deviceReady: function() {
		backPage = plus.webview.getWebviewById(parentwebviewid);
	}
};

_App.init(appConfig);


var go2back = mui.back;
mui.back = function(){
	mui.fire(backPage,'refreshHPEvent__',{
	});
	plus.webview.currentWebview().close();
};
