//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置
	pageInfoConfig: [{
		url: basePath + 'mobileMessagesExpireAction!getLoanData.json', //查询URL
		//		url: {demoData: demoData1}, 						 //本地demo数据模式
		pageSize: 4, //分页大小
		scrollerId: 'item1mobile', //mui滚动区域div的ID
		getCondition: function() { //获取查询条件方法
			return "a=1&b=2"; //查询条件
		},
		success: function(response) { //成功回调方法
			var data=response.json.data;
			var table=document.getElementById('list1');
			for(var i=0;i<data.length;i++){
				var divs=document.createElement('div');
				divs.className="radlCell";
				divs.innerHTML='<div class="radlcTitle">'+data[i].company+'</div>'
							+'<div class="radlcRow">贷款金额：<span>'+data[i].money+'</span></div>'
							+'<div class="radlcRow">到期日期：<span>'+data[i].expiredate+'</span></div>'
				table.appendChild(divs);
			}
		},
		error: function() { //失败回调方法
			//alert('error!');
		}
	},{
		url: basePath + 'mobileMessagesExpireAction!getDepositData.json', //查询URL
		//		url: {demoData: demoData1}, 						 //本地demo数据模式
		pageSize: 6, //分页大小
		scrollerId: 'item2mobile', //mui滚动区域div的ID
		getCondition: function() { //获取查询条件方法
			return "a=1&b=2"; //查询条件
		},
		success: function(response) { //成功回调方法
			var data=response.json.data;
			var table=document.getElementById('list2');
			for(var i=0;i<data.length;i++){
				var divs=document.createElement('div');
				divs.className="radlCell";
				divs.innerHTML='<div class="radlcTitle">'+data[i].company+'</div>'
							+'<div class="radlcRow">存款金额：<span>'+data[i].money+'</span></div>'
							+'<div class="radlcRow">期限（月）：<span>'+data[i].term+'</span></div>'
							+'<div class="radlcRow">到期日期：<span>'+data[i].expiredate+'</span></div>'
				table.appendChild(divs);
			}
		},
		error: function() { //失败回调方法
			//alert('error!');
		}
	}],
	//ui加载完成调用
	uiReady: function() {

	},
	//设备资源加载完成调用
	deviceReady: function() {

		_App.pullToRefreshFactory.scrollers[0].loadData(true);
		document.getElementById('slider').addEventListener('slide', function(e) {
					if (e.detail.slideNumber === 1) {
						if (document.getElementById('list2').children[0].classList.contains('mui-loading')) {
							_App.pullToRefreshFactory.scrollers[1].loadData(true);
						}
					}
				});
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);


