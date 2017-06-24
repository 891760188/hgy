var condition; //查询条件
var distance = document.getElementById("distance"); //搜索范围
var searchContent = document.getElementById("searchContent"); //客户名称模糊查询
var detail; //map界面
var lon; //定位经度
var lat; //定位纬度
var custLon; //客户经度
var custLat; //客户纬度
var webview_style0 = {
	popGesture: "close"
};
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置
	pageInfoConfig: {
		url: basePath + 'mobileNearCustAction!selectDistances.json?conditions=' + JSON.stringify(condition), //查询URL
		//		url: {demoData: customerData}, 						 //本地demo数据模式
		pageSize: 6, //分页大小
		scrollerId: 'pullrefresh', //mui滚动区域div的ID
		ulId: 'ulId', //ul的ID
		getCondition: function() { //获取查询条件方法
			return "a=1&b=2"; //查询条件
		},
		success: function(response) { //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('ulId');
			var maps = plus.webview.getWebviewById('map-demo.html');
			for(var i = 0; i < data.length; i++) {
				var li = document.createElement('li');
				var distance = Math.round(data[i].DISTANCE * 100) / 100; //保留两位小数
				li.className = 'mui-table-view-cell toolHover';
				li.innerHTML = '<a class="ys-list-cell mui-navigate-right" data-href="' + data[i].CUST_ID + '" data-name ="' + data[i].MGR_NAME + '">' +
					'<span class="ys-lcLeft"><b>' + data[i].MGR_NAME + '</b></span>' +
					'<span class="ys-lcRMin">' + distance + '公里</span>' +
					'<span><i class="mui-icon mui-icon-location"></i>地址：' + data[i].LOCATION + '</span>' +
					'<span clas class="ys-lcLeft1"s="ys-lcLeft1"><i class="mui-icon mui-icon-person"></i>岗位：客户经理</span><br/>'
					+'<span class="ys-lcLeft1"><i class="mui-icon mui-icon-star"></i>所属支行：'+data[i].INSTITUTION_NAME+'</span>'
					//								+'<span class="ys-lcRMin">'+data[i].F_VALUE+'</span>'
					+
					'<span class="ys-lcRight" style="display:none;">' + data[i].LONGITUDE + '</span>' +
					'<span class="ys-lcRight" style="display:none;">' + data[i].LATITUDE + '</span>' +
					'</a>';
				table.appendChild(li);
			}
			var toData = JSON.stringify(data);
			var mapState = 0; //mapState根据当前table长度，来判断地图是重新加载还是继续添加点
			if(table.children.length > 6) {
				mapState = 1;
			}
			maps.evalJS('deal(' + toData + ',' + lon + ',' + lat + ',' + mapState + ')');
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
		//alert('deviceReady');
		//		var pageQuery = _App.scroller;
		//	   	if(pageQuery) {
		//	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
		//	   	}
	}
};

//_App.init(appConfig);
mui.plusReady(function() {
	detail = plus.webview.getWebviewById('map-demo.html');
	geo();
});
//符合默认条件的初始查询
function geo() {
	condition = {
		lon: "104.071962",
		lat: "30.55442",
		distance: distance.value,
		searchContent: searchContent.value
	};
	lon = "104.071962";
	lat = "30.55442";
	//加载数据
	appConfig.pageInfoConfig.url = basePath + 'mobileNearCustAction!selectDistances.json?conditions=' + JSON.stringify(condition);
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if(pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
	
	
	
	
	/*
	var wt = plus.nativeUI.showWaiting();
	plus.geolocation.getCurrentPosition(function(p) {
			if(!p.addresses) {
				mui.alert('定位失败，请检查相关设备!', '提示');
			} else {
				condition = {
					lon: "104.079292",
					lat: "30.560667",
					distance: distance.value,
					searchContent: searchContent.value
				};
				lon = "104.079292";
				lat = "30.560667";
				//加载数据
				appConfig.pageInfoConfig.url = basePath + 'mobileNearCustAction!selectDistances.json?conditions=' + JSON.stringify(condition);
				_App.init(appConfig);
				var pageQuery = _App.scroller;
				if(pageQuery) {
					pageQuery.loadData(true); //flag :true 下拉;false 上拉
					wt.close();
				}
			}
		}, function(e) {
			wt.close();
			mui.alert("Geolocation error: " + e.message);
		}
			, {
				provider: 'baidu'
			}
	);
	*/
};
mui('#ulId').on('tap', 'a', function() {
	var toName = this.getAttribute('data-name');
	//这里创建聊天组
	_App.ajax({
		type: "get",
		url: basePath + 'chat!saveChatRoom.json',
		data: {
			actType: "create",
			roomtype: '2'
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			//创建聊天组后，需要添加人员
			if(response) {
				addChatRoomMembers(response.json, toName);
			} else {
				mui.alert("创建群组失败!");
			}
		},
		error: function(a, b, c) {
			mui.alert("网络连接出错!");
		}
	});
});

function addChatRoomMembers(data, toName) {
	var accountName = plus.storage.getItem("accountName");
	if(!accountName){
			accountName = "张晶丽";
	}
	var roomId = data.roomid;
	var roomName = data.roomname;
	var roomType = data.roomtype;
	var paras = [];
	var peo = {
		roomId: roomId,
		peopleName: toName
	};
	paras.push(peo);
	peo = {
		roomId: roomId,
		peopleName: accountName
	};
	paras.push(peo);
	var data_ = {
		para: JSON.stringify(paras)
	};
	_App.ajax({
		type: "get",
		url: basePath + 'chat!addChatRoomMembers.json',
		data: data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			//跳转到聊天组界面
			var url = "../../SocialCol/chat/im-chat.html?chatRoomId=" + roomId + "&chatRoomName=" + encodeURIComponent(roomName) + "&createRoomPeo=" + accountName + "&type=" + roomType;
			_App.util.goPage(url, {
				pageId: 'im-chat-id', //viewId可以通过plus.webview.getWebviewById('view001');取到
				refresh: false //是否刷新viewId为view001的webview
			});
		},
		error: function(a, b, c) {
			mui.alert("网络连接出错!");
		}
	});
}

function goSearch() {
	_App.util.goPage('../mycustomers/search.html');
}

/*客户筛选 UI逻辑  sta*/
var _mask = mui.createMask(hideSearchSlider);
//展开所有筛选
mui('.mui-search-slider').on('tap', 'a.mui-control-item', function() {
	var _controlItem = this;
	if(_controlItem.classList.contains('mui-active')) {
		setTimeout(function() {
			_controlItem.classList.remove('mui-active');
		}, '100');
		hideSearchSlider();
		_mask.close();
	} else {
		document.querySelector(".mui-slider-group").classList.add('show');
		document.querySelector('#mss1').classList.remove('mui-tm-hasShow');
		_mask.show();
	}
});

//关闭所有筛选
function hideSearchSlider() {
	document.querySelector(".mui-slider-group").classList.remove('show');
	var _mci = document.getElementsByClassName("mui-control-item");
	for(var i = 0; i < _mci.length; i++) {
		_mci[i].classList.remove('mui-active');
	}
	//document.querySelector(".mui-backdrop").style.display='none';
};

//筛选条件恢复默认
function restore() {
	distance[2].selected = true;
}

function searchData() {
	hideSearchSlider();
	_mask.close();
	geo();
}