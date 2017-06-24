var currentId ;//当前视图id
var recordId = "";
var SCHEDULE_TYPE="SCHEDULE";
var COMMENT_TYPE= "COMMENT";
var scheduleStorage = [];
//初始化详情页面
function initDetail(){
	var schId = _App.util.getUrlParamByName("schId");
	recordId = schId;
	var condition = {};//查询条件
	condition.schId = schId;
	_App.ajax({
    	type : "get",
  		url :basePath + 'ScheduleAction!index.json?conditions='+JSON.stringify(condition),
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.json.data;
   			if(data.length > 0){
   				
				var dTmp = data[0];
				
				var isKey = dTmp.IS_KEY;
				var scdId = dTmp.SCH_ID;
				var uId = dTmp.USER_ID;
				var cont = dTmp.SCH_CONTENT;
				var startTime = dTmp.START_TIME;
				var endTime = dTmp.END_TIME;
				var title = dTmp.SCH_TITLE;
				var parter = dTmp.PARTER
				var supCount = dTmp.SUP_COUNT;
				var focCount = dTmp.FOC_COUNT;
				var addr = dTmp.ADDR;
				var userName = dTmp.USER_NAME;
				var commCount = dTmp.COMM_COUNT;
				var isSup = dTmp.IS_SUP;
				
				document.getElementById("userId").innerText = userName;
				document.getElementById("titleId").innerText = title;
				document.getElementById("contId").innerText = cont;
				if(isKey == 0)
				   document.getElementById("isKey").style.display = "none";
				   
				document.getElementById("parter").innerText = parter;
				var timeTmp = startTime+" -- "+endTime;
                document.getElementById("timeShow").innerText = timeTmp;
                document.getElementById("addr").innerText = addr;

                var sup = document.getElementById("suportId");
                sup.setAttribute("data-issup",isSup);
                sup.innerHTML ='赞('+supCount.trim()+') ';
                if(isSup != "0"){
                	sup.className = "icon-like sup_state_1";
                }
                
                var focO = document.getElementById("focusId");
                focO.setAttribute("data-issup",focCount);
                if(focCount.trim() != "0"){
                	focO.setAttribute("style","color:orangered;border-color: orangered;");
					focO.innerHTML = '取消';
                }
                
                document.getElementById("commonId").innerText = "评论("+commCount+")";
   			}else{
   				mui.toast("已全部加载完成");
   			}
		},
 		error:function(a,b,c){
 			mui.alert("网络连接出错!");
 		}
 	});
};


var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'CommAndReplyAction!queryCommList.json', //查询URL
		pageSize: 4,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'comm_list',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){
			
			var data = response.json.data;
			var table = document.getElementById('comm_list');
			var len = data.length;
			if(len >0){
				for (var i = 0; i < len; i++) {
					var dTmp = data[i];
					if(undefined == dTmp || null == dTmp || "" == dTmp){
						break;
					}
	
					var userName = dTmp.USER_NAME;
					var commId = dTmp.COMM_ID;
					var typeId = dTmp.TYPEID;
					var recId = dTmp.RECORDID;
					var content = dTmp.COMM_CONTENT;
					var opTime = dTmp.COMM_OPTIME;
					var pCount = dTmp.SUP_COUNT
					var isSup = dTmp.IS_SUP;
					
					var liTmp = document.createElement('li');
				    liTmp.className = 'mui-table-view-cell';
				    liTmp.id = "li_"+commId;

					liTmp.innerHTML = '<div class="mtvcLeft"> '
					+' 			<span class="mlUserPic"><img src="../../../themes/default/images/temp/temp_02.gif" /></span> '
					+' 			<span class="mlUserInfo"><b id="userId">'+userName+'</b> '
					+' 			</span> '
					+' 		</div> '
					+' 		<div class="mtvcRight minText"> '
					+' 			<i class="minText icon-bin  mui-del-btn-flag" data-id="'+commId+'">删除</i>  '
					+' 			<i class="minText icon-like mui-sup-btn-flag sup_state_'+isSup+'" data-issup="'+isSup+'" data-id="'+commId+'" id="sup_id_'+commId+'">赞('+pCount+')</i>  '
					+' 			<i class="minText icon-redo2  mui-reply-btn-flag"  data-parent="'+commId+'" data-pname="'+userName+'" data-record="'+recId+'" id="rep_'+commId+'">回复</i>  '
					+' 		</div> '
					+' 		<p style="clear:both;">'+content+'</p> '
					+' 		<p class="minText icon-clock">'+opTime+'</p> ';
					
					table.appendChild(liTmp);
					checkAt();

			   }
				
				mui(".mui-table-view-cell").on("tap",".mui-reply-btn-flag",function(){
					var pId = this.getAttribute("data-parent");
					
					var pName = this.getAttribute("data-pname");
					
					showPrompt(this,pId,pName);

				});
				
				mui(".mui-table-view-cell").on("tap",".mui-sup-btn-flag",function(){
					var isSup = this.getAttribute("data-issup");
					var tmpId = this.getAttribute("data-id");
					if(isSup == "0"){
						doSuppport(this,COMMENT_TYPE,tmpId,supBackComm);
					}else{
						cancleSupport(this,COMMENT_TYPE,tmpId,cancleSupBackComm);
					}
				});
				
				mui(".mui-table-view-cell").on("tap",".mui-del-btn-flag",function(){
					var id = this.getAttribute("data-id");
					delCommReply(SCHEDULE_TYPE,recordId,id);
				});
				
			}else{
				table.innerHTML = '<li class="mui-table-view-cell toolHover">'
				                  +'<div>'
				                  +' 无评论数据'
				                  +'</div>'
				                  +'</li>';
			}
			
		},
		error: function(){//失败回调方法
			alert('error!');
		}
	},
	//ui加载完成调用
	uiReady: function() {
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		currentId = plus.webview.currentWebview().id;
		//alert('deviceReady');
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
	}
};

var checkAt = function(){
	document.querySelector("#commonTent").addEventListener('input',function(){
			//随时检索是否有@符号
			var content = this.value;
			var len = content.length;
			var num1 = numBack(content,'@');
			var num2 = numBack(content,'[@');
			if(content.indexOf('@') != -1){
				if(num1 != num2){
					
					var currentViewId = plus.webview.currentWebview().id;
				var pageViewId = encodeURIComponent(currentViewId);
				document.getElementById("commonTent").value = content.substr(0,len-1);
					var url = "../../SocialCol/contacts/colleagues.html?dataFnType=radio&pageVeiwId=" + pageViewId;
				_App.util.goPage(url, {
					pageId: 'colleagues-id',
					refresh: true
				});
				}
			}
		});
}

//获取选择人员数据
window.addEventListener('chooseUserMesEvent__', function(event) {
	if(plus.nativeUI.showWaiting()){
		plus.nativeUI.closeWaiting();
	}
	act = event.detail.act;
	chooseUserNames = decodeURIComponent(event.detail.chooseUserNames);
	chooseUserIds = event.detail.chooseUserIds;
	var type = event.detail.chooseType;
	var cont = document.getElementById("commonTent").value;
	var _s = "";
	
	if(chooseUserNames != ""&& cont.indexOf(chooseUserNames) == -1){
		chooseUserNames = "[@"+chooseUserNames+"]";
	}else if(cont.indexOf(chooseUserNames) != -1){
		mui.alert("此人已经选了");
		chooseUserNames = "";
	}else{
		chooseUserNames = "";
	}
	var m = {
		        model:'COMMENT',
				chooseType:type,
				chooseId:chooseUserIds,
				chooseName:chooseUserNames
			};
			scheduleStorage.push(m);
	document.getElementById("commonTent").value = cont + chooseUserNames;
});

var numBack = function(a,b){
	var count = 0;
	while(a.indexOf(b) != -1){
		a = a.replace(b,'');
		count++;
	}
	return count;
}

//更新关注和点赞---已作废，不再使用
function updateSupAndFoc(schId,type){
	var dataTmp = {};
	dataTmp.schId = schId;
	dataTmp.typeTmp= type;
	plus.nativeUI.showWaiting("正在加载...");
	_App.ajax({
		type : "POST",
		url : basePath+'ScheduleAction!updateFocAndSup.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			plus.nativeUI.closeWaiting();
			mui.toast("操作成功");
			
			if(type == 0){//点赞
				
				var objTmp = document.getElementById("suportId");
				var oldNum = objTmp.getAttribute("data-val");
			    var newNum = 1+ parseInt(oldNum);
				objTmp.setAttribute("data-val",newNum);
				objTmp.innerHTML = '赞（'+newNum+'）';
				mui.toast('点赞+1');
			}else if(type == 1){//关注
				var objTmp = document.getElementById("focusId");
				var cssTmp = objTmp.getAttribute("style");
				
				if(cssTmp == null || cssTmp == ""){
					objTmp.setAttribute("style","color:orangered;border-color: orangered;");
					mui.toast('关注成功');
					objTmp.innerHTML = '取消';
				}else{
					objTmp.setAttribute("style","");
					mui.toast('取消成功');
					objTmp.innerHTML = '关注';
				}
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('操作失败！');
		}
	});	
}

//加载评论数据
function loadCommData(condition){
	
	plus.nativeUI.showWaiting();
	var table = document.getElementById('supUsers_id');
	var coObj = document.getElementById('pullrefresh');
	table.style.display = "none";
	coObj.style.display = "block";
	
	appConfig.pageInfoConfig.url = basePath + 'CommAndReplyAction!queryCommList.json?conditions='+JSON.stringify(condition);
	_App.init(appConfig);
	
	var pageQuery = _App.scroller;
   	if(pageQuery) {
   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
   	}
   	plus.nativeUI.closeWaiting();

}

//加载点赞人员
function loadSupData(condition){
	
	 plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'OcrmSupportAction!querySupList.json',
		cache: false, 
		data:condition,
		dataType: "json", 
		success : function(response){
			
			var supDiv=document.getElementById('supNames');
			var _html='<p class="darkText icon-like" style="font-size: 12px">';
			plus.nativeUI.closeWaiting();
			var data = response.json.data;
			var len = data.length;
			
			var table = document.getElementById('supUsers_id');
			var coObj = document.getElementById('pullrefresh');
			table.innerHTML = "";
			table.style.display = "block";
			coObj.style.display = "none";
			if(len>0){
   				supDiv.style.display="block";
   				for(var i = 0 ;i<len;i++){
					if(i<len-1){
						_html+=data[i].USER_NAME+'，';
					}else{
						_html+=data[i].USER_NAME+'';
					}
					
				}
   			}else{
   				supDiv.style.display="none";
   			}
   			_html+='</p>';
   			supDiv.innerHTML=_html;
			if(len > 0){
				
				
				for (var i = 0; i < len; i++) {
					var dTmp = data[i];
					if(undefined == dTmp || null == dTmp || "" == dTmp){
						break;
					}
					var userName = dTmp.USER_NAME;

					var liTmp = document.createElement('div');

					liTmp.innerHTML = '<div class="user_ico"> '
					+' 			<span class="mlUserPic" style="clear:both;"><img src="../../../themes/default/images/temp/temp_02.gif" /></span> '
					+' 			<span class="mlUserInfo"><b id="userId">'+userName+'</b> '
					+' 			</span> '
					+' 		</div> '
					
					table.appendChild(liTmp);
					
				}
			}else{
				table.innerHTML = '<div>'
				                  +' 暂无点赞人员'
				                  +'</div>'
			}
   			
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('加载失败！');
		}
	});	

}


//评论 oprType "COMM"表示评论 其余表示回复
function commonSale() {
	var dataTmp = {};
	var commContent = document.getElementById("commonTent").value;

	if(commContent == null || commContent == "undefined" || commContent == ""){
		mui.alert("评论内容不能为空！");
		return;
	}
	
	var commTT = document.getElementById("commTitle");
	
	var disp = commTT.style.display;
	if("block" ==disp ){
		commContent = commTT.innerHTML +""+commContent;
	}

	if(recordId == null || recordId == "undefined" || recordId == ""){
		mui.alert("请选择对应的记录！");
		return;
	}
	
    plus.nativeUI.showWaiting();
    if(commParentId != undefined && "" != commParentId){
        dataTmp.oprType  = "REPLY" ;
        dataTmp.parentId = commParentId;
    }else
	    dataTmp.oprType  = "" ;
	dataTmp.commContent  = encodeURI(commContent) ;
	dataTmp.recordId  = recordId ;
	dataTmp.terminal  =  "android";
	dataTmp.typeId  =  SCHEDULE_TYPE;
	dataTmp.antDatas = JSON.stringify(scheduleStorage);

	_App.ajax({
		type : "GET",
		url : basePath+'CommAndReplyAction!saveData.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("评论成功！");
			mui('#popover2').popover('toggle');
			
			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
				var commObj = document.getElementById("commonId");
	            commObj.innerText = "评论("+count+")";
	            
	            var condition = {};
				condition.typeId = SCHEDULE_TYPE;
				condition.recordId = recordId;
	            loadCommData(condition);
	            
	            refreshBack("comm_",recordId,count);
			}
            commParentId = "";
		},
		error:function(){
			commParentId = "";
			plus.nativeUI.closeWaiting();
			mui.alert('评论失败！');
		}
	});	
		
}

var commParentId = "";
function showPrompt(obj,pId,pName){
	if(undefined != obj){
		var comm = document.getElementById("commTitle");
		if(undefined != pId && "" != pId){
			comm.innerHTML = '回复<b style="color:blue">@'+pName+'</b>:';
			comm.style.display = "block";
		}else{
			comm.style.display = "none";
		}
		commParentId = pId;
	}
	
	document.getElementById("commonTent").value = "";
	mui('#popover2').popover('toggle');
}

//点赞
function doSuppport(obj,typeId,recId,fun){
	var dataTmp = {};
	dataTmp.recordId = recId;
	dataTmp.typeId = typeId
	plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'OcrmSupportAction!saveData.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("点赞成功！");

			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
                 fun(count,recId);
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('点赞失败！');
		}
	});	
}
//取消点赞
function cancleSupport(obj,typeId,recId,fun){
	var dataTmp = {};
	dataTmp.recordId = recId;
	dataTmp.typeId = typeId
	plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'OcrmSupportAction!cancleSupport.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("取消点赞！");

			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
				fun(count,recId);
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('取消点赞失败！');
		}
	});	
}

//评论点赞回调
function supBackComm(count,recId){
	
	var commObj = document.getElementById("sup_id_"+recId);
	commObj.className = "minText icon-like mui-sup-btn-flag sup_state_1";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","1");
}
//评论取消点赞回调
function cancleSupBackComm(count,recId){
	
	var commObj = document.getElementById("sup_id_"+recId);
	commObj.className = "minText icon-like mui-sup-btn-flag sup_state_0";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","0");
}

//日程点赞回调
function supBackSch(count,recId){
	
	var commObj = document.getElementById("suportId");
	commObj.className = "icon-like sup_state_1";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","1");
    refreshBack("sup_",recId,count,"1");
}
//日程取消点赞回调
function cancleSupBackSch(count,recId){
	
	var commObj = document.getElementById("suportId");
	commObj.className = "icon-like sup_state_0";
	
    commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","0");
    
    refreshBack("sup_",recId,count,"0");
}

//删除评论
function delCommReply(typeId,recId,id){
	var dataTmp = {};
	dataTmp.recordId = recId;
	dataTmp.typeId = typeId;
	dataTmp.id = id;
	plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'CommAndReplyAction!delCommAndReply.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("删除成功！");
			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
				var commObj = document.getElementById("li_"+id);
				commObj.parentNode.removeChild(commObj);
				 
				document.getElementById("commonId").innerText = "评论("+count+")";
				
				refreshBack("comm_",recId,count);
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('删除失败！');
		}
	});	
}


//关注
function doFocus(obj,typeId,recId,fun){
	var dataTmp = {};
	dataTmp.recordId = recId;
	dataTmp.typeId = typeId
	plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'OcrmFocusAction!saveData.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("关注成功！");

			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
                 fun(count,recId);
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('关注失败！');
		}
	});	
}

//取消关注
function cancleFocus(obj,typeId,recId,fun){
	var dataTmp = {};
	dataTmp.recordId = recId;
	dataTmp.typeId = typeId
	plus.nativeUI.showWaiting();
	_App.ajax({
		type : "GET",
		url : basePath+'OcrmFocusAction!cancleFocus.json',
		cache: false, 
		data:dataTmp,
		dataType: "json", 
		success : function(response){
			
			plus.nativeUI.closeWaiting();
			mui.toast("取消关注！");

			var count = response.json.data;
			if(undefined != count && null != count && "null" != count){
				fun(count,recId);
			}
		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('取消关注失败！');
		}
	});	
}

//日程关注回调
function focBackSch(count,recId){
	
	var focObj = document.getElementById("focusId");
	if(count != "0"){
		focObj.setAttribute("style","color:orangered;border-color: orangered;");
		focObj.innerHTML = '取消';
	}
	
    focObj.setAttribute("data-issup",count);
    
    refreshBack("foc_",recId,count,"1");
}
//日程取消关注回调
function cancleFocBackSch(count,recId){
	
	var focObj = document.getElementById("focusId");
	if(count == "0"){
		focObj.setAttribute("style","");
		focObj.innerHTML = '关注';
	}
	
    focObj.setAttribute("data-issup",count);
    
    refreshBack("foc_",recId,count,"0");
}

//更新前一页面相关数据
function refreshBack(type,recId,val,opFlag){
  	  if(!backPage){
//	  	alert("页面还未准备好，请稍后...");
	  	return false;
	  }
	  mui.fire(backPage,'BACK_REFRESH_EVENT_',{
	    type:type,
	    val:val,
	    recId:recId,
	    flag:opFlag
	  });
}
