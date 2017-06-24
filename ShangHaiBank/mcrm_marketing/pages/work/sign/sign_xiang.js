var id ;
var currentId;//当前视图id
function initDetail(){
	id = _App.util.getUrlParamByName("id");
	var condition = {};//查询条件
	condition.id = id;
	_App.ajax({
    	type : "get",
		url :basePath + 'signCountAction!index.json?conditions='+JSON.stringify(condition),
//      url :basePath + 'signCountAction!index.json?id='+id,
//		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			var table = document.getElementById('ulId');
   			var memo = document.getElementById('signxiang');
   			var length = data.length;
   			var div = document.createElement('li');
   			div.className = 'mui-table-view-cell';
   			var day = data[0].VISITDAY;
   			var month = data[0].VISITMONTH;
   			var custName = data[0].CUST_NAME;
   			var custNames = data[0].CUST_NAMES;
   			var createDate = data[0].CREATE_DATE;
   			var signTime = data[0].SIGN_TIME;
   			var signAddress = data[0].SIGN_ADDRESS;
   			var signMemo = data[0].SIGN_MEMO;
   			var signUser = data[0].SIGN_USER_NAME;
   			if(length > 0){
   				if(custName&&custNames){
   				//都不为空，则说明是弹框签到
   				div.innerHTML = '<a class="ys-list-cell"><b>'+custName+'</b>'
   			                  +'<span class="ys-lcLeft1"><i class="mui-icon icon-line-77"></i>时间：'+createDate+' '+signTime+'</span><br/>'
   			                 +'<span class="ys-lcLeft1"><i class="mui-icon icon-line-19"></i>联系人：'+custNames+'</span><br/>'
   			                 +'<span class="ys-lcLeft1"><i class="mui-icon icon-line-26"></i>地址：'+signAddress+'</span></a>';
   			}
   			else{
   				div.innerHTML = '<a class="ys-list-cell">'
   				 				+'<span class="ys-lcLeft1"><i class="mui-icon icon-line-19"></i>签到人：'+signUser+'</span><br/>'
   			                   +'<span class="ys-lcLeft1"><i class="mui-icon icon-line-77"></i>时间：'+createDate+' '+signTime+'</span><br/>'
   			                 +'<span class="ys-lcLeft1"><i class="mui-icon icon-line-26"></i>地址：'+signAddress+'</span></a>';
   			}
   				
				table.appendChild(div);
				
				memo.innerHTML='备注内容：'+data[0].SIGN_MEMO;
				var map = new BMap.Map("l-map-b");
				var point = new BMap.Point(data[0].SIGN_LONGITUDE,data[0].SIGN_LATITUDE);
				map.centerAndZoom(point,16);
				var mk = new BMap.Marker(point);
				map.addOverlay(mk);
				map.panTo(point);
   			}else{
   				mui.toast("查询无详情数据！");
   			}		
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
};
mui.plusReady(function(){
	currentId=plus.webview.currentWebview().id;
});
//function doShare() {
//	plus.storage.removeItem("_shareImgPath_");
//		//跳转到分享界面
//	var url = "../../finding/share/share.html?cwebviewObjId="+currentId+"&bizType=SIGN&bizId="+id ;
//	_App.util.goPage(url,{
//		pageId:"share_id",
//		refresh:true
//	});
//	
//}