var newAddOpportunity; //新增的商机数据
var curWebviewId;
var custName;
var bodyCode;
var oppStep;
var judge; //判断是否为第一次加载
var map;
//

var vmap = [{
	"custName": "万科集团（深圳）股份有限公司",
	"bodyCode": "",
	"oppStep": "1"
}, {
	"custName": "腾讯科技股份有限公司",
	"bodyCode": "",
	"oppStep": "3"
}, {
	"custName": "北京某科技有限公司",
	"bodyCode": "",
	"oppStep": "2"
}, {
	"custName": "腾讯科技股份有限公司（上海）",
	"bodyCode": "",
	"oppStep": "3"
}, {
	"custName": "华侨城股份有限公司（深圳）",
	"bodyCode": "",
	"oppStep": "-1"
}, {
	"custName": "北京某科技有限公司",
	"bodyCode": "",
	"oppStep": "-1"
}];

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
		//界面加载好之后重新滚动
		var typeId = _App.util.getUrlParamByName("typeId");
		var name = typeToName(typeId);
		document.getElementById("muiTitleId").innerHTML = name;
		mui('.mui-scroll-wrapper').scroll();

	},
	//设备资源加载完成调用
	deviceReady: function() {
		curWebviewId = plus.webview.currentWebview().id;
		curWebviewId = encodeURIComponent(curWebviewId); //便免中午在iOS上报错
		showMyRespOppDatas();

		YSUI.SuperBt();
	}
};

_App.init(appConfig);

function addBusiOppor() {
	var url = "addOpportunity.html?cwebviewId=" + curWebviewId;
	_App.util.goPage(url, {
		pageId: "addOpportunityId",
		refresh: true
	});
}
//新增商机回调函数
window.addEventListener("newAddOppBackEvent__", function(event) {
	showMyRespOppDatas();
});

function showMyRespOppDatas() {
	newAddOpportunity = plus.storage.getItem("newAddOpportunity");
	if(newAddOpportunity) {
		judge = 1;
		newAddOpportunity = JSON.parse(newAddOpportunity);
		initData();
	} else {
		judge = 2;
		var i;
		newAddOpportunity = [];
		for(i = 0; i < vmap.length; i++) {
			map = {};
			map.custName = "" + vmap[i].custName;
			map.bodyCode = "" + vmap[i].bodyCode;
			map.oppStep = "" + vmap[i].oppStep;
			newAddOpportunity.push(map);
		}
		plus.storage.setItem("newAddOpportunity", JSON.stringify(newAddOpportunity));
		initData();

	}
}

var initData = function() {
	var table = document.getElementById('ulId');
	table.innerHTML = "";
	var data = newAddOpportunity;
	var numStr = "";
	for(var i = 0; i < data.length; i++) {
		var tipsName = "";
		var planDoName = "";
		var oppStep = "" + data[i].oppStep;
		if(!oppStep || oppStep == "undefined")
			oppStep = "1";
		if(1 * oppStep == 1) {
			tipsName = "商机录入";
			planDoName = '<button class="mui-icon icon-line-81 find-button" id="planDoBtn' + oppStep + '" onclick="go2surePlan(\'' + data[i].custName + '\',\'' + data[i].bodyCode + '\',\'' + data[i].oppStep + '\',\'' + i + '\');">确认方案</button>';
		} else if(1 * oppStep == 2) {
			tipsName = "确认方案";
			planDoName = '<button class="mui-icon icon-line-7 find-button" id="planDoBtn' + oppStep + '" onclick="go2finishOpp(\'' + data[i].custName + '\',\'' + data[i].bodyCode + '\',\'' + data[i].oppStep + '\',\'' + i + '\');">业务落地</button>';
		} else if(1 * oppStep == 3) {
			tipsName = "业务落地";
		} else
			tipsName = "已过期";
		var ul = document.createElement('ul');
		ul.className = 'mui-table-view mui-table-view-group';
		ul.innerHTML = '<li class="mui-table-view-cell toolHover find-table-view-cell">' +
			'<a class="mui-navigate-right" onclick="goDetail(\'' + data[i].custName + '\',\'' + data[i].bodyCode + '\',\'' + data[i].oppStep + '\',\'' + i + '\');">' +
			'<b class="tagTips icon-star-half c1 bdc1" id="planDoTip' + oppStep + '">' + tipsName + '</b>' + data[i].custName +
			'<p>产品名称：企业丰盈融资2015112期</p>' +
			'<p id="planDoName' + oppStep + '">方案名称：</p></a>' +
			'<div id="planDo' + oppStep + '" class="mui-table-view-cell-bt">' +
			'<button class="mui-table-btn-flag mui-icon icon-line-133" >重点关注</button>' +
			planDoName
			//						+ '<button id="plan2DoBtn'+oppStep+'" style="display: none;">业务落地</button>'
			+
			'</div></li>';
		table.appendChild(ul);
	}
	mui(".mui-table-view-cell-bt").on('tap', '.mui-table-btn-flag', function() {
		//获取id
		if(this.classList.contains("cked")) {
			this.classList.remove('cked');
			this.classList.add('icon-line-133');
			this.classList.remove('iconBlue');
			this.classList.remove('icon-line-1134');
			this.innerText = '设为重点';
			mui.toast('取消重点成功！');
		} else {
			this.classList.add('cked');
			this.classList.add('iconBlue');
			this.classList.remove('icon-line-133');
			this.classList.add('icon-line-1134');
			this.innerText = '取消重点';
			mui.toast('设为重点成功！');
		}
	});
};

function goDetail(name, code, step, position) {
	_App.util.goPage("opportunityDetail.html?oppStep=" + step, {
		pageId: "opportunityDetailId",
		refresh: true
	});
}

function go2surePlan(name, code, step, position) {
	var map = {};
	map.custName = "" + name;
	map.bodyCode = "" + code;
	map.oppStep = "" + step;
	map.pos = "" + position;
	plus.storage.removeItem("flowOppDMap_");
	plus.storage.setItem("flowOppDMap_", JSON.stringify(map));
	_App.util.goPage("marketPlan.html?cwebview=" + curWebviewId, {
		pageId: "marketPlan_Id",
		refresh: true
	});
}

function go2finishOpp(name, code, step, position) {
	var map = {};
	map.custName = "" + name;
	map.bodyCode = "" + code;
	map.oppStep = "" + step;
	map.pos = "" + position;
	plus.storage.removeItem("flowOppDMap_");
	plus.storage.setItem("flowOppDMap_", JSON.stringify(map));
	_App.util.goPage("doOpportunity.html?cwebview=" + curWebviewId, {
		pageId: "doOpportunity_Id",
		refresh: true
	});
}