var nowFontSize = 8;
Array.prototype.contains = function(needle) {
	for(i in this) {
		if(this[i] == needle) return true;
	}
	return false;
}

var appConfig = {

	//ui加载完成调用
	uiReady: function() {
		//详情
		document.getElementById('goInfo').addEventListener('tap',function(){
			var cn = document.getElementById('custName').innerText;
			var type = document.getElementById('goInfo').getAttribute('data-type');
			var url = 'priCustomerDetail.html?custName='+encodeURIComponent(cn);
			if(type==1){
				//公司信息
				url = 'comCustomerDetail.html?custName='+encodeURIComponent(cn);
			}
			
			_App.util.goPage(url);
		});
		//图谱
		document.getElementById('goAtlas').addEventListener('tap',function(){
			var cn = document.getElementById('custName').innerText;
			var type = document.getElementById('goAtlas').getAttribute('data-type');
			var url;
			if(type==1){
				//公司 （对公图谱）
				url = 'atlass.html?custName='+encodeURIComponent(cn)+'&type=1';
			}else{
				url = 'atlass.html?custName='+encodeURIComponent(cn)+'&type=2';
			}
			encodeURI(url);
			_App.util.goPage(url);
		});
		
		var _height=document.body.scrollHeight;
		document.getElementById('main1').style.height=_height+"px";
		chart1();
		
		
	},
	//设备资源加载完成调用
	deviceReady: function() {
		
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function chart1() {

	var myChart = echarts.init(document.getElementById('main1'));

	myChart.showLoading();
	myChart.hideLoading();

	option = {
		tooltip: {
			show:false,
	        trigger: 'item',
	        formatter: function(params){
	        	return params.data.id;
	        	
	        }
	   },
		legend: {
			data: personCategory.map(function(a) {
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
					textStyle: {
						fontSize: nowFontSize
					}
				},
				emphasis:{
					show:true
					
				}
			},
			data: personData.map(function(node, idx) {
				node['value'] = '10';
				node['symbolSize'] = '11';
				node.id=idx;
				if(node.r==1||node.r==0){
					node['name']=''
				}
				if(idx == 0) {
					node['symbolSize'] = 20;
				}
				if(node.r == 1) {
					node['symbolSize'] = 15;
				}
				return node;
			}),
			categories: personCategory,
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
			links:personLink.map(function(data){
				if(data.relation){
					data['label']={
						normal:{
							show:true,
							textStyle: {
								fontSize: nowFontSize
							},
							formatter:data.relation
						}
					}
					
				}
				return data;
			})
		}]
	};
	myChart.setOption(option);
	myChart.on('click',function(data){
		var d = data.data;
		if(d.r>1){
			if(d.type==1){
				document.getElementById('company').style.display="block";
				document.getElementById('custName').innerHTML=d.name;
				document.getElementById('customer').style.display="none";
			}else{
				document.getElementById('company').style.display="none";
				document.getElementById('customer').style.display="block";
			}
			document.getElementById('goInfo').setAttribute('data-type',d.type);
			document.getElementById('goAtlas').setAttribute('data-type',d.type);
			mui("#myPopver").popover('show');			
		}
	})
	
	//字体缩放
	var myTime=null;
	myChart.on('graphRoam',function(data){
		if(data.zoom){
			nowFontSize = data.zoom*nowFontSize;
			if(myTime)
				clearTimeout(myTime);
			myTime=setTimeout(function(){
				option.series[0].label.normal.textStyle.fontSize=nowFontSize;
				var tmpLink = personLink.map(function(data){
					if(data.relation){
						data.label.normal.textStyle.fontSize=nowFontSize;
					} 
					return data;
				});
				option.series[0].links=tmpLink;
				myChart.setOption(option);
			},150);
		}
		
	});
	
	
}