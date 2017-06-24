var accName;
var checkPoint = _App.util.getUrlParamByName("checkPoint");
function initDetail(){
	var id = _App.util.getUrlParamByName("id");
	var condition = {};//查询条件
	condition.id = id;
	_App.ajax({
		type : "get",
//		url :basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition),
        url :basePath + 'ocrmFMobileWaitingTaskAction!index.json?id='+id+'&checkPoint='+checkPoint,

		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			var length = data.length;
   			if(data.length > 0){
   				accName = data[0].ACC_PEOPLE;
   				document.getElementById("title").innerText = data[0].TITLE;
   				document.getElementById("name").innerText = "任务下达人："+data[0].NAME;
   				document.getElementById("accName").innerText = "任务接收者："+accName;
   				document.getElementById("time").innerText = "下达时间："+data[0].TIMES;
   				document.getElementById("detail").innerText = data[0].DETAIL;
   				var table = document.getElementById('reply');
   				if(typeof(data[0].AID)!= "undefined"&&data[0].AID!=""){
   					for(i = 0;i < length;i++){
   					var liTmp = document.createElement('li');
   					liTmp.innerHTML ='<li class="mui-table-view-cell">'		
								       +'<div class="mtvcLeft">'
//									   +'<span class="mlUserPic"><img src="../../../themes/default/images/temp/temp_02.gif" /></span>'
									   +'<span class="mlUserInfo"><b id="userId">'+data[i].REPLY_MAN+'</b>'
									   +'</span>'
								       +'</div>'
								       +'<div class="mtvcLeft">'
								       +'<p>'+data[i].REPLY_DETAIL+'</p>'
								       +'<p class="minText icon-clock">'+data[i].REPLY_TIME+'</p>'
								       +'</div>'
						               +'</li>';
						               table.appendChild(liTmp);
   				}
   					}
   			}else{
   				mui.toast("已全部加载完成");
   			}
   		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
	});
}

var getUserName = function(){
	var data;
	_App.ajax({
		type : "get",
//		url :basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition),
        url :basePath + 'ocrmFMobileWaitingTaskAction!getUserName.json',
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			data = response.userName;
   		},
 		error:function(a,b,c){
 			mui.alert("无法获取当前登录人信息");
 		}
	});
	return data;
}
