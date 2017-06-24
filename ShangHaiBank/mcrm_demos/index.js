/**
 * 示例数据配置
 * changzh
 * 20151008
 */

//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		//url: basePath + 'mobileDemoAction.json', //查询URL
		url: {demoData: menuData}, 						 //本地demo数据模式
		pageSize: 10,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){			 //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('ulId');
			for (var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell';
				li.innerHTML = '<a class="mui-navigate-right" '
								+ ' href="'+data[i].url+'">'
								+ data[i].name
								+ '</a>'
								//+ '<button type="button" onclick="showHtml(\''+encodeURIComponent(data[i].url)+'\')" class="mui-btn mui-btn-primary">显示html</button>'
								;
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
		//alert('deviceReady');
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
	}
};


