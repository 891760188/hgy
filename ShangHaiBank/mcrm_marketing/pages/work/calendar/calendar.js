$(function() {    
//  FastClick.attach(document.getElementById("myId"));
});
var currentViewId;//当前视图id
var conDateShow = '';
var SCHEDULE_TYPE="SCHEDULE";
var cuYearForSelect_ = "";
var scheduleStorage = [];
//App配置信息
 
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置 
	pageInfoConfig: {
		url: basePath + 'ScheduleAction!index.json', //查询URL
		pageSize: 4,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){
			var data = response.json.data;
			var table = document.getElementById('ulId');
			for (var i = 0; i < data.length; i++) {
				var dTmp = data[i];
				if(undefined == dTmp || null == dTmp || "" == dTmp){
					break;
				}
				var ul = document.createElement('ul');
				ul.className = 'mui-table-view mui-table-view-group';
				
				var isKey = dTmp.IS_KEY;
				var scdId = dTmp.SCH_ID;
				var uId = dTmp.USER_ID;
				var cont = dTmp.SCH_CONTENT;
				var startTime = dTmp.START_TIME;
				var endTime = dTmp.END_TIME;
				var title = dTmp.SCH_TITLE;
				
				var supCount = dTmp.SUP_COUNT;
				var focCount = dTmp.FOC_COUNT;
				var commCount = dTmp.COMM_COUNT;
                var isSup = dTmp.IS_SUP;
                ul.innerHTML = '<li class="mui-table-view-cell" id="li_'+scdId+'">'
                
				                + '<a class="mui-navigate-right" scdId="'+scdId+'">'
				                + '<b class="tagTips c1 showKeyFlag_'+isKey+'">重要</b>'+title
				                + '<p>时间：'+startTime+' 至 '+endTime+'</p>'
				                + '</a>'
				                
								+'<div class="mui-table-view-cell-bt find-button">'
								+'<button class="icon-share2 share"  id="share_'+scdId+'">分享</button>'
								+'<button class="icon-bubble3" data-val="'+scdId+'" id="comm_'+scdId+'">评论('+commCount+')</button>'
								+'<button class="zan icon-line-131 sup_state_'+isSup+'" data-issup="'+isSup+'" id="sup_'+scdId+'">赞</button>'
								+'<button class="hehe icon-line-133" data-issup="'+focCount+'" id="foc_'+scdId+'">关注 </button>'
								+'</div>'
								+'</li>';
				table.appendChild(ul);
				if(focCount.trim() != "0"){
					var focObj = document.getElementById("foc_"+scdId);
//					focObj.setAttribute("style","color:orangered;border-color: orangered;");
					focObj.classList.remove('icon-line-133');
					
					focObj.classList.add('icon-line-1134');
					focObj.classList.add('iconBlue');
					focObj.innerHTML = '取消';
				}
				
				if(supCount.trim() != "0"){
					var focObj = document.getElementById("sup_"+scdId);
					focObj.setAttribute("style","color:orangered;border-color: orangered;");
					focObj.classList.remove('icon-line-131');
					focObj.classList.add('icon-line-132');
					focObj.classList.add('iconBlue');
					focObj.innerHTML = '取消';
				}
				
			}
			mui('.mui-table-view-cell').on('tap','.mui-navigate-right',function(){
				var scdId = this.getAttribute('scdId');
				goToDetail(scdId);
				
			})
			initOpr();
		},
		error: function(){						//失败回调方法
			alert('error!');
		}
	},
	//ui加载完成调用
	uiReady: function() {
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
	}
};
var numBack = function(a,b){
	var count = 0;
	while(a.indexOf(b) != -1){
		a = a.replace(b,'');
		count++;
	}
	return count;
}

function initOpr(){
	 	//评论
	   mui('.mui-table-view-cell-bt').on('tap', '.icon-bubble3', function() {
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
	   	  showPrompt(this);
		});	
	   //点赞	
       mui('.mui-table-view-cell-bt').on('tap', '.zan', function() {
       	    var id = this.getAttribute("id");
       	    var lenth = id.length;
       	    var idTmp = id.substring(4,lenth); 
       	    var isSup = this.getAttribute("data-issup");
			
			if(isSup == "0"){//点赞
				this.setAttribute("style","color:orangered;border-color: orangered;");
				doSuppport(this,SCHEDULE_TYPE,idTmp,supBackSch);
				this.innerHTML = "取消";
			}else{
				this.setAttribute("style","");
				cancleSupport(this,SCHEDULE_TYPE,idTmp,cancleSupBackSch);
				this.innerHTML = "赞";
			}

		});	
		mui('.mui-table-view-cell-bt').on('tap', '.hehe', function() {
			var id = this.getAttribute("id");
			if(this.classList == "hehe icon-line-133"){
				this.classList.remove('icon-line-133');
				this.classList.add('icon-line-1134');
				this.classList.add('iconBlue');
				this.innerHTML = "取消";
			}else{
				this.classList.remove('icon-line-1134');
				this.classList.remove('iconBlue');
				this.classList.add('icon-line-133');
				this.innerHTML = "关注";
			}
       	    var lenth = id.length;
       	    var idTmp = id.substring(4,lenth);
			
			var isSup = this.getAttribute("data-issup");
			
			if(isSup == "0"){
				doFocus(this,SCHEDULE_TYPE,idTmp,focBackSch);
			}else{
				cancleFocus(this,SCHEDULE_TYPE,idTmp,cancleFocBackSch);
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

//_App.init(appConfig);

function initSchedule(currD){
	
	var condition = {};//查询条件
	condition.currMonth = getCurrDateStr(3,'',currD);
	_App.ajax({
    	type : "get",
  		url :basePath + 'ScheduleAction!index.json?conditions='+JSON.stringify(condition),
		data:{},
 		cache: false,
   		dataType: "json",
   		success : function(response){
   			
   			var data = response.json.data;
   			if(data.length > 0){
   				for(var i = 0; i < data.length; i++){  
   					var dTmp = data[i];
					if(undefined == dTmp || null == dTmp || "" == dTmp){
						break;
					}
					
					var isKey = dTmp.IS_KEY;
					var scdId = dTmp.SCH_ID;
					var uId = dTmp.USER_ID;
					var cont = dTmp.SCH_CONTENT;
					var startTime = dTmp.START_TIME;
					var endTime = dTmp.END_TIME;
					var title = dTmp.SCH_TITLE;
					
					var tFlag = initCurrData(startTime,endTime,currD);
					
					//已经布满整个日历，则直接退出
					if(tFlag)
					   return false;

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

function initSchList(condition){
	plus.nativeUI.showWaiting("正在加载...");
	appConfig.pageInfoConfig.url =  basePath + 'ScheduleAction!index.json?conditions='+JSON.stringify(condition);//查询URL
	_App.init(appConfig);
	
	var pageQuery = _App.scroller;
   	if(pageQuery) {
   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
   	}
   	plus.nativeUI.closeWaiting();
}


//更新关注和点赞
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
				var idTmp = "sup_"+schId;
				var objTmp = document.getElementById(idTmp);
				var oldNum = objTmp.getAttribute("data-val");
			    var newNum = 1+ parseInt(oldNum);
				objTmp.setAttribute("data-val",newNum);
				objTmp.innerHTML = '赞（'+newNum+'）';
				mui.toast('点赞+1');
			}else if(type == 1){//关注
				var objTmp = document.getElementById("foc_"+schId);
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


//初始化当前日历数据
function initCurrData(startD,endD,currD){
	var execFlag = false;
	document.getElementById("ulId").innerHTML = "";
	
	if(undefined != currD && "" != currD 
	    && undefined != startD && "" != startD
	    && undefined != endD && "" != endD){
	    	
	    var startPStr = returnSpd('',startD);
		var endPStr = returnSpd('',endD);
		var currPStr = returnSpd('',currD);
		
		var tmpStart = startD.split(startPStr);
		var tmpEnd = endD.split(endPStr);
		var tmpCurr = currD.split(currPStr);
		
		var yearStart = parseInt(tmpStart[0]);
		var monthStart = parseInt(tmpStart[1]);
		var dayStart = parseInt(tmpStart[2].split(" ")[0]);
		
		var yearEnd = parseInt(tmpEnd[0]);
		var monthEnd = parseInt(tmpEnd[1]);
		var dayEnd = parseInt(tmpEnd[2].split(" ")[0]);
		
		var yearCurr = parseInt(tmpCurr[0]);
		var monthCurr = parseInt(tmpCurr[1]);
		var dayCurr = parseInt(tmpCurr[2]);
		
		var jcObj = document.getElementById("myId");
		if(yearCurr == yearStart && yearCurr == yearEnd){
			if(monthEnd > monthCurr && monthStart < monthCurr){
				  var  day = new Date(yearCurr,monthCurr,0); 
				  var daycount = day.getDate();
				  
				  for(var d = 1;d<=daycount;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
				  execFlag = true;//已经初始化日历
			}else if(monthEnd > monthCurr && monthStart == monthCurr){
				  var  day = new Date(yearCurr,monthCurr,0); 
				  var daycount = day.getDate();
				  
				  for(var d = dayStart;d<=daycount;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
			}else if(monthEnd == monthCurr && monthStart < monthCurr){
				 
				  for(var d = 1;d<=dayEnd;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
			}else if(monthEnd == monthCurr && monthStart == monthCurr){
				  
				  for(var d = dayStart;d<=dayEnd;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
			}
		}else if(yearCurr > yearStart && yearCurr < yearEnd){
			  var  day = new Date(yearCurr,monthCurr,0); 
			  var daycount = day.getDate();
			  
			  for(var d = 1;d<=daycount;d++){
			  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
			  	
			  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
			    var htmlTmp = jcObj.innerHTML;
			    jcObj.innerHTML = htmlTmp+addNodeHtml;
			  }
			  execFlag = true;//已经初始化日历
		}else if(yearCurr > yearStart && yearCurr == yearEnd){
			if(monthEnd == monthCurr){
				 
				  for(var d = 1;d<=dayEnd;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
			}else if(monthEnd > monthCurr){
				  var  day = new Date(yearCurr,monthCurr,0); 
				  var daycount = day.getDate();
				  
				  for(var d = 1;d<=daycount;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
				  execFlag = true;//已经初始化日历
			}
		}else if(yearCurr = yearStart && yearCurr < yearEnd){
			if(monthStart == monthCurr){
				  var  day = new Date(yearCurr,monthCurr,0); 
				  var daycount = day.getDate();
				  
				  for(var d = monthStart;d<=daycount;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
			}else if(monthStart < monthCurr){
				  var  day = new Date(yearCurr,monthCurr,0); 
				  var daycount = day.getDate();
				  
				  for(var d = 1;d<=daycount;d++){
				  	var dayTmp = d+"/"+monthCurr+"/"+yearCurr;
				  	
				  	var addNodeHtml = '<div class="added-event" data-date="'+dayTmp+'" data-time="8:45" data-title=""></div>';
				    var htmlTmp = jcObj.innerHTML;
				    jcObj.innerHTML = htmlTmp+addNodeHtml;
				  }
				  execFlag = true;//已经初始化日历
			}
		}
		
	 }
	    
	return execFlag;
	
}

//初始化上一月、下一月按钮事件
function initPreAndNextEvent(){
	//上一个月
    $('#myId').on('tap', '.prv-m', function(){
    	plus.nativeUI.showWaiting("正在处理...");
    	var tmpDay = $('#myId').find('.day')[7].getAttribute("data-date");
    	var currDay = getCurrDateStr(7,"/",tmpDay);
		
		document.getElementById("myId").innerHTML = "";
	    //初始化日历
        initSchedule(currDay);
	    
		$('#myId').jalendar({
	        customDay: currDay,  // Format: Year/Month/Day
	        color: '#ea5404', // Unlimited Colors
	        lang: 'ZH-CN' // Format: English — 'EN', Chinese-'ZH-CN'
	    });

	    //更新数据
	    $('#myId').on('tap', '.day', function(){
	    	
        	var currDay = $(this).attr('data-date');
        	var condition = {};
			condition.currDay = getCurrDateStr(6,'',currDay);
			
			initSchList(condition);
        	
        });
        
         plus.nativeUI.closeWaiting();
    	
    });
    
    //下一个月
    $('#myId').on('tap', '.nxt-m', function(){
    	plus.nativeUI.showWaiting("正在处理...");
    	var tmpDay = $('#myId').find('.day')[7].getAttribute("data-date");
    	var currDay = getCurrDateStr(7,"/",tmpDay);
		//alert(currDay);
		
		document.getElementById("myId").innerHTML = "";
	    //初始化日历
        initSchedule(currDay);
	    
		$('#myId').jalendar({
	        customDay: currDay,  // Format: Year/Month/Day
	        color: '#ea5404', // Unlimited Colors
	        lang: 'ZH-CN' // Format: English — 'EN', Chinese-'ZH-CN'
	    });

	    //更新数据
	    $('#myId').on('tap', '.day', function(){
	    	
        	var currDay = $(this).attr('data-date');
        	var condition = {};
			condition.currDay = getCurrDateStr(6,'',currDay);
			
			initSchList(condition);
        	
        });
        
    	 plus.nativeUI.closeWaiting();
    });
    
    
    //选择年
    $('#myId').on('tap', '.header h1', function(){
    	var cuD = this.innerHTML;
    	var cY = cuD.split("月")[1].trim();
    	
    	cuYearForSelect_ = cY;
    	showDatePanel(cY);
  
    	mui('#popover3').popover('toggle');
    	//$this.find('.header h1').html(monthNames[settings.lang][month] + ' ' + year);
    })

}

//年份选择面板初始化
function showDatePanel(cY){
	var sNum = parseInt(cY) - 4;
	var eNum = parseInt(cY) + 4;
	var obj = document.getElementById("li_data_select");
	obj.innerHTML = "";
	var div;
	for(var i = sNum;i<=eNum;i++){
		div = document.createElement("div");
		div.className = "selectDateList";
		div.setAttribute("lastY",sNum);
		div.setAttribute("nearY",eNum);
		div.innerHTML = i;
		
		div.addEventListener("tap",function(){
			var cYear = this.innerHTML;
			mui('#popover3').popover('toggle');
			
			plus.nativeUI.showWaiting();
	    	var tmpDay = "01/01/"+cYear;
	    	var currDay = getCurrDateStr(7,"/",tmpDay);
			document.getElementById("myId").innerHTML = "";
			document.getElementById("ulId").innerHTML = "";
			
		    //初始化日历
	        initSchedule(currDay);
		    
			$('#myId').jalendar({
		        customDay: currDay,  // Format: Year/Month/Day
		        color: '#ea5404', // Unlimited Colors
		        lang: 'ZH-CN' // Format: English — 'EN', Chinese-'ZH-CN'
		    });
	
		    //更新数据
		    $('#myId').on('tap', '.day', function(){
		    	
	        	var currDay = $(this).attr('data-date');
	        	var condition = {};
				condition.currDay = getCurrDateStr(6,'',currDay);
				
				initSchList(condition);
	        	
	        });
	        
	    	 plus.nativeUI.closeWaiting();
			
		});
		obj.appendChild(div);
	}
}

//前一页日期
function preYearSelect(){
	var newY = parseInt(cuYearForSelect_) - 8;
	cuYearForSelect_ = newY;
	showDatePanel(newY);
}

//后一页日期
function nextYearSelect(){
	var newY = parseInt(cuYearForSelect_) + 8;
	cuYearForSelect_ = newY;
	showDatePanel(newY);
}

function goToDetail(schId){
	if(undefined != schId && "" != schId){
		 _App.util.goPage('scheduleDetail.html?schId='+schId, 
		                  {refresh:true,pageId:'work/scheduleDetail.html'});
	}
}

//日期格式转换，工具函数
function getCurrDateStr(type,spd,currD){
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth()+1;
	var day = myDate.getDate();
	if(type == 0){//获得年月日
		return year+spd+returnDateF(month)+spd+returnDateF(day);
	}else if(type == 1){
		return year+spd+returnDateF(month);
	}else if(type == 3 && undefined != currD && "" != currD){//获得给定日期的当前年月
		var spStr = returnSpd(spd,currD);
		
		var tmpD = currD.split(spStr);
		
		return tmpD[0]+"-"+returnDateF(tmpD[1]);
		
	}else if(type == 4 && undefined != currD && "" != currD){//获得给定日期的当前年月日
		var spStr = returnSpd(spd,currD);
		
		var tmpD = currD.split(spStr);
		
		return tmpD[0]+"-"+returnDateF(tmpD[1])+"-"+returnDateF(tmpD[2]);
		
	}else if(type == 5 && undefined != currD && "" != currD){//获得给定日期的下一月
		var spStr = returnSpd(spd,currD);
		var tmpD = currD.split(spStr);	
		var yearT = tmpD[0];
		var monthT = tmpD[1];
		
		var year2 = yearT;
	    var month2 = parseInt(monthT) + 1;
	    if (month2 == 13) {
	        year2 = parseInt(year2) + 1;
	        month2 = 1;
	    }
		return year2+"-"+returnDateF(month2);
		
	}else if(type == 6 && undefined != currD && "" != currD){//获得给定日期年月日，倒序
		var spStr = returnSpd(spd,currD);
		var tmpD = currD.split(spStr);
		
		return tmpD[2]+"-"+returnDateF(tmpD[1])+"-"+returnDateF(tmpD[0]);
		
	}else if(type == 2){//获得给定日期的前一月
		var year2 = year;
	    var month2 = parseInt(month) - 1;
	    if (month2 == 0) {
	        year2 = parseInt(year2) - 1;
	        month2 = 12;
	    }
		return year2+spd+returnDateF(month2);
	}else if(type == 7 && undefined != currD && "" != currD){//获得给定日期年月第一天，倒序
		var spStr = returnSpd(spd,currD);
		var tmpD = currD.split(spStr);
		
		return returnDateF(tmpD[2])+spStr+returnDateF(tmpD[1])+spStr+"01";
		
	}
}

//返回分隔符
function returnSpd(spd,currD){
	var spStr = "-"; 
	if(undefined != spd && "" != spd){
		spStr = spd;
	}else{
		if(currD.indexOf("/") != -1){
			spStr = "/";
		}
	}
	return spStr;
}

//日期补齐操作
function returnDateF(cDate){
	 var tmpStr = cDate; 
	 
     if(undefined != cDate && "" != cDate){
     	cDate = cDate+"";
     	if(cDate.trim().length == 1)
     	   tmpStr = "0"+cDate;
     }
     
     return tmpStr;
}

//评论 oprType "COMM"表示评论 其余表示回复
function commonSale() {

	var dataTmp = {};
	var commContent = document.getElementById("commonTent").value;

	if(commContent == null || commContent == "undefined" || commContent == ""){
		mui.alert("评论内容不能为空！");
		return;
	}
	
	if(commId == null || commId == "undefined" || commId == ""){
		mui.alert("请选择对应的记录！");
		return;
	}
	
    plus.nativeUI.showWaiting("正在保存...");
	dataTmp.oprType  = "" ;
	dataTmp.commContent  = encodeURI(commContent) ;
	dataTmp.recordId  = commId ;
	dataTmp.terminal  =  "android";
	dataTmp.typeId  =  "SCHEDULE";
	dataTmp.oprType = 'COMMENT',
	dataTmp.antDatas = JSON.stringify(scheduleStorage);

   //POST 方式与GET方式返回值方面是有差别的
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
				var commObj = document.getElementById("comm_"+commId);
	            commObj.innerText = "评论("+count+")";
			}

		},
		error:function(){
			plus.nativeUI.closeWaiting();
			mui.alert('评论失败！');
		}
	});	
		
}

var commId = "";
function showPrompt(obj){
	
	if(undefined != obj){
		commId = obj.getAttribute("data-val");
	}
	document.getElementById("commonTent").value = "";
	mui('#popover2').popover('toggle');//显示文本框
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

//日程点赞回调
function supBackSch(count,recId){
	
	var commObj = document.getElementById("sup_"+recId);
	commObj.className = "zan icon-line-132 sup_state_1 iconBlue";
	
//  commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","1");
}
//日程取消点赞回调
function cancleSupBackSch(count,recId){
	
	var commObj = document.getElementById("sup_"+recId);
	commObj.className = "zan icon-line-131 sup_state_0";
	
//  commObj.innerText = "赞("+count+")";
    commObj.setAttribute("data-issup","0");
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
	
	var focObj = document.getElementById("foc_"+recId);
	if(count != "0"){
		focObj.setAttribute("style","color:orangered;border-color: orangered;");
//		focObj.innerHTML = '取消';
	}
	
    focObj.setAttribute("data-issup",count);
}
//日程取消关注回调
function cancleFocBackSch(count,recId){
	
	var focObj = document.getElementById("foc_"+recId);
	if(count == "0"){
		focObj.setAttribute("style","");
//		focObj.innerHTML = '关注';
	}
	
    focObj.setAttribute("data-issup",count);
}

/**
 * 添加增加日历监听
 */
window.addEventListener('paramBackEvent__',function(){
	plus.webview.currentWebview().reload();
})

/*
 * 分享
 */
function doShare(bizId) {
//			var currentId = plus.webview.currentWebview().id;
		//跳转到分享界面
		var url = "../../finding/share/share.html?cwebviewObjId="+currentViewId+"&bizType=SCH&&bizId="+bizId;
		_App.util.goPage(url,{
			pageId:"share_id",
			refresh:true
		});
}

