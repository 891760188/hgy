
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'mobileFinProdAction!getData.json', //查询URL
		pageSize: 6,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			//searchContent();//查询条件
		},
		success: function(response){
			var data = response.json.data;
			var table=document.getElementById('ulId');
			for(var i=0;i<data.length;i++){
				var divs=document.createElement('div');
				divs.className="radlCell";
				divs.innerHTML='<div class="radlcTitle">'+data[i].title+'</div>'
							+'<div class="radlcRow">产品期限：<span>'+data[i].timelimit+'</span></div>'
							+'<div class="radlcRow">预期收益率(年)：<span>'+data[i].yields+'</span></div>'
							+'<div class="radlcRow">收益类型：<span>'+data[i].type+'</span></div>'
							+'<div class="radlcRow">起售金额：<span>'+data[i].money+'</span></div>'
							+'<div class="radlcRow">预期收益：<span>'+data[i].profit+'</span></div>'
				table.appendChild(divs);
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
