var flag = '1';
var condition = {};
condition.flag = flag;
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition), //查询URL
//		url: {demoData: makeData}, 						 //本地demo数据模式
		pageSize: 6,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){
			var data = response.json.data;
			var table = document.getElementById('ulId');
			if(data.length != 0){
				if(table.style.display=="none"){
					table.style.display="block";
				}
				table.classList.add('dark-bg');
				var arr=['<b class="tagTips icon-star-full c1 bdc1">非常紧急</b>',
				'<b class="tagTips icon-star-half c4 bdc4">紧急</b>',
				'<b class="tagTips icon-star-empty c2 bdc2">一般</b>'];
				for (var i = 0; i < data.length; i++) {
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">'
									+'<a class="mui-navigate-right" href="'+data[i].ID+'">'
									+arr[data[i].STATES]+data[i].TITLE
									+'<p>任务下达人：'+data[i].NAME+'</p>'
									+'<p id="planDoName">下达时间：'+data[i].TIMES+'</p>'
									+'</a></li>';
					table.appendChild(ul);
				}
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
	}
};
_App.init(appConfig);

var myReceive = function(){
	var approveContent = document.getElementById("keySearch1").value;
	_App.ajax({
    	type : "get",
    	url :basePath + 'ocrmFMobileWaitingTaskAction!searchJS.json?approveContent='+approveContent,
//		data:{},
   		cache: false,
// 		async: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.searchInfo.data;
   			var length = data.length;
   			document.getElementById('olId').innerHTML='';
   			var table = document.getElementById('olId');
   			
   			if(length != 0){
				if(table.style.display=="none"){
					table.style.display="block";
				}
				table.classList.add('dark-bg');
				var arr=['<b class="tagTips icon-star-full c1 bdc1">非常紧急</b>',
				'<b class="tagTips icon-star-half c4 bdc4">紧急</b>',
				'<b class="tagTips icon-star-empty c2 bdc2">一般</b>'];
				for (var i = 0; i < data.length; i++) {
					var ol = document.createElement('ul');
					ol.className = 'mui-table-view mui-table-view-group';
					ol.innerHTML = '<li class="mui-table-view-cell">'
									+'<a class="mui-navigate-right" href="'+data[i].ID+'">'
									+arr[data[i].STATES]+data[i].TITLE
									+'<p>任务下达人：'+data[i].NAME+'</p>'
									+'<p id="planDoName">下达时间：'+data[i].TIMES+'</p>'
									+'</a></li>';
					table.appendChild(ol);
				}
			}else{
				mui.toast("当前没有接收任务");
			}
   			
		},
   		error:function(a,b,c){
   			mui.toast("签到失败");
   		}
   	});
}

function searchTask1(){
	myReceive();
}
//根据任务标题进行页面查询
function searchTask(){
	var key = document.getElementById("keySearch").value;
	if(undefined != key && key.trim() != ""){	
		condition = {
			title:key
		}
		appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileWaitingTaskAction!index.json?key='+key;
//		appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition);
	}else{
		appConfig.pageInfoConfig.url = basePath + 'ocrmFMobileWaitingTaskAction.json'
	}
	
	_App.init(appConfig);
	var pageQuery = _App.scroller;
   	if(pageQuery) {
   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
   	}
}

function refreshData(){
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition), //查询URL
		data: {},
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('ulId');
			table.innerHTML = "";
			if(data.length != 0){
				if(table.style.display=="none"){
					table.style.display="block";
				}
				table.classList.add('dark-bg');
				var arr=['<b class="tagTips icon-star-full c1 bdc1">非常紧急</b>',
				'<b class="tagTips icon-star-half c4 bdc4">紧急</b>',
				'<b class="tagTips icon-star-empty c2 bdc2">一般</b>'];
				for (var i = 0; i < data.length; i++) {
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = '<li class="mui-table-view-cell">'
									+'<a class="mui-navigate-right" href="'+data[i].ID+'">'
									+arr[data[i].STATES]+data[i].TITLE
									+'<p>任务下达人：'+data[i].NAME+'</p>'
									+'<p id="planDoName">下达时间：'+data[i].TIMES+'</p>'
									+'</a></li>';
					table.appendChild(ul);
				}
			}
		},
		error: function() {
			mui.alert('加载失败！');
		}
	});
}
//function searchTask1 = function(){
//	myReceive();
//}
