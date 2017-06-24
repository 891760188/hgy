var customerData = {"json":{"data":{
	"pricust":[
		{address:"北京市朝阳区S50（五环）",time:"2015-10-02",type:"QQ钱包"},
		{address:"北京市朝阳区成教路",time:"2015-10-03",type:"微信支付"},
		{address:"北京市奥体内环路",time:"2015-10-10",type:"支付宝"},
		{address:"北京市朝阳区文学馆路",time:"2015-11-02",type:"QQ钱包"},
		{address:"北京市朝阳区S50（五环）",time:"2015-11-05",type:"支付宝"},
		{address:"北京市朝阳区文学馆路",time:"2015-11-11",type:"QQ钱包"},
		{address:"北京市奥体内环路",time:"2015-11-20",type:"支付宝"},
		{address:"北京市朝阳区酒仙桥东路",time:"2015-11-23",type:"支付宝"},
		{address:"北京市朝阳区成教路",time:"2015-11-28",type:"微信支付"},
		{address:"北京市朝阳区酒仙桥东路",time:"2015-12-07",type:"QQ钱包"},
		{address:"北京市朝阳区文学馆路",time:"2015-12-15",type:"微信支付"}
	],
	"cust":[
		{address:"北京市朝阳区S50（五环）",time:"2015-10-02",type:"QQ钱包"},
		{address:"北京市朝阳区成教路",time:"2015-10-03",type:"微信支付"},
		{address:"北京市奥体内环路",time:"2015-10-10",type:"支付宝"},
		{address:"北京市朝阳区文学馆路",time:"2015-11-02",type:"QQ钱包"},
		{address:"北京市朝阳区S50（五环）",time:"2015-11-05",type:"支付宝"},
		{address:"北京市朝阳区文学馆路",time:"2015-11-11",type:"QQ钱包"},
		{address:"北京市奥体内环路",time:"2015-11-20",type:"支付宝"},
		{address:"北京市朝阳区酒仙桥东路",time:"2015-11-23",type:"支付宝"},
		{address:"北京市朝阳区成教路",time:"2015-11-28",type:"微信支付"},
		{address:"北京市朝阳区酒仙桥东路",time:"2015-12-07",type:"QQ钱包"},
		{address:"北京市朝阳区文学馆路",time:"2015-12-15",type:"微信支付"}
	]
}}};


var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		
		//界面加载好之后重新滚动
		mui('.mui-scroll-wrapper').scroll();
		
		var table = document.getElementById('ulId');
		var data = customerData.json.data.pricust;
		for (var i = 0; i < data.length; i++) {
			var li = document.createElement('li');
			li.className = 'mui-table-view-cell';
			li.innerHTML = '<a class="mui-navigate-right">'
							+'<div class="mui-media-body">'
							+'消费地点：'+data[i].address
							+'<p class="mui-ellipsis">消费时间：'+data[i].time
							+'<font>消费类型：'+data[i].type+'</font>'
							+'</p>'
							+'</div>'
							+'</a>';
			table.appendChild(li);
		}
	},
	//设备资源加载完成调用
	deviceReady: function() {
	}
};

_App.init(appConfig);