var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebViewId"));//调用该界面的界面ID
var type = _App.util.getUrlParamByName("actType");
var backPage;//父级页面对象

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//ui加载完成调用
	uiReady: function() {
		var data = customerData.json.data; 
		var table = document.getElementById('ulId');
		for (var i = 0; i < data.length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell toolHover';
			var onclick_fun = '';
			var str_ = '';
			if(type == "mycust" || type == "nbcust"){
				onclick_fun = 'onclick="go2custView(\''+data[i].custType+'\');"';
				str_ = '<input name="checkbox1" value="Item 1" type="checkbox" style="display:none;">';
			}else{
				onclick_fun = 'onclick="goSelect(\''+data[i].custNo+'\',\''+data[i].name+'\');"';
				str_ = '<input name="checkbox1" value="Item 1" type="checkbox">';
			}
			li.innerHTML = '<a class="ys-list-cell" '+onclick_fun+'>'
							+ '<b>'+data[i].name+'</b>'
							+ '<span class="ys-lcRMin">'+data[i].distance+'</span>'
							+ '<span class="ys-lcLeft1">'+data[i].address+'</span>'
							+ '<span class="ys-lcRCk">'
							+ '<div class="mui-input-row mui-checkbox">'
							+ '<label>&nbsp;</label>'
							+ str_
							+ '</div></span>'
							+ '<span class="ys-lcLeft"><i class="mui-icon mui-icon-paperplane"></i>'+data[i].visit+'</span>'
							+ '<span class="ys-lcRight"><i class="mui-icon mui-icon-star"></i>拜访次数'+data[i].visitNum+'次</span>'
							+ '</a>';
			table.appendChild(li);
		}
	},
	//设备资源加载完成调用
	deviceReady: function() {
		if(type == "mycust" || type == "nbcust"){
			document.getElementById("titleId").innerHTML = "我的客户";
			document.getElementById("firstCustInputId").style.display="none";
			var obj = document.getElementById("firstCustAId");
			obj.onclick = function(){
				go2custView(2);
			}
		}
		if(cwebviewId && cwebviewId != "undefined") {document.getElementById("titleId").innerHTML = "客户选择";}
		backPage = plus.webview.getWebviewById(cwebviewId);
	}
};

_App.init(appConfig);

function go2custView(custType){
	var url = "";
	var pageId_ = "";
	if(1*custType == 1){//对私
		url = "../priCustView.html";
		pageId_ = "priCustView_Id";
	}else{//对公
		url = "../comCustView.html";
		pageId_ = "comCustView_Id";
	}
	_App.util.goPage(url,{
		pageId:pageId_,
		refresh:true
	})
}

function goSelect(bodyCode,name) {
	if(!backPage){
	  	mui.alert("页面还未准备好，请稍后...");
	  	return false;
	}
	//触发详情页面的newsId事件
	mui.fire(backPage,'chooseCustEvent__',{
	    name:encodeURIComponent(name),
	    bodyCode:bodyCode
	});
	
	plus.webview.currentWebview().close();
}


