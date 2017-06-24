var condition;
var opporStage;
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		//url: basePath + 'mobileDemoAction.json', //查询URL
		url: {}, 						 //本地demo数据模式
		pageSize: 10,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){
			//成功回调方法
			if(response){
				var data = response.json.data;
				var table = document.getElementById('ulId');
				for (var i = 0; i < data.length; i++) {
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = 	'<li class="mui-table-view-cell toolHover">'
									+'<a class="mui-navigate-right" name='+opporStage+'>'//data[i].OPPOR_ID
									+'商机名称：<font>'+data[i].OPPOR_NAME+'</font>'
									+'<p>客户名称：'+data[i].CUST_NAME+'</p>'
									+'<p>有效期：'+data[i].OPPOR_START_DATE+'到'+data[i].OPPOR_END_DATE+'</p>'
									+ '</a>'
									+'</li>'
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

//_App.init(appConfig);
function getData(id){
	opporStage = id;
	condition = {
		opporStage:opporStage
	};
	appConfig.pageInfoConfig.url = basePath + 'mktBusiOpporListSuperLinkQueryAction.json?conditions=' + JSON.stringify(condition);
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
}

//
function searchData(){
	var busiName = document.getElementById("keySearch");	
	condition={
		opporStage:opporStage,
		busiName:busiName.value
	};
	appConfig.pageInfoConfig.url = basePath + 'mktBusiOpporListSuperLinkQueryAction.json?conditions=' + JSON.stringify(condition);
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
}
