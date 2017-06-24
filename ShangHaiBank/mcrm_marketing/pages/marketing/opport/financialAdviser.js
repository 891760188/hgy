var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));//获取调用该界面的ID（父界面ID）
var  pageType = _App.util.getUrlParamByName("pageType");//需要根据类型处理的参数
var backPage;
var nameObj = ",";//选择的用户名


if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
function plusReady(){
	backPage = plus.webview.getWebviewById(cwebviewId);
}

function backFn(){
	if( pageType == 'SCH_' || pageType == "TASK_ADD"){
		var backStr = "";
		mui(".icon-radio-checked").each(function () {
				var dataFun = this.getAttribute('data-fn');
				var len1 = dataFun.length;
				var nameStr = dataFun.substring(19,len1-3);
				backStr = backStr+nameStr+",";
				
			});
		if("" == backStr || undefined == backStr){
			mui.alert("请选择产品！");
			return false;
		}
		var len = backStr.length;
		backStr = backStr.substring(0,len-1);
		mui.fire(backPage,'paramBackEvent__',{
			name:backStr
		});
		
		mui.back();
	}else{
		if(nameObj == ","){
			mui.alert("您没有选择人员！")
		}else{
			nameObj = nameObj.substring(1,nameObj.length-1);
			mui.fire(backPage,'paramBackEvent__',{
		    	name:nameObj
		    });
		    mui.back();
		}
	}
   
}

function selectedNode(obj,name){
	var tempName = ","+name+",";
	if(obj.classList.contains("icon-radio-checked")){
		obj.classList.add('icon-radio-unchecked');
		obj.classList.remove('icon-radio-checked');
		
		if(nameObj.indexOf(tempName) != -1){
			nameObj = nameObj.replace(tempName,",");
		}
	}
	else{
		obj.classList.remove('icon-radio-unchecked');
		obj.classList.add('icon-radio-checked');
		
		if(nameObj.indexOf(tempName) == -1){
			nameObj += name +",";
		}
	}	
}
			
function selectBack(obj){
	var tempName = ","+obj+",";
	if(nameObj.indexOf(tempName) != -1){
		nameObj += obj +",";
	}
	if(!backPage){
	  	alert("选中后，请点击完成");
	  	return false;
    }
   return false;
}