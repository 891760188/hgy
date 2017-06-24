var chartHtml = '';
var photoUrl = "tou1.png";
var popoverId;
var bizType;
var isRead;
var cwebviewObjId; //当前界面对象id
var CJisRead;
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	gestureConfig: {
		longtap: true,
	},
	//ui加载完成调用
	uiReady: function() {},
	//设备资源加载完成调用
	deviceReady: function() {
		cwebviewObjId = plus.webview.currentWebview().id;
		cwebviewObjId = encodeURIComponent(cwebviewObjId);
		var filesName;
		if (_App.sessionUser.userPic()) {
			filesName = _App.sessionUser.userPic();
			paths = "file://" + plus.io.convertLocalFileSystemURL("_doc/" + filesName);
			plus.io.resolveLocalFileSystemURL(paths, function() {
				//获取缓存成功 
				photoUrl = paths;
				initHead();
			}, function() {
				//获取不到文件，重新缓存
				var saveLocalFile = "_doc/" + filesName;
				var durls = basePath + "AnnexeDownload?filename=" + filesName + "&annexeName=" + filesName;
				var options = {
					method: "GET",
					filename: saveLocalFile
				};
				var dtask = plus.downloader.createDownload(durls, options, function(d, status) {
					// 下载完成
					if (status == 200) {
						var patht = plus.io.convertLocalFileSystemURL(d.filename);
						patht = "file://" + patht;
						console.log('下载成功' + d.filename);
						photoUrl = patht;
						initHead();
					} else {
						initHead();
						//							mui.alert("下载失败!");
					}
				});
				//dtask.addEventListener( "statechanged", onStateChanged, false );
				//				dtask.start();
				initHead();
			});
		} else {
			initHead();
		}

		//		var gallery2 = mui('#exceptionId');
		//		gallery2.slider({
		//			interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
		//		});

		//		mui('#searchId').on('tap', function(){
		//			alert("say hello!");
		//		    _App.util.goPage("hdSearch.html", "none");
		//		});

		//加载提醒信息数据
		getInfoRemindDatas();
		mui("#infoRemindDivId").off('tap');
		mui("#infoRemindDivId").on('tap', 'a', function() {
			popoverId = this.getAttribute("id");
			bizType = this.getAttribute("data-judge");
			isRead = this.getAttribute("data-val");
			var dataJudge = this.getAttribute("data-judge");
			if (dataJudge == 'CJLC') { //如果为场景流程
				var dinfo = this.getAttribute("data-info");
				var di = dinfo.split(",");
				//更新已读未读标识
				exeGoFun(dataJudge, di[0], di[1], popoverId, bizType);
			} else {
				exeGoFun(dataJudge, '', '', popoverId, bizType);
			}
		});
		mui("#infoRemindDivId").off('longtap', 'a');
		mui("#infoRemindDivId").on('longtap', 'a', function() {
			popoverId = this.getAttribute("id");
			bizType = this.getAttribute("data-judge");
			isRead = this.getAttribute("data-val");
			if (isRead == "0") {
				document.getElementById("noRead").style.display = "none";
			} else {
				document.getElementById("noRead").style.display = "block";
			}
			mui('#popover').popover('toggle');

		});
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

function go2kpiEx(kpiId) {
	_App.util.goPage('../cockpit/indices-details.html?id=' + kpiId);
}

function go2kpidetail(kpiId, name) {
	_App.util.goPage('../cockpit/indices-details.html?id=' + kpiId + '&name=' + encodeURIComponent(name), "none");
}

function go2hdsearch() {
	//	_App.util.goPage("hdSearch.html", "none");
	mui.openWindow({
		url: "search.html",
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

function go2detail(id) {
	if (id == "id1") {
		_App.util.goPage('../cockpit/badLoans.html?id=' + id + '&name=' + encodeURIComponent('不良贷款率'), "none");
	} else if (id == "id2")
		_App.util.goPage('../cockpit/indices-details.html?id=' + id + '&name=' + encodeURIComponent('个人存款'), "none");
	else if (id == "id3" || id == "id4")
		_App.util.goPage('../cockpit/cockpit-detail.html?id=' + id);

	else if (id == "id5")
		_App.util.goPage('../cockpit/riskAnalysis.html?id=' + id);
}

function go2opport() {
	var url = "../marketing/opport/myResponsibleOpp.html";
	_App.util.goPage(url, {
		pageId: 'myResponsibleOppId',
		refresh: true
	});
}

function go2cust() {
	var url = "../custManage/myCusts/my-customers.html";
	_App.util.goPage(url, {
		pageId: 'my-customers_Id',
		refresh: true
	});
}

function go2oppTools() {
	var url = "../marketing/tools/opportunityTools.html";
	_App.util.goPage(url, {
		pageId: 'opportunityTools_Id',
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

function goAtMyMessage() {
	var url = "../marketing/opport/buiOpportList.html?typeId=8";;
	_App.util.goPage(url, {
		pageId: 'buiOpportList_id',
		refresh: true
	});
}

function go2paper() {
	_App.util.goPage('../questInvestigation/questInvestigation.html', {
		pageId: "questInvestigation_Id"
	});
}

function go2schdetail(schId) {
	var url = "../work/calendar/scheduleDetail.html?schId=" + schId;
	_App.util.goPage(url, {
		pageId: "scheduleDetail_Id",
		refresh: true
	})
}

function go2Sign() {
	var url = "../work/sign/signCounts.html";
	_App.util.goPage(url, {
		pageId: "signCounts_Id",
		refresh: true
	});
}
/**
 * @param {Object} psceneId 过关场景ID
 * @param {Object} recordId 记录ID
 */
function go2mktpass(psceneId, recordId) {
	//跳转到场景过关界面
	var url = "../marketing/passScene/passScene1_1.html?passId=" + psceneId + "&recordId=" + recordId + "&cwebviewObjId=" + cwebviewObjId;
	_App.util.goPage(url, {
		pageId: "passScene1_1_Id",
		refresh: true
	});
}

/**
 * @param {Object} i 当前加载数据索引，默认第0个，与右上角tabs按钮对应
 */
function setCdsChart(i) {

	//模拟数据
	var cdsChartData = [
		[{
			quotaName: '存款',
			quotaValue: '25',
			quotaTargets: '90'
		}, {
			quotaName: '贷款',
			quotaValue: '50',
			quotaTargets: '80'
		}, {
			quotaName: '中收',
			quotaValue: '22',
			quotaTargets: '40'
		}],
		[{
			quotaName: '存款',
			quotaValue: '298',
			quotaTargets: '540'
		}, {
			quotaName: '贷款',
			quotaValue: '110',
			quotaTargets: '420'
		}, {
			quotaName: '中收',
			quotaValue: '80',
			quotaTargets: '100'
		}]
	];

	/* centerCoordinate:中心坐标
	 * radius:半径 
	 * angle:夹角
	 */
	var getCoordinate = function(centerCoordinate, radius, angle) {
		var _x = 0,
			_y = 0;
		_x = centerCoordinate.x + radius * Math.cos(angle * Math.PI / 180);
		_y = centerCoordinate.y + radius * Math.sin(angle * Math.PI / 180);
		return ({
			x: _x,
			y: _y
		});
	};

	var _i = i ? i : 0;
	var _d = document.getElementsByClassName('idx-cdsChart')[0];
	var _h = _d.clientWidth * 300 / 720;
	var _w = _d.clientWidth * 0.82;
	var _a = -(Math.atan(_h / _w) * 180 / Math.PI); //斜边夹角角度
	document.getElementsByClassName('idx-cdscBox')[0].style.height = _h + 'px';

	var _xy1 = {
		x: _w * 0.074,
		y: _h * 0.61
	}; //第1组原点坐标，百分数为手动测算，下同
	var _xy2 = {
		x: _w * 0.12,
		y: _h * 0.87
	};
	var _xy3 = {
		x: _w * 0.43,
		y: _h * 0.86
	};
	var _xw1 = Math.sqrt(_h * _h * 0.52 * 0.52 + _w * _w * 0.68 * 0.68); //第1组斜边长，百分数为手动测算，下同
	var _xw2 = Math.sqrt(_h * _h * 0.7 * 0.7 + _w * _w * 0.76 * 0.76);
	var _xw3 = Math.sqrt(_h * _h * 0.55 * 0.55 + _w * _w * 0.59 * 0.59);

	//数据赋值、当前完成值坐标设置
	//第1组
	document.getElementById('quotaName1').innerHTML = cdsChartData[_i][0].quotaName;
	document.getElementById('quotaTargets1').innerHTML = cdsChartData[_i][0].quotaTargets + '万元';
	document.getElementById('quotaValue1').querySelector('i').innerHTML = cdsChartData[_i][0].quotaValue + '万元';
	var _xyA = getCoordinate(_xy1, _xw1 * (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets), _a);
	var _cA = 'c';
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets >= 0.6) {
		_cA = 'a';
	}
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets >= 0.8) {
		_cA = 'b';
	}
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets > 1) {
		_xyA = getCoordinate(_xy1, _xw1, _a);
	}
	document.getElementById('quotaValue1').setAttribute('style', 'left:' + (_xyA.x - 20) + 'px;top:' + (_xyA.y - 30) + 'px');
	document.getElementById('quotaValue1').querySelector('span').setAttribute('class', _cA);

	//第2组
	document.getElementById('quotaName2').innerHTML = cdsChartData[_i][1].quotaName;
	document.getElementById('quotaTargets2').innerHTML = cdsChartData[_i][1].quotaTargets + '万元';
	document.getElementById('quotaValue2').querySelector('i').innerHTML = cdsChartData[_i][1].quotaValue + '万元';
	var _xyB = getCoordinate(_xy2, _xw2 * (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets), _a);
	var _cB = 'c';
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets >= 0.6) {
		_cB = 'a';
	}
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets >= 0.8) {
		_cB = 'b';
	}
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets > 1) {
		_xyB = getCoordinate(_xy2, _xw2, _a);
	}
	document.getElementById('quotaValue2').setAttribute('style', 'left:' + (_xyB.x - 20) + 'px;top:' + (_xyB.y - 30) + 'px');
	document.getElementById('quotaValue2').querySelector('span').setAttribute('class', _cB);

	//第3组
	document.getElementById('quotaName3').innerHTML = cdsChartData[_i][2].quotaName;
	document.getElementById('quotaTargets3').innerHTML = cdsChartData[_i][2].quotaTargets + '万元';
	document.getElementById('quotaValue3').querySelector('i').innerHTML = cdsChartData[_i][2].quotaValue + '万元';
	var _xyC = getCoordinate(_xy3, _xw3 * (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets), _a);
	var _cC = 'c';
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets >= 0.6) {
		_cC = 'a';
	}
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets >= 0.8) {
		_cC = 'b';
	}
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets > 1) {
		_xyC = getCoordinate(_xy3, _xw3, _a);
	}
	document.getElementById('quotaValue3').setAttribute('style', 'left:' + (_xyC.x - 20) + 'px;top:' + (_xyC.y - 30) + 'px');
	document.getElementById('quotaValue3').querySelector('span').setAttribute('class', _cC);

};
//自定义指标图形 end

function getInfoRemindDatas() {
	var ws = plus.nativeUI.showWaiting();
	var data_ = {};
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!getSceneInfoDatas.json',
		data: data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data;
			showInfoRemindDatas(data);
		},
		error: function(a, b, c) {
			mui.alert("签到失败");
			ws.close();
		}
	});
}
//暂时未做分页处理
function showInfoRemindDatas(data) {
	var html = '';
	if (data.length > 0) {
		var _obj_ = document.getElementById("infoRemindDivId");
		html = '';
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			var bCont;
			if (d.IS_READ == '0') { //为未读
				bCont = '<b></b>'
			} else {
				bCont = '';
			}
			if(d.BIZ_TYPE == "CJTGPM"){
				CJisRead = d.IS_READ;
			}
			if (d.BIZ_TYPE == "CJLC") {
				html += '<a class="" data-val="' + d.IS_READ + '" data-judge="' + d.BIZ_TYPE + '" id="' + d.RECORD_ID + '" data-info="' + d.PASS_ID + ',' + d.RECORD_ID + '"><i class="' + d.CLS + '"></i><span>' + d.TITLE + '</span><img src="../marketing/passScene/tg.png" class="nextPass"><span>' + d.S_TIME + bCont + '</span>';
			} else {
				html += '<a class="" data-val="' + d.IS_READ + '" data-judge="' + d.BIZ_TYPE + '" id="' + d.RECORD_ID + '" data-info="' + d.PASS_ID + ',' + d.RECORD_ID + '"><i class="' + d.CLS + '"></i><span>' + d.TITLE + '</span><span>' + d.S_TIME + bCont + '</span>';
			}
		}
		_obj_.innerHTML = html;

	} else { //默认
		html = '<a onclick="go2schdetail(\'279208\');"><i class="icon-line-9 c8 bgColor1"></i><span>拜访恒大集团有限公司</span><span>10：40</span></a>';
		html += '<a onclick="goPage(\'../reminds/messages-birthdays.html\')"><i class="icon-line-42 c8 bgColor4"></i><span>您的生日在1天后即将到来</span><span>昨天</span></a>';
		html += '<a onclick="goPage(\'../reminds/file-make.html\')"><i class="icon-line-57  c8 bgColor3"></i><span>审批流程正在进行中，请及时查看</span><span>昨天</span></a>';
		html += '<a onclick="goPage(\'../reminds/mes-expires.html\')"><i class="icon-line-38 c8 bgColor2"></i><span>您的贷款即将到期，请及时处理</span><span>11月2日</span></a>';
		html += '<a onclick="go2schdetail(\'279208\');"><i class="icon-line-9 c8 bgColor3"></i><span>我的日程，今天要去公司开会</span><span>10月10日</span></a>';
		html += '<a onclick="goPage(\'../reminds/makes.html\')"><i class="icon-line-57 c8 bgColor2"></i><span>代办任务，现在要进行开会咯</span><span>10月9日</span></a>';
		html += '<a onclick="goPage(\'../reminds/largeChanges.html\')"><i class="icon-line-38 c8 bgColor4"></i><span>大额变动提醒，你的借款请及时处理</span><span>10月8日</span></a>';
		html += '<a onclick="goAtMyMessage()"><i class="icon-line-48 c8 bgColor1"></i><span>@我的消息</span><span>10月1日</span></a>';
		document.getElementById("infoRemindDivId").innerHTML = html;
	}
	localStorage.removeItem('localStorage');
	localStorage.setItem('CJisRead',CJisRead);
}

function exeGoFun(type, par1, par2, par3, par4) {
	var ws = plus.nativeUI.showWaiting();
	if (isRead == "0") { //如果已经是已读就不用走后台
		_App.ajax({
			type: "get",
			url: basePath + 'mktPassManageAction!saveNoRead.json',
			data: {
				popoverId: par3,
				bizType: par4,
				isRead: isRead
			},
			cache: false,
			dataType: "json",
			success: function(response) {
				ws.close();
				//跳转对应地方
				if (type == 'CJLC') { //如果为场景流程
					go2mktsceneturn(par1, par2);
				} else if (type == 'GG') { //如果为公告
					goNoticeDetail(par3, par4);
				} else if (type == 'SJ') { //商机
					go2opportRank()
				} else if (type == 'CJTGPM') { //场景通关排名
					go2cjtgRank();
				}
				//			getInfoRemindDatas();
				//			mui('#popover').popover('toggle');
			},
			error: function() {
				ws.close();
				mui.alert('加载失败！');
				mui('#popover').popover('toggle');
			}
		});
	} else {
		if (type == 'CJLC') { //如果为场景流程
			go2mktsceneturn(par1, par2);
		} else if (type == 'GG') { //如果为公告
			goNoticeDetail(par3, par4);
		} else if (type == 'SJ') { //商机
			go2opportRank()
		} else if (type == 'CJTGPM') { //场景通关排名
			go2cjtgRank();
		}
		ws.close();
	}

}


/**
 * 场景通关排名就是营销界面
 * 暂未实现
 */
function go2cjtgRank() {
	var evJs = "var tabPanel = document.getElementById('tabPanel'); "
		+"var yx = tabPanel.querySelector('#cjyx'); "
		+"mui.trigger(yx, 'tap');"
		+"document.getElementById('defaultTab').classList.remove('mui-active'); "
		+"document.getElementById('cjyx').classList.add('mui-active'); ";
	plus.webview.currentWebview().parent().evalJS(evJs);
}
/**
 * 商机
 */
function go2opportRank() {
	var url = "../marketing/opport/opportRank.html?cwebviewObjId=" + cwebviewObjId;
	_App.util.goPage(url, {
		pageId: 'opportRank_id',
		refresh: true
	});
}

/**
 * 根据场景ID，做硬转化
 * @param {Object} passId 场景ID
 * @param {Object} recordId 记录ID
 */
function go2mktsceneturn(passId, recordId) {
	if (1 * passId == 1) { //第一个场景
		go2mktpass(passId, recordId);
	} else if (1 * passId == 3) {
		//第3个场景
		go2mktpass3(passId, recordId);
	} else if (1 * passId == 4) {
		//第4个场景
		go2mktpass4(passId, recordId);
	}
}

function go2signfun() {
	var url = "../work/sign/signCounts.html";
	_App.util.goPage(url, {
		pageId: 'signCounts_id',
		refresh: true
	});
}

function go2mktpass4(psceneId, recordId) {
	//跳转到场景过关界面
	var url = "../marketing/passScene/scene4/scene_4.html?passId=" + psceneId + "&recordId=" + recordId + "&cwebviewObjId=" + cwebviewObjId;
	_App.util.goPage(url, {
		pageId: "scene_4_Id",
		refresh: true
	});
}

function go2mktpass3(psceneId, recordId) {
	//跳转到场景过关界面
	var url = "../marketing/passScene/passScene3/passScene3_1.html?passId=" + psceneId + "&recordId=" + recordId + "&cwebviewObjId=" + cwebviewObjId;
	_App.util.goPage(url, {
		pageId: "passScene1_3_Id",
		refresh: true
	});
}

function go2allmarket() {
	var url = "../handMarket/handMarket.html";
	_App.util.goPage(url, {
		pageId: "allHandMarket_id",
		refresh: true
	});
}

function go2mktActivity() {
	var url = "../marketing/tools/addMktActivityLists.html";
	_App.util.goPage(url, {
		pageId: 'addMktActivityLists_id',
		refresh: true
	});
}
/**
 * 设置头像监听
 */
window.addEventListener('SETEDPHOTO', function(e) {
	var path = e.detail.src;
	var imgDivs = document.querySelectorAll('.idx-cdscBox')[0].querySelectorAll('img');
	for (var i = 0; i < imgDivs.length; i++) {
		imgDivs[i].src = path;
	}
	imgDivs = document.querySelectorAll('.idx-cdscBox')[1].querySelectorAll('img');
	for (var i = 0; i < imgDivs.length; i++) {
		imgDivs[i].src = path;
	}
})

function setCdsChart_1(i) {

	//模拟数据
	var cdsChartData = [
		[{
			quotaName: '存款',
			quotaValue: '25',
			quotaTargets: '90'
		}, {
			quotaName: '贷款',
			quotaValue: '50',
			quotaTargets: '80'
		}, {
			quotaName: '中收',
			quotaValue: '22',
			quotaTargets: '40'
		}],
		[{
			quotaName: '存款',
			quotaValue: '298',
			quotaTargets: '540'
		}, {
			quotaName: '贷款',
			quotaValue: '110',
			quotaTargets: '420'
		}, {
			quotaName: '中收',
			quotaValue: '80',
			quotaTargets: '100'
		}]
	];

	/* centerCoordinate:中心坐标
	 * radius:半径 
	 * angle:夹角
	 */
	var getCoordinate = function(centerCoordinate, radius, angle) {
		var _x = 0,
			_y = 0;
		_x = centerCoordinate.x + radius * Math.cos(angle * Math.PI / 180);
		_y = centerCoordinate.y + radius * Math.sin(angle * Math.PI / 180);
		return ({
			x: _x,
			y: _y
		});
	};

	var _i = i ? i : 0;
	var _d = document.getElementsByClassName('idx-cdsChart')[0];
	var _h = _d.clientWidth * 300 / 720;
	var _w = _d.clientWidth * 0.82;
	var _a = -(Math.atan(_h / _w) * 180 / Math.PI); //斜边夹角角度
	document.getElementsByClassName('idx-cdscBox')[0].style.height = _h + 'px';

	document.getElementsByClassName('idx-cdscBox')[1].style.height = _h + 'px';

	var _xy1 = {
		x: _w * 0.074,
		y: _h * 0.61
	}; //第1组原点坐标，百分数为手动测算，下同
	var _xy2 = {
		x: _w * 0.12,
		y: _h * 0.87
	};
	var _xy3 = {
		x: _w * 0.43,
		y: _h * 0.86
	};
	var _xw1 = Math.sqrt(_h * _h * 0.52 * 0.52 + _w * _w * 0.68 * 0.68); //第1组斜边长，百分数为手动测算，下同
	var _xw2 = Math.sqrt(_h * _h * 0.7 * 0.7 + _w * _w * 0.76 * 0.76);
	var _xw3 = Math.sqrt(_h * _h * 0.55 * 0.55 + _w * _w * 0.59 * 0.59);

	//数据赋值、当前完成值坐标设置
	//第1组
	document.getElementById('quotaName1_1').innerHTML = cdsChartData[_i][0].quotaName;
	document.getElementById('quotaTargets1_1').innerHTML = cdsChartData[_i][0].quotaTargets + '万元';
	document.getElementById('quotaValue1_1').querySelector('i').innerHTML = cdsChartData[_i][0].quotaValue + '万元';
	var _xyA = getCoordinate(_xy1, _xw1 * (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets), _a);
	var _cA = '';
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets >= 0.6) {
		_cA = 'a';
	}
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets >= 0.8) {
		_cA = 'b';
	}
	if (cdsChartData[_i][0].quotaValue / cdsChartData[_i][0].quotaTargets > 1) {
		_xyA = getCoordinate(_xy1, _xw1, _a);
	}
	document.getElementById('quotaValue1_1').setAttribute('style', 'left:' + (_xyA.x - 20) + 'px;top:' + (_xyA.y - 30) + 'px');
	document.getElementById('quotaValue1_1').querySelector('span').setAttribute('class', _cA);

	//第2组
	document.getElementById('quotaName2_1').innerHTML = cdsChartData[_i][1].quotaName;
	document.getElementById('quotaTargets2_1').innerHTML = cdsChartData[_i][1].quotaTargets + '万元';
	document.getElementById('quotaValue2_1').querySelector('i').innerHTML = cdsChartData[_i][1].quotaValue + '万元';
	var _xyB = getCoordinate(_xy2, _xw2 * (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets), _a);
	var _cB = '';
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets >= 0.6) {
		_cB = 'a';
	}
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets >= 0.8) {
		_cB = 'b';
	}
	if (cdsChartData[_i][1].quotaValue / cdsChartData[_i][1].quotaTargets > 1) {
		_xyB = getCoordinate(_xy2, _xw2, _a);
	}
	document.getElementById('quotaValue2_1').setAttribute('style', 'left:' + (_xyB.x - 20) + 'px;top:' + (_xyB.y - 30) + 'px');
	document.getElementById('quotaValue2_1').querySelector('span').setAttribute('class', _cB);

	//第3组
	document.getElementById('quotaName3_1').innerHTML = cdsChartData[_i][2].quotaName;
	document.getElementById('quotaTargets3_1').innerHTML = cdsChartData[_i][2].quotaTargets + '万元';
	document.getElementById('quotaValue3_1').querySelector('i').innerHTML = cdsChartData[_i][2].quotaValue + '万元';
	var _xyC = getCoordinate(_xy3, _xw3 * (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets), _a);
	var _cC = '';
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets >= 0.6) {
		_cC = 'a';
	}
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets >= 0.8) {
		_cC = 'b';
	}
	if (cdsChartData[_i][2].quotaValue / cdsChartData[_i][2].quotaTargets > 1) {
		_xyC = getCoordinate(_xy3, _xw3, _a);
	}
	document.getElementById('quotaValue3_1').setAttribute('style', 'left:' + (_xyC.x - 20) + 'px;top:' + (_xyC.y - 30) + 'px');
	document.getElementById('quotaValue3_1').querySelector('span').setAttribute('class', _cC);

};

function initHead() {
	//保存图片
	plus.storage.removeItem("_photoUrl_"); 
	plus.storage.setItem("_photoUrl_",photoUrl);
	var data = demoData.json.data;
	var byId = function(id) {
		return document.getElementById(id);
	};

	var idAll = '';

	var kpiChartLoopId = document.getElementById("kpiChartLoopId");
	var kpiChartIndicatorId = document.getElementById("kpiChartIndicatorId");
	//----------------------------------------------故意放在这，需要在plus.ready后调用------------------------------------------------------
	/**
	 * @param {Object} i 当前加载数据索引，默认第0个，与右上角tabs按钮对应
	 */

	//自定义指标图形
	var _cdsStr_1 = '<div class="idx-cdsChart">' +
		'<h1 class="idx-cdsTabs"><span class="ck" data-index="0">本季</span><span data-index="1">当年</span></h1>' +
		'<div>' +
		'<div class="idx-cdscBox">' +
		'<div>' +
		'<span id="quotaName1_1"></span>' +
		'<i id="quotaTargets1_1"></i>' +
		'<div id="quotaValue1_1"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'<div>' +
		'<span id="quotaName2_1"></span>' +
		'<i id="quotaTargets2_1"></i>' +
		'<div id="quotaValue2_1"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'<div>' +
		'<span id="quotaName3_1"></span>' +
		'<i id="quotaTargets3_1"></i>' +
		'<div id="quotaValue3_1"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';

	var chartIndiHtml = '';
	var _jianbao = '<div style="height:250px;background:white;"><div class="title"><span class="text">本月销售简报</span></div>' +
		'<div class="content"><div class="box"><div class="icon-line-19 boxIcon"></div><div class="boxContent"><span>3</span>个' +
		'<p>新增客户</p></div></div><div class="box"><div class="icon-line-13 boxIcon"></div><div class="boxContent">' +
		'<span>3</span>个<p>已通关场景</p></div></div><div class="box"><div class="icon-line-8 boxIcon"></div>' +
		'<div class="boxContent"><span>29</span>个<p>新增商机</p></div></div><div class="box"><div class="icon-line-114 boxIcon"></div>' +
		'<div class="boxContent"><span>21</span>个<p>阶段变化的商机</p></div></div><div class="box"><div class="icon-line-9 boxIcon"></div>' +
		'<div class="boxContent"><span>3</span>个/<span>15</span>次<p>拜访客户</p></div></div></div></div>';
	var d;
	chartHtml += '<div class="mui-slider-item mui-slider-item-duplicate">'; //onclick="go2detail(\''+d.id+'\');"
	chartHtml += _jianbao
	chartHtml += '</div>';
	//本月简报

	//自定义指标图形
	var _cdsStr = '<div class="idx-cdsChart">' +
		'<h1 class="idx-cdsTabs"><span class="ck" data-index="0">本季</span><span data-index="1">当年</span></h1>' +
		'<div>' +
		'<div class="idx-cdscBox">' +
		'<div>' +
		'<span id="quotaName1"></span>' +
		'<i id="quotaTargets1"></i>' +
		'<div id="quotaValue1"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'<div>' +
		'<span id="quotaName2"></span>' +
		'<i id="quotaTargets2"></i>' +
		'<div id="quotaValue2"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'<div>' +
		'<span id="quotaName3"></span>' +
		'<i id="quotaTargets3"></i>' +
		'<div id="quotaValue3"><span><img src="' + photoUrl + '"/><b></b></span><i></i></div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</div>';
	chartHtml += '<div class="mui-slider-item mui-active" >'; //onclick="go2detail(\''+d.id+'\');"
	chartHtml += _cdsStr;
	chartHtml += '</div>';

	for (var i = 0; i < data.length; i++) {
		d = data[i];
		chartHtml += '<div class="mui-slider-item" >'; //onclick="go2detail(\''+d.id+'\');"
		chartHtml += '<div class="divqs" id="gauge' + i + '"></div>'; //'<div class="divs">' + '<h4>'+d.name+'</h4>' + '</div>' +
		chartHtml += '</div>';

		//			if(i == 0) {
		//				chartIndiHtml += '<div class="mui-indicator mui-active" id="' + d.id + '"></div>';
		//			} else {
		//				chartIndiHtml += '<div class="mui-indicator" id="' + d.id + '"></div>';
		//			}
		idAll = idAll + 'gauge' + i + '-';
	}

	chartHtml += '<div class="mui-slider-item" >'; //onclick="go2detail(\''+d.id+'\');"
	chartHtml += _jianbao;
	chartHtml += '</div>';

	//最后一个
	d = data[0];
	chartHtml += '<div class="mui-slider-item mui-slider-item-duplicate" >'; //onclick="go2detail(\''+d.id+'\');"
	chartHtml += _cdsStr_1;
	//		chartHtml += '<div class="divqs" id="gauge00"></div>'; //'<div class="divs">' + '<h4>'+d.name+'</h4>' + '</div>' + 
	chartHtml += '</div>';

	//				console.log(chartHtml);
	//		console.log(chartIndiHtml);
	kpiChartLoopId.innerHTML = chartHtml;
	kpiChartIndicatorId.innerHTML = chartIndiHtml + '<div class="mui-slider-indicator "><div class="mui-indicator mui-active" id="id1"></div><div class="mui-indicator" id="id2"></div><div class="mui-indicator" id="id3"></div><div class="mui-indicator" id="id4"></div></div>';

	//加载第一个图标
	/*var gauge = echarts.init(byId('gauge'+(data.length-1) +(data.length-1)));
	gauge.setOption(data[data.length-1].option);*/

	var ids = idAll.split('-');
	//加载图表
	for (var j = 0; j < ids.length - 1; j++) {
		var gauge = echarts.init(byId(ids[j]));
		gauge.setOption(data[j].option);
	}

	//		//加载第最后一个图标
	//		var gauge = echarts.init(byId('gauge00'));
	//		gauge.setOption(data[0].option);
	setCdsChart();
	setCdsChart_1();
	var gallery = mui('#kpiChartId');
	gallery.slider({
		interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
	});

	//自定义指标图形

	//页签切换
	mui('.idx-cdsTabs').on('tap', 'span', function() {
		setCdsChart(this.getAttribute('data-index'));
		for (var i = 0; i < this.parentNode.childNodes.length; i++) {
			this.parentNode.childNodes[i].classList.remove('ck');
		}
		this.classList.add('ck');
	});
}

var saveTopRemind = function() { //置顶
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!saveTopRemind.json',
		data: {
			popoverId: popoverId,
			bizType: bizType
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			getInfoRemindDatas();
			mui('#popover').popover('toggle');
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
			mui('#popover').popover('toggle');
		}
	});
}

var savedeleteRemind = function() { //删除
	var btnArray = ['是', '否'];
	mui.confirm('删除该条提醒？', '提示', btnArray, function(e) {
		if (e.index == 0) {
			var ws = plus.nativeUI.showWaiting();
			_App.ajax({
				type: "get",
				url: basePath + 'mktPassManageAction!savedeleteRemind.json',
				data: {
					popoverId: popoverId,
					bizType: bizType
				},
				cache: false,
				dataType: "json",
				success: function(response) {
					ws.close();
					getInfoRemindDatas();
					mui('#popover').popover('toggle');
				},
				error: function() {
					ws.close();
					mui.alert('加载失败！');
					mui('#popover').popover('toggle');
				}
			});
		} else {
			mui('#popover').popover('toggle');
		}
	});

}

function goNoticeDetail(data1, data2) {
	var url = "../finding/notice/noticeDetail.html?bizId=" + data1 + "&bizType=" + data2 + "&cwebviewObjId=" + cwebviewObjId;
	_App.util.goPage(url, {
		pageId: 'noticeDetail_id',
		refresh: true
	});
}

//绑定返回刷新事件(场景一)
window.addEventListener("refreshHPEvent__", function(event) {
	getInfoRemindDatas();
});




function saveNoRead() {

	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktPassManageAction!saveNoRead.json',
		data: {
			popoverId: popoverId,
			bizType: bizType,
			isRead: isRead
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			getInfoRemindDatas();
			mui('#popover').popover('toggle');
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
			mui('#popover').popover('toggle');
		}
	});
}