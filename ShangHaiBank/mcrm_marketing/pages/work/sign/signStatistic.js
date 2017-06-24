var sign_select1=document.getElementById('sign_select1');//开始时间
var sign_select2=document.getElementById('sign_select2');//结束时间
var urlId;//当前we
var longitude;//经度
var latitude;//纬度
var addr;//地址
var isLocate=false;
var condition = {};//查询条件
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'signCountAction.json', //查询URL
		pageSize: 6,							 //分页大小
		scrollerId: 'item2mobile',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			
		},
		success: function(response){
			var data = response.json.data;
			var table = document.getElementById('ulId');
			var maps=plus.webview.getWebviewById('signMap.html');
			var len = data.length;
			if(len > 0){
				for (var i = 0; i < len; i++) {
					
					var dTmp = data[i];
					if(undefined == dTmp || null == dTmp || "" == dTmp){
						break;
					}
					var _c;
//					if(data[i].TYPE=="个人"){
//						_c=1;
//					}else if(data[i].TYPE=="企业"){
//						_c=2;
//					}
					var _f;
					var div = document.createElement('div');
					div.className = 'date-Cell';
					var custName = dTmp.CUST_NAME;
					var custNames = dTmp.CUST_NAMES;
					var signAddress = dTmp.SIGN_ADDRESS;
					var signTime = dTmp.SIGN_TIME;//签到时间
					var signDate = dTmp.CREATE_DATE;//签到日期
					var signDateArr = signDate.split("-");
					var visitMonth = signDateArr[1];
					var visitDay = signDateArr[2];
					var signId = dTmp.SIGN_ID;	
					var signUser = dTmp.SIGN_USER_NAME;
					div.id="li_"+signId;
					if(custName&&custNames){
						//都不为空，则表示是弹窗签到
						_f=2;
					}else{
						_f=1;//直接签到
					}
					if(_f=="1"){//直接签到
						_c=1;
						div.innerHTML ='<div class="centDiv">'
									+'<div class="dc-time"><b class="c'+ _c +'">'+visitDay+'<i>'+visitMonth+'月</i></b></div>'
									+'<p class="dc-title"><i class="c'+ _c +'">'+signTime+'</i></p>'
									+'<p><b>签到人：</b>'+signUser+'</p></div>'
									+'<p><b>地址：</b>'+signAddress+'</p></div>'
									+'<div class="leftIconDiv">'
									+'<span class="icon-line-107"></span>'
									+'</div>';
					}else if(_f=="2"){//弹框签到
						_c=2;
						div.innerHTML ='<div class="centDiv">'
									+'<div class="dc-time"><b class="c'+ _c +'">'+visitDay+'<i>'+visitMonth+'月</i></b></div>'
									+'<p class="dc-title"><i class="c'+ _c +'">'+signTime+'</i></p>'
									+'<p><b>签到人：</b>'+signUser+'</p></div>'
									+'<p><b>联系人：</b>'+custNames+'</p>'
									+'<p><b>客户：</b>'+custName+'</p>'
									+'<p><b>地址：</b>'+signAddress+'</p></div>'
									+'<div class="leftIconDiv">'
									+'<span class="icon-line-107"></span>'
									+'</div>';
					}
					
					table.appendChild(div);					
				}
			}else{
				var div = document.createElement('div');
				div.innerHTML='暂无数据';
				div.style.marginLeft = "40%";
				div.style.marginTop = "60%";
				table.appendChild(div);
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
		urlId = plus.webview.currentWebview().id;
		getAddr();//定位
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}   	
	}
};
_App.init(appConfig);//对页面进行初始化

/*客户筛选 UI逻辑  sta*/
var _mask = mui.createMask(hideSearchSlider);
//展开所有筛选
mui('.mui-search-slider').on('tap', 'a.mui-control-item', function() {
	var _controlItem = this;
	if (_controlItem.classList.contains('mui-active')) {
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
	for (var i = 0; i < _mci.length; i++) {
		_mci[i].classList.remove('mui-active');
	}
	//document.querySelector(".mui-backdrop").style.display='none';
};

//页面跳转
function gos(num){
	if(num==1){
		signOn(); 
//		_App.util.goPage('fieldSign.html', {pageId: 'fieldSign.html'});
	}
	else if(num==2) {
		
	}
	else if(num==3){
		//弹框签到
		signPop();
	}
	else{
		_App.util.goPage('sche.html','none');
	}
}

//清空
function restore(){
	sign_select1.value="";
	sign_select2.value="";
	sign_select2.placeholder="自定义结束时间";
}

//根据搜索条件查询
function searchData(){
	if(sign_select1.value=="" && sign_select2.value!=""){
		mui.alert('请选择开始时间！','提示');
	}else{
		hideSearchSlider();
		_mask.close();
		var st = st=plus.nativeUI.showWaiting();
		condition = {
			startDate : sign_select1.value,
			endDate : sign_select2.value,
			content : searchContent.value
		};	
		appConfig.pageInfoConfig.url = basePath + 'signCountAction.json?conditions=' + JSON.stringify(condition);
		_App.init(appConfig);
		var pageQuery = _App.scroller;
		if (pageQuery) {
			pageQuery.loadData(true); //flag :true 下拉;false 上拉
			st.close();
		}
	}
}

//签到后刷新
function refreshData(){
	var st = st=plus.nativeUI.showWaiting();
	appConfig.pageInfoConfig.url = basePath + 'signCountAction.json';
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
		st.close();
	}
}
/**
 * 直接签到
 */
function signOn(){
	if(!isLocate){
		mui.alert('定位失败，请检查相关设备!', '提示', function() {
		});
		return;
	}
	_App.ajax({
		type:"get",
		url:basePath+"signCountAction!signOn.json",
		data:{
			addr:addr,
			longitude:longitude,
			latitude:latitude
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			mui.toast('签到成功');
			refreshData();
			
		},error:function(error){
			
		}
	});
}

/**
 * 直接签退
 */
function signOff(){
	_App.ajax({
		type:"get",
		url:basePath+"signCountAction!signOff",
		condition:{
			addr:addr,
			longitude:longitude,
			latitude:latitude
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			
		},error:function(error){
			
		}
	});
}
/**
 * 弹框签到
 */
function signPop(){
////	mui('.signPop').popover('toggle');
//	var div1 = document.getElementById('div1');//时间
//	var t = new Date();
//	div1.innerHTML = t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate() + " " + t.getHours() + ":" + t.getMinutes();
	//暂时不弹框
	
	_App.util.goPage("fieldSign.html?pageViewId=" + urlId,{
		pageId:'fieldSign_id'
	});
	
}

function getAddr(){
	ws = plus.nativeUI.showWaiting();
	//获取当前地址
	plus.geolocation.getCurrentPosition(function(p) {
		ws.close();
		if(!p.addresses) {
			isLocate=false;
//			mui.alert('定位失败，请检查相关设备!', '提示', function() {
//			});
		} else {
			isLocate= true;//定位成功
//			var div2 = document.getElementById('div2');//地址
//			div2.innerHTML = p.address.province + p.address.district + p.address.street;
			addr=p.address.province + p.address.district + p.address.street;
			longitude = p.coords.longitude;
			latitude = p.coords.latitude;
		}

	}, function(e) {
		ws.close();
		alert("Geolocation error: " + e.message);
		plus.webview.currentWebview().close();
	}
//	, {
//		provider: 'baidu'
//	}
	);
};

//获取关联客户
function selectedCust() {
	_App.util.goPage("customers.html?pageViewId=" + urlId, {
		pageId: 'customers.html'
	});
}
//监听关联客户
window.addEventListener('customer', function(event) {
	custId = event.detail.custId;
	custName.innerHTML = event.detail.custName;
});
//获取关联联系人
function selectedCusts() {
	_App.util.goPage("linkMan.html?pageViewId=" + urlId,{
		pageId:'linkMan.html'
	});
}
//监听关联联系人
window.addEventListener('fieldSignUrl_link', function(event) {
	var name = event.detail.name;
	custNames.innerHTML = name;
});
