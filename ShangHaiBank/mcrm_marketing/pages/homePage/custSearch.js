var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		refreshCustInfo();
	},
	//设备资源加载完成调用
	deviceReady: function() {}
};
/**
 * 页面初始化
 */
_App.init(appConfig);
var go2cust = function(company) {
	var url = '../custManage/comCustomerDetail.html?company=' + encodeURIComponent(company);
	_App.util.goPage(url, {
		pageId: 'comCustomerDetail_Id',
		refresh: true
	});
}

var refreshCustInfo = function(){
		var heheda = localStorage.getItem('_custInfoHistory').split(',');
		var length = heheda.length;
		var lastLength = length - 1;
		var lastData = heheda[lastLength];
		if(length >1){
			for(var b = 0;b <= lastLength - 1;b++){
			if(heheda[b] == lastData){//查找是否有重复搜索记录
				var arrayData = new Array();
				for(var c = 0;c <=lastLength - 1;c++){//重新排列搜索历史序列，去除重复搜索且将最近一次的搜索放在搜索历史的第一个位置
					if(c == lastLength - 1){
						arrayData[c] = lastData;
					}else if(c < b){
						arrayData[c] = heheda[c];
					}else{
						arrayData[c] = heheda[c+1];
					}
//					arrayData[c] = heheda[c];
				}
				localStorage.removeItem('_custInfoHistory');
				localStorage.setItem('_custInfoHistory',arrayData);
				heheda = localStorage.getItem('_custInfoHistory').split(',');
				length = heheda.length;
			}
		}
		}
		
		var html = '';
		for(var a = length - 1; a >= 0; a--) {
			html += '<span class="minTag zhfx">' + heheda[a] + '</span>'
		}
		document.getElementById('historyCustList').innerHTML = html;
		mui("#historyCustList").on('tap', 'span', function() {
			go2cust(this.innerHTML);
		})
}
