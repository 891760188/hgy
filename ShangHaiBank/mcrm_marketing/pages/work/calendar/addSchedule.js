
/***
 * 保存日程数据
 */
function saveScheduleInfo(formId) {
	
	var dataTmp = {};
	var schTitle = document.getElementById("schTitle").value;
    var parter = document.getElementById("parter").innerText;
    var notice = "";//document.getElementById("notice").value;
    var addr = document.getElementById("addr").innerText;
    var isKey = document.getElementById("isKey").innerText;
    var startTime = document.getElementById("startTime").innerText;
    var endTime = document.getElementById("endTime").innerText;
	
	if(schTitle == null || schTitle == "undefined" || schTitle == ""){
		mui.alert("请输入日程标题！");
		return;
	}
	if(startTime == null || startTime == "undefined" || startTime == ""){
		mui.alert("请选择开始时间！");
		return;
	}
	if(endTime == null || endTime == "undefined" || endTime == ""){
		mui.alert("请输结束时间！");
		return;
	}
	
	if(compareDate(startTime,endTime,1)){
		mui.alert("结束时间不能早于开始时间！");
		return;
	}
	
	if(parter == null || parter == "undefined" || parter == ""){
		mui.alert("请选择参与人！");
		return;
	}
	if(addr == null || addr == "undefined" || addr == ""){
		mui.alert("请输入地址！");
		return;
	}
    plus.nativeUI.showWaiting("正在保存...");
	dataTmp.schTitle  = schTitle ;
	dataTmp.parter  = parter ;
	dataTmp.notice  = notice ;
	dataTmp.addr  =  addr;
	dataTmp.isKey  =  isKey;
	startTime+=":00";
	endTime+=":00";

	_App.ajax({
		type : "POST",
		url : basePath+'ScheduleAction!saveData.json?startTime='+startTime+'&endTime='+endTime,
		cache: false, 
		data:dataTmp,
		contentType:"application/x-www-form-urlencoded; charset=utf-8",
		dataType: "json", 
		success : function(response){
			plus.nativeUI.closeWaiting();
			mui.toast("保存成功");
			if(!backPage){
			  	return false;
		    }
			
		   mui.fire(backPage,'paramBackEvent__',{
			    name:""
			  });
			
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('保存失败！');
		}
	});	
};


function changeStatus(){
	var con = document.getElementById('isKey');
	var isActive = document.getElementById("switchBtnId").classList.contains("mui-active");
	if(isActive){//默认为重要
	  con.innerHTML = "1";
	  
	}else{
	 con.innerHTML = "0";
	}
}

//比较日期大小
function compareDate(startDate, endDate){
	 if (undefined != startDate &&　startDate.length > 0 
	 	   && undefined != endDate && endDate.length > 0) {

		   var d1 = new Date(startDate.replace(/\-/g, "\/"));  
		   var d2 = new Date(endDate.replace(/\-/g, "\/"));  
		
		  if(d1 >=d2)  
			 return true;
		  else
		     return false;
		
	} else {   
	    mui.alert("时间不能为空!");   
	    return false;   
    }   
}

