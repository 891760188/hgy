demoData1 = {
	"json": {
		data: [{
			company: "广西航桂实业有限公司",
			birthday: "1964-07-23",
			manager: "许家印（董事长）",
			day: "3"
		}, {
			company: "南通金庭能源有限公司",
			birthday: "1960-08-1",
			manager: "张极芳（财务总监）",
			day: "12"
		}, {
			company: "山东京博石油化工有限公司",
			birthday: "1964-08-5",
			manager: "张爱挺 （董事长）",
			day: "16"
		}, {
			company: "宜兴市意达铜业有限公司",
			birthday: "1964-08-6",
			manager: "王珂（财务总监）",
			day: "17"
		}, {
			company: "云南省能源投资集团有限公司",
			birthday: "1964-07-21",
			manager: "许名（董事长）",
			day: "1"
		}, {
			company: "东兆长泰投资集团有限公司",
			birthday: "1964-07-25",
			manager: "王充（财务总监）",
			day: "5"
		}, {
			company: "济南华诚冶金材料有限公司",
			birthday: "1964-07-26",
			manager: "罗嘉华（董事长）",
			day: "6"
		}, {
			company: "浙江大树置业股份有限公司",
			birthday: "1964-07-27",
			manager: "李代（财务总监）",
			day: "7"
		}]
	}
}

//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置 
	pageInfoConfig: {
				url: basePath + 'mobileMessagesBirthdayAction!getData.json', //查询URL
//		url: {
//			demoData: demoData1
//		},
		pageSize: 6, //分页大小
		scrollerId: 'pullrefresh', //mui滚动区域div的ID
		ulId: 'ulId', //ul的ID
		getCondition: function() { //获取查询条件方法
			//searchContent();//查询条件
		},
		success: function(response) {
			var data = response.json.data;
			var table = document.getElementById('ulId');
			for(var i = 0; i < data.length; i++) {
				var divs = document.createElement('li');
				divs.className = "mui-table-view-cell mui-tvcown mui-tvctwo";
				divs.innerHTML = '<b>' + data[i].company + '</b>' +
					'<span>生日：' + data[i].birthday + '</span>' +
					'<span>' + data[i].manager + '</span>' +
					'<span>还有 <i>' + data[i].day + '</i>天</span>'
				table.appendChild(divs);
			}
		},
		error: function() { //失败回调方法
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
			pageQuery.loadData(true); //flag :true 下拉;false 上拉
		}

	}
};

_App.init(appConfig);