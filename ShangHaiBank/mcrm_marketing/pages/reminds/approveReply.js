
var backValue = function(){
	var remark = document.getElementById("testautofocus").value;//备注
    var send = document.getElementById('divs').children[1].children[0].innerHTML;//抄送
    var nextApprover = document.getElementById('divs').children[2].children[0].innerHTML;//下一审批人
    var id = _App.util.getUrlParamByName("id");
    var Bid = _App.util.getUrlParamByName("Bid");
    var urlId = plus.webview.currentWebview().id;
    
    if(send == '选择'){
    	mui.toast('请先选择抄送对象！');
    	return false;
    }
    if(nextApprover == '选择'){
    	mui.toast('请先选择下一审批人！');
    	return false;
    }
    var approveStatus = "";
    if(urlId == "reply_html1"){
    	approveStatus = 0;//代签收
			}else if(urlId == "reply_html2"){
				approveStatus = 1;//正常办理
			}else if(urlId == "reply_html3"){
				approveStatus = 2;//打回
			}else{
				approveStatus = 3;//未审批
			}
    _App.ajax({
    	type : "get",
    	url :basePath + 'approveAction!addApprove.json?copyObject='+send+'&remark='+remark+'&nextApprover='
    	           +nextApprover+'&linkId='+id+'&approveStatus='+approveStatus+'&Bid='+Bid,
//		data:{},
   		cache: false,
// 		dataType: "",
   		success : function(response){
   			mui.toast('审批成功！');
            _App.util.goPage('file-make.html');
		},
   		error:function(){
   			mui.toast('审批失败！');
   		}
   	});
};
