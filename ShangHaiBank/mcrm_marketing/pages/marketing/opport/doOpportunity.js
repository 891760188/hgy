var curWebViewId;
var backPage;
var cwebview = decodeURIComponent(_App.util.getUrlParamByName("cwebview"));

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
	},
	//设备资源加载完成调用
	deviceReady: function() {
		curWebViewId = plus.webview.currentWebview().id;
		curWebViewId = encodeURIComponent(curWebViewId);//便面中午在iOS上报错
		backPage = plus.webview.getWebviewById(cwebview);
		
		document.getElementById('prodChooseId').addEventListener('tap', function(e) {
			selectProduct();
		});
	}
};

_App.init(appConfig);

function cancel(){
	mui.back();
}



//产品选择自定义事件监听
window.addEventListener('chooseProdEvent__',function(event){
	//获得事件参数
	var name = event.detail.name;
	document.getElementById("prodChooseId").value = name;
});

function selectProduct(){
	var url = '../../product/productChoose.html?cwebviewId='+curWebViewId+'&pageType=2';
	_App.util.goPage(url, {
		pageId:"productChoose_Id",
		refresh:true
	});
}

function save(){
	var map_ = plus.storage.getItem("flowOppDMap_");
	map_ = JSON.parse(map_);
	var newAddOpportunity = plus.storage.getItem("newAddOpportunity");
	if(!newAddOpportunity){
		newAddOpportunity = [];
	}else{
		newAddOpportunity = JSON.parse(newAddOpportunity);
	}
	//删除并替换原来的元素
	var pos = map_.pos;
	var step = map_.oppStep;
	step = 1*step+1;
	map_.oppStep = ""+step;
	newAddOpportunity.splice(pos,1);
	//添加元素
	newAddOpportunity.unshift(map_);
	//重设数组数据
	plus.storage.removeItem("newAddOpportunity");
	plus.storage.setItem("newAddOpportunity",JSON.stringify(newAddOpportunity));
	mui.fire(backPage,'newAddOppBackEvent__',{
	});
	mui.back();
};

//产品选择自定义事件监听
window.addEventListener('chooseProdEvent__',function(event){
	//获得事件参数
	var name = event.detail.name;
	document.getElementById("prodChooseId").value = name;
});


function toChat2(name){
	_App.util.goPage('../../public/chat/chatRecord.html?toUserName='+encodeURIComponent(name),'none');
}


function changeStatus(){
	var doPlan = document.getElementById('doPlan');
	var canclePlan = document.getElementById('canclePlan');
	var isActive = document.getElementById("switchBtnId").classList.contains("mui-active");
	if(isActive){
		isDo = true;
	  doPlan.style.display = "inline";
	  canclePlan.style.display = "none";
	 
	}else{
		isDo = false;
		doPlan.style.display = "none";
		canclePlan.style.display = "inline";
	}
}

function hrefClick(){
	plus.device.dial('13487678574', false);
}