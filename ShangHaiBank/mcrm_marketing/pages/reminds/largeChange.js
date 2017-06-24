
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'mobileLargeChangeAction!getData.json', //查询URL
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
				divs.innerHTML='<div class="radlcTitle">'+data[i].company+'</div>'
							+'<div class="radlcRow">涉及账号：<span>'+data[i].account+'</span></div>'
							+'<div class="radlcRow">涉及金额：<span>'+data[i].money+'</span></div>'
							+'<div class="radlcRow">进出款方向：<span>'+data[i].direction+'</span></div>'
							+'<div class="radlcRow">事件日期：<span>'+data[i].eventdate+'</span></div>'
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
