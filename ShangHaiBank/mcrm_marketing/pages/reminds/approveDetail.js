var detail = function(id){
	_App.ajax({
    	type : "get",
    	url :basePath + 'approveAction!searchDetail.json?id='+id,
//		data:{},
   		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.searchInfo3.data;
   			var length = data.length;
   			if(length > 0){
   			for(var i = 0;i < length;i++){
   				var table = document.getElementById('ulId');
   				var APPROVE_CONTENT = data[i].APPROVE_CONTENT;//申请内容
   			    var PROPOSE_TIME = data[i].PROPOSE_TIME;//申请发起时间
   			    var APPROVE_TIME = data[i].APPROVE_TIME;//审批时间
   			    var PROPOSER = data[i].PROPOSER;//申请人
   			    var APPROVE_ID = data[i].APPROVE_ID;//审批id
   			    var APPROVER_NAME = data[i].APPROVER_NAME;//审批人名称
   			    var Bid = data[i].ID;//OCRM_F_CI_APPROVE_LINK表的主键id
   			    var APPROVE_STATUS = lookUp(data[i].APPROVE_STATUS);//审批状态
   			    var NEXT_APPROVER = data[i].NEXT_APPROVER;//下一审批人
   				var ul = document.createElement('ul');
   				if(typeof(APPROVE_TIME) == "undefined"){
   					APPROVE_TIME = "";
   				}
   				ul.innerHTML = '<div class="mui-table-view-cell-bt" style="text-align: left;background-color: gray;"></div>'
							    +'<ul class="mui-table-view mui-table-view-group">'
								+'<li class="mui-table-view-cell">'
								+'<b class="tagTips icon-star-half c2 bdc2" id="saleDoTip">审批内容</b>'+APPROVE_CONTENT+''
								+'<p id="planDoName">审批人：'+APPROVER_NAME+'</p>'
								+'<p>审批时间：'+APPROVE_TIME+'</p>'
								+'<p>审批状态：'+APPROVE_STATUS+'</p>'
								+'<p>下一审批人：'+NEXT_APPROVER+'</p>'
								+'<div class="idxStepBox">'
								+'</div>'
								+'</li></ul>';
   				table.appendChild(ul);
   			}
// 			mui.alert("签到成功!");
		
   			}else{
   				mui.alert("当前没有已办审批！");
   			}
   			},
   		error:function(){
   			mui.alert("加载失败");
   		}
   	});
}

var lookUp = function(a){
	//0:代签收，1:正常办理，2:打回，3未审批)
	if(a == 0){
		return "代签收";
	}else if(a == 1){
		return "正常办理"
	}else if(a == 2){
		return "打回";
	}else{
		return "未审批";
	}
	
}
