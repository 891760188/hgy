var curWebViewId;//当前界面ID
var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));//调用当前界面ID

var backPage;//返回调用界面对象

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		
		//界面加载好之后重新滚动
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		curWebViewId = plus.webview.currentWebview().id;
		curWebViewId = encodeURIComponent(curWebViewId);//便面中午在iOS上报错
		backPage = plus.webview.getWebviewById(cwebviewId);
	}
};

_App.init(appConfig);

function selectedCust(){
	var url = "../../custManage/nearbyCust/nearbyCust.html?cwebViewId="+curWebViewId;
	_App.util.goPage(url,{
		pageId:'nearbyCustId', 
		refresh: true   
	});
}

//客户选择回调
window.addEventListener('chooseCustEvent__',function(event){
	 //获得事件参数
	  var userName = decodeURIComponent(event.detail.name);
	  var bodyCodeId = event.detail.bodyCode;
	  if(undefined != bodyCodeId && "" != bodyCodeId){
		 document.getElementById("custName").value = userName;
		 document.getElementById("bodyCodeId").value = bodyCodeId;
		if(bodyCodeId == '600040439305'){//第一个客户，不提示
			
		}else if(bodyCodeId == '600034258813'){//第二个客户，属于事业部的客户提示
			mui.confirm( '"'+userName+'"为总行事业部客户是否与事业部协商妥当，继续创建商机', function(e){
				if(e.index==1){//yes
		            return false;
				}else{//no
					 document.getElementById("custName").value = "";
		             document.getElementById("bodyCodeId").value = "";
					return false;
				}
			}, "nativeUI", ["确定 ","取消"] );
			
		}else if(bodyCodeId == '600009013634'){//不是对应客户经理 的客户提示
			
			mui.confirm( '"'+userName+'"为客户经理"王珂"名下客户，是否需要继续创建商机', function(e){
				if(e.index==1){//yes
		            return false;
				}else{//no
					document.getElementById("custName").value = "";
		            document.getElementById("bodyCodeId").value = "";
					return false;
				}
			}, "nativeUI", ["确定 ","取消"] );
		}
		
      }
});

function save2(){  
	var userName = document.getElementById("custName").value;
	if(!userName){
		mui.alert("请选择客户！");
		return false;
	}
	var bodyCodeId = document.getElementById("bodyCodeId").value;
	var zcgmvalue = document.getElementById("t2").value;
	if(1*zcgmvalue >= 5000){  
		mui.alert("资产规模超5000万，给团队长发短信中...");
	}
	var vmap = {"custName":userName,"bodyCode":bodyCodeId,"oppStep":"1"};//oppStep:1-商机录入；2-确认方案；3-业务落地；-1：已过期
	var newAddOpportunity = plus.storage.getItem("newAddOpportunity");
	if(!newAddOpportunity){
		newAddOpportunity = [];
	}else{
		newAddOpportunity = JSON.parse(newAddOpportunity);
	}
	newAddOpportunity.push(vmap); 
	plus.storage.removeItem("newAddOpportunity");
	plus.storage.setItem("newAddOpportunity",JSON.stringify(newAddOpportunity));
	//新增后绑定事件
	mui.fire(backPage,'newAddOppBackEvent__',{
	});
	cancle();
}

function cancle(){
	mui.back();
}
