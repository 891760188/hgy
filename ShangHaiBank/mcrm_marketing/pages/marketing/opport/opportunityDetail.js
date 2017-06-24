var oppStep = _App.util.getUrlParamByName("oppStep");

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {

		//界面加载好之后重新滚动
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		//		curWebViewId = plus.webview.currentWebview().id;
		//		curWebViewId = encodeURIComponent(curWebViewId);//便面中午在iOS上报错
		//		backPage = plus.webview.getWebviewById(cwebviewId);
		var st = document.getElementById('salePlanTitle'); //营销方案信息
		var sc = document.getElementById('salePlanCon'); //营销方案信息
		var dt = document.getElementById('doPlanTitle'); //营销落地信息
		var dc = document.getElementById('doPlanCon'); //营销落地信息
		if(1 * oppStep >= 3) {
			st.style.display = "block";
			sc.style.display = "block";

			dt.style.display = "block";
			dc.style.display = "block";
		} else if(1 * oppStep >= 2 && 1 * oppStep < 3) {
			st.style.display = "block";
			sc.style.display = "block";

			dt.style.display = "none";
			dc.style.display = "none";
		} else {
			st.style.display = "none";
			sc.style.display = "none";

			dt.style.display = "none";
			dc.style.display = "none";
		}

		document.querySelector('#setImptBt').addEventListener('tap', function() {
			if(this.classList.contains("cked")) {
				this.classList.remove('cked');
				this.innerText = '设为重点';
				mui.toast('取消重点成功！');
			} else {
				this.classList.add('cked');
				this.innerText = '取消重点';
				mui.toast('设为重点成功！');
			}
		});
	}
};

_App.init(appConfig);

function commonTxt() {
	var obj = mui("#commonCon")[0]
	var con = obj.value;
	var divCon = mui("#" + divId)[0];
	var html = divCon.innerHTML;
	html = html + '<div class="ys-cfiAns"><b>王总：</b><span>' + con + '</span></div>'
	divCon.innerHTML = html;
	obj.value = "";
	mui('#popover').popover('toggle');
}

function cancel() {
	var obj = mui("#commonCon")[0];
	obj.value = "";
	mui('#popover').popover('toggle');
}

function hrefClick() {
	plus.device.dial('13487678574', false);
}

function commonFun() {
	plus.device.dial('13487678574', false);
}

function changeDivId(obj) {
	divId = obj
}

function addFootMark() {
	_App.util.goPage("addFootmark.html", {
		pageId: 'addFootmark_id',
		refresh: true
	});
}

function chooseAdviser() {
	_App.util.goPage('financialAdviser.html?pageType=OPP_', "none");
}

function cancelSale() {
	var obj = mui("#commonTent")[0];
	obj.value = "";
	mui('#popover2').popover('toggle');
}

function replyFun() {
	_App.util.goPage("reply.html", "none");
}

function toChat2(name) {
	_App.util.goPage('../../public/chat/chatRecord.html?toUserName=' + encodeURIComponent(name), 'none');
}

function doShare(data) {
	var sign;
	if(data == '1'){
		sign = 'XTYX';
	}else if(data == '2'){
		sign = 'KHZJ';
	}
	//由于目前商机的分享是静态的因此无法分出是潜在客户还是正式客户，所有先都已营销协同的方式分享
	plus.storage.removeItem("_shareImgPath_")
	var ljUrl = "./../marketing/opport/opportunityDetail.html?oppStep=" + oppStep;
	var currentViewId = plus.webview.currentWebview().id;
	var shareUrl = "../../finding/share/share.html?cwebviewObjId=" + encodeURIComponent(currentViewId) + "&bizType="+sign+"&ljUrl="+encodeURIComponent(ljUrl)+"&bizId=&sign=2";
	mui('#picture').popover('toggle');
	_App.util.goPage(shareUrl, {
		pageId: "share_id",
		refresh: true
	});
}