var img = [
"../../../themes/default/images/temp/temp_01.gif",
"../../../themes/default/images/temp/temp_02.gif",
"../../../themes/default/images/temp/temp_03.gif",
"../../../themes/default/images/temp/temp_04.gif",
"../../../themes/default/images/temp/temp_05.gif",
"../../../themes/default/images/temp/temp_06.gif",
"../../../themes/default/images/temp/temp_07.gif",
"../../../themes/default/images/temp/temp_08.gif"
];
var muiCard1 = document.getElementById("muiCard1").children[0].children;
var muiCard2 = document.getElementById("muiCard2").children[0].children;
var muiCard3 = document.getElementById("muiCard3").children[0].children;
var pageQuery = null;
var sortName = "更新时间";
var condition={
	custName:"",
	custStat:"",
	custType:"",
	orderBy:sortName
};
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false, 
	//分页配置
	pageInfoConfig: {
		url: basePath + 'mobileCustomerQuery.json?conditions=' + encodeURIComponent(encodeURIComponent(JSON.stringify(condition))), //查询URL
//		url: {demoData: customerData}, 						 //本地demo数据模式
		pageSize: 10,							 //分页大小
		scrollerId: 'pullrefresh',              //mui滚动区域div的ID
		ulId: 'ulId',                  		 //ul的ID
		getCondition: function () {			 //获取查询条件方法
			return condition;//查询条件
		},
		success: function(response){			 //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('ulId');
			if(data.length>0){
				for (var i = 0; i < data.length; i++) {
					var imgsrc = "";
					var num = Math.round(Math.random()/2*10);
					if(data[i].TYPE=="企业"){
						imgsrc = "../../../images/cbd.jpg";
					}else{
						imgsrc = img[num];
					}
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = '<a class="mui-navigate-right" href="'+data[i].TYPE+','+data[i].CUST_NAME+','+data[i].POTENTIAL_FLAG+','+data[i].CUST_ID+'">'
					//li.innerHTML = '<a class="mui-navigate-right" href="javascript:alert(\'fff\');">'
									+ '<img class="mui-media-object mui-pull-left" src="'+imgsrc+'">'
									+ '<div class="mui-media-body">'+data[i].CUST_NAME
									+ '<p class="mui-ellipsis">'+data[i].TYPE+'</p>'
									+ '</div>'
									+ '</a>';
					table.appendChild(li);
				}
				mui('#ulId').off('tap','a');
				mui('#ulId').on('tap', 'a', function() {	
					var hrefMes = this.getAttribute('href').split(",");
					var custNo = hrefMes[0];
					var custName = hrefMes[1];
					var potentialFlag = hrefMes[2];
					var custId = hrefMes[3];
					plus.storage.removeItem("custNameUseCustView");
					plus.storage.setItem("custNameUseCustView",custName);
					if(custNo=="企业"){
						_App.util.goPage('../comCustView.html?potentialFlag='+potentialFlag+'&custId='+custId,{pageId:"comCustView_id",refresh:true});
					}else{
						_App.util.goPage('../priCustView.html?potentialFlag='+potentialFlag+'&custId='+custId,{pageId:"priCustView_id",refresh:true});
					}
				});
			}else{
				var div = document.createElement('div');
				div.innerHTML="暂无数据";
				div.style.marginLeft="40%";
				div.style.marginTop="60%";
				var divs = document.getElementById("pullrefresh");
				divs.appendChild(div);
			}
		},
		error: function(){						//失败回调方法
			mui.alert('error!');
		}
	},
	//ui加载完成调用
	uiReady: function() {
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		//alert('deviceReady');
		pageQuery = _App.scroller;
	   	if(pageQuery) {
	   		pageQuery.pulldownRefresh();//下拉刷新
	   	}
	}
};

_App.init(appConfig);


function goSearch() {
	_App.util.goPage('../mycustomers/search.html');
}

function searchData(){
	_mask.close();
	hideSearchSlider();
	var custType = "";
	var custStat = "";
	for(var i=0;i<muiCard1.length;i++){
		if(muiCard1[i].children[1].checked == true){
			custStat = custStat+muiCard1[i].children[1].value+",";
		}
	}
	for(var i=0;i<muiCard3.length;i++){
		if(muiCard3[i].children[1].checked == true){
			custType = custType+muiCard3[i].children[1].value+",";
		}
	}
	condition = {
		custName:custName.value,
		custStat:custStat,
		custType:custType,
		orderBy:sortName
	};
	appConfig.pageInfoConfig.url = basePath + 'mobileCustomerQuery.json?conditions=' + JSON.stringify(condition);
	_App.init(appConfig);
	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}
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
	searchData();
};

//清空选项
function clearAll(){
	for(var i=0;i<muiCard1.length;i++){
		if(muiCard1[i].children[1].checked == true){
			muiCard1[i].children[1].checked = false;
		}
	}
	for(var i=0;i<muiCard3.length;i++){
		if(muiCard3[i].children[1].checked == true){
			muiCard3[i].children[1].checked = false;
		}
	}
	for(var i=0;i<muiCard2.length;i++){
		if(muiCard2[i].children[1].checked == true){
			muiCard2[i].children[1].checked = false;
		}
	}
	document.getElementById("checkedCount1").innerHTML = 0;
	document.getElementById("checkedCount2").innerHTML = 0;
	document.getElementById("checkedCount3").innerHTML = 0;
}

mui('#muiCard1').on('change','form>div>input',function(){
	var count = 0;
	for(var i=0;i<muiCard1.length;i++){
		if(muiCard1[i].children[1].checked == true){
			count++;
		}
	}
	document.getElementById("checkedCount1").innerHTML = count;
});

mui('#muiCard2').on('change','form>div>input',function(){
	var count = 0;
	for(var i=0;i<muiCard2.length;i++){
		if(muiCard2[i].children[1].checked == true){
			count++;
		}
	}
	document.getElementById("checkedCount2").innerHTML = count;
});

mui('#muiCard3').on('change','form>div>input',function(){
	var count = 0;
	for(var i=0;i<muiCard3.length;i++){
		if(muiCard3[i].children[1].checked == true){
			count++;
		}
	}
	document.getElementById("checkedCount3").innerHTML = count;
});
