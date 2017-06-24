var currentViewId;
/*
 * antStorage：@功能缓存数组；去重请到后台去
 * [
 * 	{
 * 		model:'自定义模块，比如：评论，回复',
 * 		chooseType:'选择值的类型，比如：机构-ORG，人员-PEO',
 * 		chooseId:'选择值的Id：机构ID 或者 人员ID',
 * 		chooseName:'选择值的名称：机构名称 或者 人员名称',
 * 		start:'在整个字符串中的起始位置',
 * 		end:'结束位置'
 * 	}
 * ]
 */
var antStorage = [];
var chooseUserNamesStorage = ",";//过滤重名
var antInputCount=0;//记录input变化次数
var oldAntValue,midAntValue;//缓存之前数据

/***
 * 保存日志数据
 */
function saveLogInfo() {
	
	var dataTmp = {};
    var logContent = document.getElementById("logContent").value;
	
	if(logContent == null || logContent == "undefined" || logContent == ""){
		mui.alert("请输入日志内容！");
		return;
	}
	var tmp = logContent.replace(/\n/g,"<br>")
    plus.nativeUI.showWaiting();
	dataTmp.logContent  = encodeURI(tmp) ;
	if(plus.os.name=="Android"){
		dataTmp.terminal = "Android";
	}else{
		dataTmp.terminal = "iOS";
	}
	dataTmp.antDatas=JSON.stringify(antStorage);
	_App.ajax({
		type : "POST",
		url : basePath+'ocrmFMobileLogAction!saveData.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			plus.nativeUI.closeWaiting();
			mui.toast("保存成功");
			
			var blWay = _App.util.getUrlParamByName("blWay");
			if (blWay != null && blWay == 1) {
				var obj = plus.webview.create("logLists.html");
				obj.show();
			} else {
				if(!backPage){
//				  	mui.alert("选中后，请点击完成");
				  	return false;
			    }
				
				mui.fire(backPage,'paramBackEvent__',{
				    name:""
				});
			}
		    
			plus.webview.currentWebview().close();
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('保存失败！');
		}
	});	
};

//获取选择人员数据
window.addEventListener('chooseUserMesEvent__', function(event) {
	if(plus.nativeUI.showWaiting()){
		plus.nativeUI.closeWaiting();
	}
	act = event.detail.act;
	chooseUserNames = decodeURIComponent(event.detail.chooseUserNames);
	chooseUserIds = event.detail.chooseUserIds;
	var type = event.detail.chooseType;
	var _s = "";
	//目标字符串
	var target = document.getElementById("logContent").value;
	target = target.split(" ").join("</br>");
	//如果没有选择，需要去掉@符号
	if(!chooseUserIds){
		_s = delAntBackNull(target);
	}else{
		//过滤重名 chooseUserNamesStorage
		var temp = ","+chooseUserNames+",";
		if(chooseUserNamesStorage.indexOf(temp) == -1){//不重名
			chooseUserNamesStorage += chooseUserNames+",";
			var repc = "[@"+chooseUserNames+"]";//"<b id='index_"+antChooseIndex+"' contenteditable='true'>@"+chooseUserNames+"</b>&nbsp;";//contenteditable='true' -- 运行删除，一个一个字符删除
			//在添加前，必须记下添加的位置
			var iof = target.indexOf("@");
			var st,ed;
			if(iof == 0 && target.length == 1){//起始就是@符号；并排除掉后面的@符号
				st = 0;
			}else{
				st = target.length-1;
			}
			ed = st+repc.length;
			//缓存选择数据
			var m = {
				model:'COMMENT',
				chooseType:type,
				chooseId:chooseUserIds,
				chooseName:chooseUserNames,
				start:st,
				end:ed
			};
			antStorage.push(m);
			_s = antCharachterFun(target,repc);
		}else{
			_s = delAntBackNull(target);
			mui.toast("已选择！");
		}
		
		midAntValue = _s;
		oldAntValue = _s;
		antInputCount += 1;
	}
	//替换完后，展示
	_s = _s.split("</br>").join(" ");
	document.getElementById("logContent").value = _s;
});