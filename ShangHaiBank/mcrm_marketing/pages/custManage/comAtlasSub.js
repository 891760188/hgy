/**
 *author：yh
 *time：2017年3月15日10:26:08
 *mail：yangheng2
 *  
 * 修改echarts的关系源码，在它的功能上新增多圆关系
 * 配置项
 * circle：more表示 3个圆（包括圆心）
 * 数据项 data中 需要 在每个node节点中定义当前点所在层级 用r表示：0表示圆心，1表示内圈 2，表示外圈
 */
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i] == needle) return true;
	}
	return false;
}
var appConfig = {
	
	//ui加载完成调用
	uiReady: function() {
		var _height=document.body.scrollHeight;
		document.getElementById('main1').style.height=_height+"px";
		chart2();
		document.getElementById('goInfo').addEventListener('tap',function(){
			var cn = document.getElementById('custName').innerText;
			var url = 'comCustomerDetail.html?custName='+encodeURIComponent(cn);
			_App.util.goPage(url, {
				pageId: 'comCustomerDetail.html_id',
				refresh: true
			});
		});
		document.getElementById('goAtlas').addEventListener('tap',function(){
				plus.nativeUI.showWaiting('加载中...');
				setTimeout(function(){
					mui("#myPopver").popover('hide');
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().reload();
				},1500);
			});
	},
	//设备资源加载完成调用
	deviceReady: function() {
		 plus.screen.unlockOrientation();	
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function chart2() {
	
	var myChart = echarts.init(document.getElementById('main1'));
	
	myChart.showLoading();
	myChart.hideLoading();
	
	option = {
		legend: {
			data: categories.map(function(a) {
					return a.name;
				}) //此处的数据必须和关系网类别中name相对应
		},
		animationDurationUpdate: 1500,
		animationEasingUpdate: 'quinticInOut',
		series: [{
			type: 'graph',
			layout: 'circular',
			circle: "more",
			circular: {
				rotateLabel: true
			},
			animation: true,
			label: {
				normal: {
					show: true,
					position: 'top',
					textStyle:{
						fontSize:10
					}
				}
			},
			data: demoData.map(function(node, idx) {
				node['value'] = '10';
				node['symbolSize']='11';
				if(idx == 0) {
					node['symbolSize'] = 20;
				}
				if(node.r == 1) {
					node['symbolSize'] = 15;
				}
				return node;
			}),
			categories: categories,
			roam: true,
			lineStyle: {
				normal: {
					color: 'source',
					curveness: -0.1
				}
			},
			force: {
				edgeLength: 95, //连线的长度
				repulsion: 40 //子节点之间的间距
			},
			links: links
		}]
	};
	myChart.setOption(option);
	myChart.on('click',function(param){
		var _IsNode = param.dataType=='node'?true:false;
		if(_IsNode){
			var data = param.data;
			if(data.r!=1){
				if(!data.isPerson){
					document.getElementById('custName').innerHTML=data.name;
					mui("#myPopver").popover('show');
				}
				
			}
		}
	});
	
				
}
window.addEventListener('resize',function(){
	var _height=document.body.scrollHeight;
		document.getElementById('main1').style.height=_height+"px";
		chart2();
});

