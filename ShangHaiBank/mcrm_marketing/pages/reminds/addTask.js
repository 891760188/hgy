/***
 * 保存任务数据
 */
var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
function saveTask(flag,id) {
	
	var dataTmp = {};
	var title = document.getElementById("title").value;
	var time = document.getElementById("time").value;
	var state = document.getElementById("state").value;
	var detail = document.getElementById("detail").value;
	var parter = document.getElementById("parter").innerText;
	var st;
    st=plus.nativeUI.showWaiting("正在保存...");
	dataTmp.title  = title ;
//	dataTmp.name  = name ;
	dataTmp.time  =  time;
	dataTmp.state  =  state;
	dataTmp.detail  = detail ;
	dataTmp.parter  = parter ;
	dataTmp.flag = flag;
	if(id != "null"){
		dataTmp.id = id;
	}

	_App.ajax({
		type : "POST",
		url : basePath+'ocrmFMobileWaitingTaskAction!saveTask.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		success : function(response){
			st.close();
			if(backPage != null){
			  	mui.fire(backPage,'paramBackEvent__',{
				    name:""
				});
		   }		
		    cwebviewId = plus.webview.getWebviewById(cwebviewId);
			mui.fire(cwebviewId,'refreshActive',{
			  });
			  plus.webview.currentWebview().close("addTask.html");
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('保存失败！');
		}
	});	
};

//初始化数据
function initTask(id){
//	var id = _App.util.getUrlParamByName("id");
	if(id != "null"){
		var condition = {};//查询条件
		condition.id = id;
		_App.ajax({
			type : "get",
	  		url :basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions='+JSON.stringify(condition),
			data:{},
	 		cache: false,
	   		dataType: "json",
	   		success : function(response){
	   			var data = response.json.data;
	   			var dt = new Date();
	   			var str = dt.getFullYear()+"-"+(dt.getMonth()+1)+"-"+dt.getDate()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
	   			if(data.length > 0){
	   				document.getElementById("title").value = data[0].TITLE;
	   				document.getElementById("name").value = data[0].NAME;
	   				document.getElementById("parter").innerText = data[0].ACC_PEOPLE;
	   				document.getElementById("time").value = str;
	   				var selectCount = document.getElementById("state").options;  
			        for(var i = 0 ; i<selectCount.length;i++){  
			            if(selectCount[i].value == data[0].STATES){  
			                selectCount.selected=true;   
			            }  
			        } 
	   				document.getElementById("detail").innerHTML = data[0].DETAIL;
	   			}else{
	   				mui.toast("已全部加载完成");
	   			}
	   		},
	 		error:function(a,b,c){
	 			mui.alert("网络连接出错!");
	 		}
		});
	}
}
