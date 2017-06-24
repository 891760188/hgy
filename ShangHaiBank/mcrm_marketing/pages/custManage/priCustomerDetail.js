var jdata = {
	json: {
		data: [{
			chartId: 1,
			title: "存款分布",
			name: "存款分布",
			option: {
					title : {
				        text: '存款分布',
				        x:'center',
			            padding:[10,0,0,0],
				        textStyle:{
				        	color:'#666',
				        	fontWeight:'normal',
				        	fontSize:14
				        }
			    	},
			    	tooltip: {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c}"
				    },
			    	legend: {
			    		left: "center", 
			    		bottom:"30",
			    		data: ['活期存款','定期存款', '理财产品','基金']
			    	},
			    	color: _chartsColors,
			    	series : [{
			    		name: "存款分布",
			    		type: "pie",
			    		radius: [0,'55%'],
			    		center: ["50%", "50%"],
			    		
				        itemStyle: {
							emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
				        },
				        label:{normal:{show:false}},
				        data: [
				        	{value:335, name:'活期存款'},
		                	{value:310, name:'定期存款'},
		                	{value:234, name:'理财产品'},
		                	{value:135, name:'基金'}
				        ]
				    }]
			}
		}, {
			chartId: 2,
			title: "贷款情况",
			name: "贷款情况",
			option: {
				tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c}元" 
				},
				legend: {
					orient: "horizontal",
					left: "center",
					data: ['贷款情况']
				},
				color: _chartsColors,
				tooltip : {
			        trigger: 'axis',
			        axisPointer : {            
			            type : 'shadow' ,    
			        }
			    },
				xAxis: [{
					type: "category",
					data: ['住房贷款', '汽车贷款', '消费贷款', '其它'],
					splitLine:{ 
                               show:true
              },
				}],
				series: [{
					name: "贷款情况",
					data: [8.0, 14.9, 7.0, 2.2],
					type: "bar"
				}],
				animation: false,
				grid: {
					left: "80",
					right: "20",
					bottom:"30"
				},
				yAxis: [{
					axisLabel: {
						formatter: "{value} 元"
					}
				},]
			}
		}]
	}
};
var custName__ = "";
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		showCharts();
		//界面加载好之后重新滚动
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		custName__ = plus.storage.getItem("custNameUseCustView");
		if(scanName && scanName != "undefined"){
			scanName = decodeURIComponent(scanName);
			document.getElementById("custNameId").innerHTML = scanName;
		}else if(custName__ && custName__ != "undefined")
			document.getElementById("custNameId").innerHTML = custName__;
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);


function showCharts(){
	var byId = function(id) {
		return document.getElementById(id);
	};

	var idAll = '';
	var data = jdata.json.data;
	var table = document.getElementById('fxchartId');
	var chartHtml = '';
	for(var i = 0; i < data.length; i++) {
		chartHtml += '<div class="card">';
		chartHtml += '<div class="chart" id="cha' + i + '"></div>';
		chartHtml += '<div class="mui-content-padded">';
		chartHtml += '<ul data-ct="cha' + i + '" class="mui-pager">';
		chartHtml += '</ul>';
		chartHtml += '</div>';
		chartHtml += '</div>';
		idAll = idAll + 'cha' + i + '-';
	}
	table.innerHTML = chartHtml;
	var ids = idAll.split('-');
	setTimeout(function() {
		//加载图表
		for(var j = 0; j < ids.length - 1; j++) {
			var gauge = echarts.init(byId(ids[j])); //cha0,cha1,cha2
			var num = parseInt(ids[j].split('cha')[1]); //0,1,2
			gauge.setOption(data[num].option);
			gauge.myId = "cha" + j;
		}
	}, 500);
}


window.addEventListener("refrashPriCustDetailEve",function(event){
	var act = event.detail.act;
	if(act == "refresh"){
		showCharts();
	}
});

var doShare = function(){
	var potentialFlag = _App.util.getUrlParamByName('potentialFlag');
	var custId = _App.util.getUrlParamByName('custId');
	var currentId = plus.webview.currentWebview().id;
	var sign;
	if(potentialFlag != '1'){
		sign = 'XTYX';
	}else{
		sign = 'KHZJ';
	}
	cutScreen("baseInfoId", function(data) {
		plus.storage.removeItem("_shareImgPath_")
		plus.storage.setItem("_shareImgPath_", data);
		var url = "../finding/share/share.html?cwebviewObjId=" + currentId + "&bizType="+sign+"&bizId=" + custId;
		_App.util.goPage(url, {
			pageId: 'share_id',
			refresh: true
		});
	});
}
