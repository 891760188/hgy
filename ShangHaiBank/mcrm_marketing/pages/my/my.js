//App配置信息
var appConfig = {
	//ui加载完成调用
	uiReady: function() {
		mui('.mui-scroll-wrapper').scroll();
	},
	//设备资源加载完成调用
	deviceReady: function() {
		var imgss = document.getElementById('head-img');
		if(plus.storage.getItem("_userPic") == "" || plus.storage.getItem("_userPic") == null) {
			//如果头像未设置过，则为其默认一个头像
			var path = '../homePage/tou1.png';
			imgss.src = path;
		} else {
			//现获取本地头像
			var filesName = plus.storage.getItem("_userPic");
			var uploadName = plus.storage.getItem("_userPic");
			var paths = "file://" + plus.io.convertLocalFileSystemURL("_doc/" + filesName);
			plus.io.resolveLocalFileSystemURL(paths, function() {
				//获取缓存成功 
				imgss.src = paths;
			}, function() {
				//获取不到文件，重新缓存
				var saveLocalFile = "_doc/" + filesName;
				var durls = basePath + "AnnexeDownload?filename=" + uploadName + "&annexeName=" + filesName;
				var options = {
					method: "GET",
					filename: saveLocalFile
				};
				var dtask = plus.downloader.createDownload(durls, options, function(d, status) {
					// 下载完成
					if(status == 200) {
						var patht = plus.io.convertLocalFileSystemURL(d.filename);
						patht = "file://" + patht;
						console.log('下载成功' + d.filename);
						imgss.src = patht;
					} else {
						//							mui.alert("下载失败!");
					}
				});
				//dtask.addEventListener( "statechanged", onStateChanged, false );
				dtask.start();
			});
		}

	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function goLoginPage() {
	var afterShow = function() {
		var indexview = plus.webview.getLaunchWebview();
		mui.fire(indexview, 'logoutEvt');
	};
	_App.util.goPage('../../index.html', "none", afterShow());
}
function go2Contact() {
	//	_App.util.goPage('../SocialCol/contacts/colleagues.html', {pageId: 'colleagues_Id'});
	_App.util.goPage('contacts/colleagues.html?subTab=2',{
		pageId: 'colleagues_Id'
	});

}

function goPwd() { //修改密码
	_App.util.goPage('./password/password.html', {
		pageId: 'myPage'
	});
}

function go2calendar() {
	var url = "../work/calendar/calendar.html";
	_App.util.goPage(url, {
		pageId: 'calendar_id',
		refresh: true
	});
}

function go2cust() {
	var url = "../custManage/nearbyCust/map-demos.html?actType=nbcust";
	_App.util.goPage(url, {
		pageId: 'nearbyCust_Id',
		refresh: true
	});
}

function go2mapDemos() {
	var url = "../SocialCol/nearbyMate/map-demos.html";
	_App.util.goPage(url, {
		pageId: 'mapDemos_id',
		refresh: true
	});
}

function go2shake() {
	_App.util.goPage('shake/accelerometer_shake.html', {
		pageId: "accelerometer_shake_Id"
	});
}
/*
 *修改头像 
 */
function go2AvatarSetting() {
	_App.util.goPage('avatarSetting/avatarSetting.html', {
		pageId: "avatarSetting_id"
	});
}

function go2Share() {
	_App.util.goPage('share/share.html', {
		pageId: "share_id"
	});
}

/*
 *简报
 */
function go2paper() {
	_App.util.goPage('paper/paper.html', {
		pageId: "paper_id"
	});
}

/*
 * 头像生效监听
 */
window.addEventListener('SETEDPHOTO', function(e) {
	var imgss = document.getElementById('head-img');
	imgss.src = e.detail.src;
})

function go2hdsearch() {
	mui.openWindow({
		url: "../homePage/search.html",
		id: "search-viewId",
		extras: {},
		createNew: false,
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: "slide-in-right" //页面显示动画，默认为”slide-in-right“；
		},
		waiting: {
			autoShow: false, //自动显示等待框，默认为true
			title: '正在载入...' //等待对话框上显示的提示内容
		}
	});
}

function go2signfun() {
	var url = "../work/sign/signCounts.html";
	_App.util.goPage(url, {
		pageId: 'signCounts_id',
		refresh: true
	});
}

function go2chatList() {
	var url = "../reminds/chat/chatList.html";
	_App.util.goPage(url, {
		pageId: 'chatList_id',
		refresh: true
	});
}

function go2barcode() {
	var url = "../system/barcode/barcode.html";
	_App.util.goPage(url, {
		pageId: 'barcode_Id',
		refresh: true
	});
}

function go2Lock(){
	var url = "handLock/locker.html";
	_App.util.goPage(url, {
		pageId: 'locker_Id',
		refresh: true
	});
}
