//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		url: basePath + 'mobilePersonalAction.json', //查询URL
//		url: {demoData: customerData}, 						 //本地demo数据模式
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
				var ul = document.createElement('ul');
				ul.className = 'mui-table-view mui-table-view-group';
				ul.innerHTML = 	'<li id="'+data[i].ID+'" class="mui-table-view-cell toolHover">'
								+'<a class="mui-navigate-right ys-list-cell">'
								+'<span class="ys-lcLeft1" ><b>姓名：</b><font class="fonts">'+data[i].NAME+'</font><font class="font">'+data[i].CITIZENIDRESULT+'</font></span>'
								+'<span class="ys-lcLeft1"><b>籍贯：</b>'+data[i].NATIONPLACE+'</span>'
								+'<span class="ys-lcLeft1"><b>身份证号：</b>'+data[i].CITIZENIDNUMBER+'</span>'
								+'<span class="ys-lcRight"><b>居住地：</b>'+data[i].ADDRESS+'</span>'
								+'</a>'
								+'</li>'
				table.appendChild(ul);
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
//	   	mui('#ulId').on('tap','.mui-table-view>.mui-table-view-cell',function(){
//	   		var id=this.getAttribute('id');
//			_App.util.goPage('personalData.html?id='+id, "none");
//		});
	}
};

_App.init(appConfig);

