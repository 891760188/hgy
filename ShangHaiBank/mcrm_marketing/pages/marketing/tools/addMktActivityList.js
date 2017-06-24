var condition;
var approveStat = ['','未提交','审批中','审批通过','审批不通过'];//营销活动审批状态
var marketState = ['','暂存','已提交','执行中','正常关闭','到期关闭','已退回'];//营销活动状态
var sortName = "创建时间";
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		url: basePath + 'marketActivityAction.json?conditions=' + JSON.stringify(condition), //查询URL
//		url: {demoData: customerData}, 						 //本地demo数据模式
		pageSize: 10,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return "a=1&b=2";//查询条件
		},
		success: function(response){			 //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('ulId');
			if(data.length>0){
				for (var i = 0; i < data.length; i++) {
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					ul.innerHTML = 	'<li id="'+data[i].MKT_ACTI_ID+'" class="mui-table-view-cell toolHover">'
									+'<a class="mui-navigate-right ys-list-cell">'
									+'<span class="ys-lcRMin">'+approveStat[data[i].MKT_APP_STATE]+'</span>'
									+'<span><b><font>'+data[i].MKT_ACTI_NAME+'</font></b>（'+marketState[data[i].MKT_ACTI_STAT]+'）</span>'
									+'<span class="ys-lcLeft">创建人：'+data[i].USER_NAME+'</span>'
									+'<span class="ys-lcRight">创建时间：'+data[i].CREATE_DATE+'</span>'
									+'<span class="ys-lcLeft1">计划时间：'+data[i].PSTART_DATE+' 到 '+data[i].PEND_DATE+'</span>'
									+'<span class="ys-lcLeft1">费用预算：'+data[i].MKT_ACTI_COST+'</span>'
									+ '</a>'
									+'</li>'
					table.appendChild(ul);
				}
			}else{
				var div = document.createElement('div');
				div.innerHTML='没有相关数据';
				div.style.marginLeft = "40%";
				div.style.marginTop = "50%";
				table.appendChild(div);
			}
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
		//alert('deviceReady');
		var pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.loadData(true);//flag :true 下拉;false 上拉
	   	}
		YSUI.SuperBt();			
	}
};

_App.init(appConfig);

//根据筛选条件查询
function search(){
	if(sign_select1.value=="" && sign_select2.value!=""){
		mui.alert('请选择开始时间！','提示');
	}else{
		hideSearchSlider();
		_mask.close();
		var wt = plus.nativeUI.showWaiting();
		var statu;
		if(statu == 0){
			statu="";
		}
		condition = {
			custName: custName.value,
			statu: statu,
			createName: createName.value,
			startDate: startDate.value,
			endDate : endDate.value,
			orderBy:sortName
		};
		appConfig.pageInfoConfig.url = basePath + 'marketActivityAction.json?conditions=' + JSON.stringify(condition);
		_App.init(appConfig);
		var pageQuery = _App.scroller;
		if (pageQuery) {
			pageQuery.loadData(true); //flag :true 下拉;false 上拉
			wt.close();
		}
	}
}

//清空筛选条件
function clearAll(){
	custName.value = "";
	statu.value = 0;
	createName.value = "";
	startDate.value = "";
	endDate.value = "";
}

//排序条件选择
function subOrder(o){
	var _mr=document.getElementsByClassName('mc-order');
	for(var i=0;i<_mr.length;i++){			
		_mr[i].querySelector('input').checked=false;
	}
	sortName = document.getElementsByClassName('mui-control-item')[2]
	.querySelector('span').innerHTML=o.querySelector('label').innerHTML.substring(1,5);
	o.querySelector('input').checked=true;
	search();
};

function addMktActivity(){
	_App.util.goPage('addmktActivity.html', "none");
}

//新增，修改，删除后刷新
window.addEventListener('paramBackEvent__',function(event){
	//通过event.detail可获得传递过来的参数内容
	appConfig.pageInfoConfig.url = basePath + 'marketActivityAction.json?conditions=' + JSON.stringify(condition);
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
});