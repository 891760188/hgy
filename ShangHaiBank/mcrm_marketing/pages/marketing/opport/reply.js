var id = _App.util.getUrlParamByName("id");
var backContent = function(){
	var content = document.getElementById("feedbackContent").value;
	_App.ajax({
		type : "get",
        url :basePath + 'ocrmFMobileWaitingTaskAction!addFeedback.json?id='+id+'&content='+content,
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			mui.alert("回复成功！");
   		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
	});
}
