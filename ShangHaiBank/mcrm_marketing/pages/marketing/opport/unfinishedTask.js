var flag = '0';
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
					ul.innerHTML = '<li class="mui-table-view-cell"><div class="mui-slider-right mui-disabled">'
									+'<a class="mui-btn mui-btn-red" href="'+data[i].ID+'">删除</a></div><div class="mui-slider-handle">'
									+'<a class="text" href="'+data[i].ID+'">'
									+'<font color="#535150">'+arr[data[i].STATES]+data[i].TITLE+'</font>'
									+'<p>任务下达人：'+data[i].NAME+'</p>'
									+'<p id="planDoName">下达时间：'+data[i].TIMES+'</p>'
									+'</a></div></li>';
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
		//alert('deviceReady');
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
	}
};

_App.init(appConfig);

//删除任务
function delTask(id){
	var dataTmp = {};
	dataTmp.id = id;
	var btnArray = ['是', '否'];
	mui.confirm('确定要删除吗？', '提示', btnArray, function(e) {
		if (e.index == 0) {
			plus.nativeUI.showWaiting();
			_App.ajax({
				type : "post",
		  		url :basePath + 'ocrmFMobileWaitingTaskAction!delTask.json?',
				data:dataTmp,
		 		cache: false,
		   		dataType: "json",
		   		success : function(response){
		   			plus.nativeUI.closeWaiting();
		   			refreshTask();
		   		},
		 		error:function(a,b,c){
		 			plus.nativeUI.closeWaiting();
		 			mui.alert("网络连接出错!");
		 		}
			});
		}
	})
}

//删除后刷新数据
function refreshTask(){
	plus.nativeUI.showWaiting("正在加载...");
	appConfig.pageInfoConfig.url =  basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition);//查询URL
	_App.init(appConfig);
	
	var pageQuery = _App.scroller;
   	if(pageQuery) {
   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
   	}
   	plus.nativeUI.closeWaiting();
}


//返回刷新
function initTask(){
	plus.nativeUI.showWaiting("正在加载...");
	appConfig.pageInfoConfig.url =  basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition);//查询URL
	_App.init(appConfig);
	
	var pageQuery = _App.scroller;
   	if(pageQuery) {
   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
   	}
   	plus.nativeUI.closeWaiting();
}