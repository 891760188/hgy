var pageType = _App.util.getUrlParamByName("pageType");
var SPLIT = "@#@_@_@#@";
createDB();
createThinkTankTable();
//App配置信息
var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//分页配置
	pageInfoConfig: [{
		url: basePath + 'thinkTankAction.json', //查询URL
		//		url: {demoData: demoData1}, 						 //本地demo数据模式
		pageSize: 4, //分页大小
		scrollerId: 'item1mobile', //mui滚动区域div的ID
		getCondition: function() { //获取查询条件方法
			return "a=1&b=2"; //查询条件
		},
		success: function(response) { //成功回调方法
			var data = response.json.data;
			var table = document.getElementById('list1');
			var len = data.length;
			//加载时候添加输入框
			if (table.children.length == 0) {
				table.innerHTML = '<div class="mboSearch dark-input">' + '<input type="text" class="txtSearch" placeholder="输入关键字查找…" />' + '<span class="mui-icon mui-icon-search"></span>' + '</div>'
			}
			if (len > 0) {
				var s = "";
				for (var i = 0; i < len; i++) {
					var dTmp = data[i];
					if (undefined == dTmp || null == dTmp || "" == dTmp) {
						break;
					}
					var ul = document.createElement('ul');
					ul.className = 'mui-table-view mui-table-view-group';
					var thkId = dTmp.ID;
					var uId = dTmp.PUB_USER;
					var tilte = dTmp.TITLE;
					var userName = dTmp.USER_NAME;
					var orgName = dTmp.ORG_NAME;
					var path = dTmp.ATTACH_PATH;
					var optTime = dTmp.OPT_TIME;
					var valTmp = thkId + SPLIT + uId + SPLIT + tilte + SPLIT + userName + SPLIT + orgName + SPLIT + path + SPLIT + optTime + SPLIT + "0" + SPLIT + "0";
					if ("null" == userName || "" == userName || "NULL" == userName)
						userName = "不详"
					if ("null" == orgName || "" == orgName || "NULL" == orgName)
						orgName = "不详"
					ul.innerHTML = '<li id=' + thkId + ' class="liClass mui-table-view-cell thinkTankTop-table-view-cell toolHover"> ' + ' 		<a href="javascript:void();return false;" data-fun="' + path + '" class="mui-navigate-right"> ' + ' 			' + tilte + '' + ' 			<p>发布人：' + userName + '</p> ' + ' 			<p>发布机构：' + orgName + '</p> ' + ' 			<p>发布时间：' + optTime + '</p> ' + ' 		</a> '

					+ ' <div id="optDiv_' + thkId + '" class="mui-table-view-cell-bt thinkTankTop-button"> ' + '<button class="icon-share2">分享</button>' + '<button class="icon-bubble3">评论(2)</button>' + '<button class="icon-line-1134 hehe sc" data-val="' + valTmp + '">已收藏</button>' + '</div>' + '</li>';
					table.appendChild(ul);
					//查询客户端是否存在数据
						var caseSql = ' where ID=' + thkId;
						selectRecord(caseSql, function(rs, caseStr) {
							if (undefined == rs || null == rs || undefined == rs.rows || null == rs.rows || rs.rows.length <= 0) {
			
								var startNum = caseStr.indexOf("=");
								var idTmp = caseStr.substring(startNum + 1, caseStr.length)
								var tmpObj = document.getElementById("optDiv_" + idTmp);
								tmpObj.children[2].classList.remove('icon-line-1134');
								tmpObj.children[2].classList.add('icon-line-133');
								tmpObj.children[2].innerHTML = "收藏";
							} else {
								if(rs.rows.item(0).COLLECTION=="1"&&rs.rows.item(0).DOWNLOAD=="1"){
									var startNum = caseStr.indexOf("=");
									var idTmp = caseStr.substring(startNum + 1, caseStr.length)
									var tmpObj = document.getElementById("optDiv_" + idTmp);
									var vals=tmpObj.children[2].getAttribute('data-val');
									var vals1=vals.split(SPLIT);
									vals1[7]="1";
									vals1[8]="1";
									vals=vals1.join(SPLIT);
									tmpObj.children[2].setAttribute('data-val',vals);
								}else if (rs.rows.item(0).COLLECTION != "1") {
									var startNum = caseStr.indexOf("=");
									var idTmp = caseStr.substring(startNum + 1, caseStr.length)
									var tmpObj = document.getElementById("optDiv_" + idTmp);
									var vals=tmpObj.children[2].getAttribute('data-val');
									var vals1=vals.split(SPLIT);
									vals1[8]="1";
									vals=vals1.join(SPLIT);
									tmpObj.children[2].setAttribute('data-val',vals);
									tmpObj.children[2].classList.remove('icon-line-1134');
								    tmpObj.children[2].classList.add('icon-line-133');
									tmpObj.children[2].innerHTML = "收藏";
								}else{
									var startNum = caseStr.indexOf("=");
									var idTmp = caseStr.substring(startNum + 1, caseStr.length)
									var tmpObj = document.getElementById("optDiv_" + idTmp);
									var vals=tmpObj.children[2].getAttribute('data-val');
									var vals1=vals.split(SPLIT);
									vals1[7]="1";
									vals=vals1.join(SPLIT);
									tmpObj.children[2].setAttribute('data-val',vals);
								}
							}
						});
				}
				initOpr();
			}
		},
		error: function() { //失败回调方法
			//alert('error!');
		}
	}],
	//ui加载完成调用
	uiReady: function() {

	},
	//设备资源加载完成调用
	deviceReady: function() {

		for (var i = 0; i < _App.pullToRefreshFactory.scrollers.length; i++) {
			_App.pullToRefreshFactory.scrollers[i].loadData(true);
		}
		plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {

		}, function(e) {
			alert("Request file system failed: " + e.message);
		});
	}
};
/**
 * 页面初始化
 */
_App.init(appConfig);

var viewword = function(fileN) {
	if (plus.os.name == "Android") {
		plus.runtime.openFile(fileN);
	} else { 
		if(fileN.indexOf(".pdf") != -1){
			_App.util.goPage('thinkTankTopSee.html?file=' + fileN);
		}else{
			plus.runtime.openFile(fileN);
		}
	}
};

function initOpr() {
	mui('.mui-table-view-cell').on('tap', '.mui-navigate-right', function() {
		var fileName = this.getAttribute("data-fun");
		if (undefined != fileName && "" != fileName && "null" != fileName) {
			var content = this.parentElement.children[1].children[2].getAttribute('data-val');
			existFile(fileName, "THINK_TANK", content.split(SPLIT), viewword);
		} else
			mui.alert("没有附件！");
	});
	document.querySelector('.mui-slider').addEventListener('slide', function(e) {
		if (e.detail.slideNumber === 1) {
			var caseSql = " where COLLECTION='1'";
			var myFavtable = document.getElementById('myFavoriteTab');
			selectRecord(caseSql, function(rs) {
				if (undefined != rs && null != rs && undefined != rs.rows && null != rs.rows && rs.rows.length > 0) {

					var len = rs.rows.length,
						i;
					myFavtable.children[0].children[0].innerHTML = "";
					for (i = 0; i < len; i++) {
						var dTmp = rs.rows.item(i);
						if (undefined == dTmp || null == dTmp || "" == dTmp) {
							continue;
						}
						var ul = document.createElement('ul');
						ul.className = 'mui-table-view mui-table-view-group';

						var thkId = dTmp.ID;
						var tilte = dTmp.TITLE;
						var userName = dTmp.USER_NAME;
						var orgName = dTmp.ORG_NAME;
						var path = dTmp.ATTACH_PATH;
						var optTime = dTmp.OPT_TIME;
						var col = dTmp.COLLECTION;
						var down = dTmp.DOWNLOAD;
						var valTmp = thkId + SPLIT + "ss" + SPLIT + tilte + SPLIT + userName + SPLIT + orgName + SPLIT + path + SPLIT + optTime + SPLIT + col + SPLIT + down;
						if ("null" == userName || "" == userName || "NULL" == userName)
							userName = "不详"
						if ("null" == orgName || "" == orgName || "NULL" == orgName)
							orgName = "不详"
						ul.innerHTML = '<li class="mui-table-view-cell toolHover"> ' + ' 		<a data-id="' + thkId + '" data-fun="' + path + '" class="mui-navigate-right2"> ' + ' 			' + tilte + '' + ' 			<p>发布人：' + userName + '</p> ' + ' 			<p>发布机构：' + orgName + '</p> ' + ' 			<p>发布时间：' + optTime + '</p> ' + ' 		</a> ' + ' <div class="mui-table-view-cell-bt thinkTankTop-button" style="float:right;"> ' + '<button class="icon-line-1134 hehe sc1" data-val="' + valTmp + '" style="margin-left: 200px;">移出收藏夹</button>' + '</div>' + ' 	</li>';

						myFavtable.children[0].children[0].appendChild(ul);
					}
					mui('.mui-table-view-cell').on('tap', '.mui-navigate-right2', function() {

						var fileName = this.getAttribute("data-fun");
						if (undefined != fileName && "" != fileName && "null" != fileName) {
							var content = this.parentElement.children[1].children[0].getAttribute('data-val');
							existFile(fileName, "THINK_TANK", content.split(SPLIT), viewword);
						} else
							mui.alert("没有附件！");

					});
				} else {
					myFavtable.children[0].children[0].innerHTML = "<div style='text-align:center;margin-top:50%;'>您还没收藏文档</div>";
				}
				mui('.mui-table-view-cell').on('tap', '.hehe.sc1', function() {
					var data = this.getAttribute("data-val");
					if (undefined != data && "" != data && "null" != data) {
						var dTmp = data.split(SPLIT);
						delData(dTmp[0]);
						if (dTmp[8] == "1") {
							dTmp[7] = "0";
							insertRecord(dTmp);
						}
						this.parentElement.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement.parentElement);
						var table = document.getElementById('list1');
						for (var i = 1; i < table.children.length; i++) {
							if (table.children[i].children[0].getAttribute('id') == dTmp[0]) {
								var vals=table.children[i].children[0].children[1].children[2].getAttribute('data-val');
								var vals1=vals.split(SPLIT);
								vals1[7]="0";
								vals=vals1.join(SPLIT);
								table.children[i].children[0].children[1].children[2].setAttribute('data-val',vals);
								table.children[i].children[0].children[1].children[2].innerHTML = "收藏";
								table.children[i].children[0].children[1].children[2].classList.remove('icon-line-1134');
								table.children[i].children[0].children[1].children[2].classList.add('icon-line-133');
							}
						}
						if(document.getElementById('myFavoriteTab').children[0].children[0].children.length==0){
							document.getElementById('myFavoriteTab').children[0].children[0].innerHTML="<div style='text-align:center;margin-top:50%;'>您还没收藏文档</div>"
						}
						mui.toast("移出收藏夹成功！");
					}
				});
			});
		} else if (e.detail.slideNumber === 2) {
			var caseSql = " where DOWNLOAD='1'";
			var myDowtable = document.getElementById('myDownloadTab');
			selectRecord(caseSql, function(rs) {
				if (undefined != rs && null != rs && undefined != rs.rows && null != rs.rows && rs.rows.length > 0) {
					var len = rs.rows.length,
						i;

					myDowtable.children[0].children[0].innerHTML = "";
					for (i = 0; i < len; i++) {
						var dTmp = rs.rows.item(i);
						if (undefined == dTmp || null == dTmp || "" == dTmp) {
							continue;
						}
						var ul = document.createElement('ul');
						ul.className = 'mui-table-view mui-table-view-group';

						var thkId = dTmp.ID;
						var tilte = dTmp.TITLE;
						var userName = dTmp.USER_NAME;
						var orgName = dTmp.ORG_NAME;
						var path = dTmp.ATTACH_PATH;
						var optTime = dTmp.OPT_TIME;
						var col = dTmp.COLLECTION;
						var down = dTmp.DOWNLOAD;
						var valTmp = thkId + SPLIT + "ss" + SPLIT + tilte + SPLIT + userName + SPLIT + orgName + SPLIT + path + SPLIT + optTime + SPLIT + col + SPLIT + down;
						if ("null" == userName || "" == userName || "NULL" == userName)
							userName = "不详"
						if ("null" == orgName || "" == orgName || "NULL" == orgName)
							orgName = "不详"
						ul.innerHTML = '<li class="mui-table-view-cell toolHover"> ' + ' 		<a data-id="' + thkId + '" data-fun="' + path + '" class="mui-navigate-right3"> ' + ' 			' + tilte + '' + ' 			<p>发布人：' + userName + '</p> ' + ' 			<p>发布机构：' + orgName + '</p> ' + ' 			<p>发布时间：' + optTime + '</p> ' + ' 		</a> ' + ' <div class="mui-table-view-cell-bt thinkTankTop-button"> ' + '<button class="icon-line-1134 hehe sc2" data-val="' + valTmp + '">删除下载</button>' + '</div>' + ' 	</li>';

						myDowtable.children[0].children[0].appendChild(ul);
					}
					mui('.mui-table-view-cell').on('tap', '.mui-navigate-right3', function() {

						var fileName = this.getAttribute("data-fun");
						if (undefined != fileName && "" != fileName && "null" != fileName) {
							var content = this.parentElement.children[1].children[0].getAttribute('data-val');
							existFile(fileName, "THINK_TANK", content.split(SPLIT), viewword);
						} else
							mui.alert("没有附件！");
					});
				} else {
					myDowtable.children[0].children[0].innerHTML = "<div style='text-align:center;margin-top:50%;'>您还没下载</div>"
				}
				mui('.mui-table-view-cell').on('tap', '.hehe.sc2', function() {
					var data = this.getAttribute("data-val");
					if (undefined != data && "" != data && "null" != data) {
						var dTmp = data.split(SPLIT);
						delData(dTmp[0]);
						if (dTmp[7] == "1") {
							dTmp[8] = "0";
							insertRecord(dTmp);
						}
						delFile(dTmp[5], "THINK_TANK", null);
						var table = document.getElementById('list1');
						for (var i = 1; i < table.children.length; i++) {
							if (table.children[i].children[0].getAttribute('id') == dTmp[0]) {
								var vals=table.children[i].children[0].children[1].children[2].getAttribute('data-val');
								var vals1=vals.split(SPLIT);
								vals1[8]="0";
								vals=vals1.join(SPLIT);
								table.children[i].children[0].children[1].children[2].setAttribute('data-val',vals);
							}
						}
						this.parentElement.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement.parentElement);
						if(document.getElementById('myDownloadTab').children[0].children[0].children.length==0){
							document.getElementById('myDownloadTab').children[0].children[0].innerHTML="<div style='text-align:center;margin-top:50%;'>您还没下载</div>"
						}
						mui.toast("删除成功！");
					}
				});
			});
		}
	});
	mui('.mui-table-view-cell').on('tap', '.hehe.sc', function() {
		if (this.innerHTML != "已收藏") {
			var data = this.getAttribute("data-val");
			if (undefined != data && "" != data && "null" != data) {
				var dTmp = data.split(SPLIT);
				if(dTmp[8]=="1"){
					delData(dTmp[0]);
				}
				dTmp[7] = "1";
				insertRecord(dTmp);
				var vals=dTmp.join(SPLIT);
				this.setAttribute('data-val',vals);
				this.classList.remove('icon-line-133');
				this.classList.add('icon-line-1134');
				this.innerHTML = "已收藏";
				mui.toast("收藏成功！");
			}
		}
	});
}
//搜索数据
function searchContent() {
	var key = document.getElementById("keySearch").value;
	var condition = "";
	if (undefined != key && key.trim() != "") {
		condition = "?keyStr=" + encodeURI(key);
	} else {
		return false;
	}

	appConfig.pageInfoConfig.url = basePath + 'thinkTankAction.json' + condition
	appConfig.pageInfoConfig.start = 0, //开始记录行数

		_App.init(appConfig);

	var pageQuery = _App.scroller;
	if (pageQuery) {
		pageQuery.loadData(true); //flag :true 下拉;false 上拉
	}

}

var dtask = null;
/*
 * desc:下载文件
 * fileName:需要下载的文件名称
 * optType：操作模块类型，eg:THINK_TANK:掌上智库文件
 * backFun：回调函数
 */
function downFile(fileName, optType, content, backFun) {
	if (undefined == fileName || "" == fileName || "null" == fileName)
		return false;
	//需要截取文件名
	var fileName = fileName;
	if (fileName.indexOf("/") != -1)
		fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
	if (fileName.indexOf("：") != -1)
		fileName = fileName.split("：")[1];
	var durl = basePath + "AnnexeDownload?filename=" + fileName + "&annexeName=" + fileName;
	var saveLocalFile = "_doc";

	if (optType == "THINK_TANK")
		saveLocalFile += "/THINK_TANK/" + fileName;
	else {
		saveLocalFile += "/COMMON/" + fileName;
	}
	var options = {
		method: "GET",
		filename: saveLocalFile
	};
	dtask = plus.downloader.createDownload(durl, options, function(d, status) {
		// 下载完成
		if (status == 200) {
				if (optType == "THINK_TANK") {
				var path = plus.io.convertLocalFileSystemURL(d.filename);
				path = "file://" + path;
				if (undefined == content || "" == content){
					return;
				}
				var thkId = content[0];
				var col = content[7];
				var down = content[8];
				if (col == "1") {
					delData(thkId);
				}
				content[8] = "1";
				insertRecord(content, backFun);
				var table = document.getElementById('list1');
						for (var i = 1; i < table.children.length; i++) {
							if (table.children[i].children[0].getAttribute('id') == thkId) {
								var vals=content.join(SPLIT);
								table.children[i].children[0].children[1].children[2].setAttribute('data-val',vals);
							}
						} 
				if (undefined != backFun) {
					if(plus.os.name=="iOS"){
						backFun(saveLocalFile);
					}else{
						backFun(path);
					}
				}
			}
			

		} else {
			mui.toast("下载异常，稍后重试！");
		}
	});
	dtask.addEventListener( "statechanged", onStateChanged, false );
	dtask.start();
}
var dowmShow=document.querySelector('.mui-icon-download');
var think_sch=document.getElementById('think_sch');
var think_schs=document.getElementById('think_schs');
var s1 = document.querySelectorAll('.progress >.progress-bar');
dowmShow.addEventListener('tap',function(){
	plus.downloader.enumerate( function ( tasks ) {
		if(tasks.length==1){
			mui('#popover').popover('toggle');
		}else{
			mui.toast('当前无下载任务');
		}
	} );
});
//下载任务进度
function onStateChanged(download, status){
	if(!dtask){return;}
    	switch(download.state) {
    		case 1: // 开始
    		break;
    		case 2: // 已连接到服务器
    			mui('#popover').popover('toggle');
    		break;
    		case 3:	// 已接收到数据
    		    var bitVal = Math.floor(download.downloadedSize/download.totalSize*100);
    			think_sch.innerHTML="下载进度："+bitVal+"%";
    			s1[0].style.width = bitVal+"%";
				s1[0].style.backgroundColor = '#18b30d';
    		break;
    		case 4:	// 下载完成
    			//outLine( task.totalSize );
    			mui('#popover').popover('hide');
    			think_sch.innerHTML="下载进度：";
	    		s1[0].style.width = 0;
	    		s1[0].style.backgroundColor='';
    			think_sch.innerHTML="下载完成";
    		break;
    	}
}
/*
 * desc:判断文件是否存在
 * fileName:需要下载的文件名称
 * optType：操作模块类型，eg:THINK_TANK:掌上智库文件
 * backFun：回调函数
 */
function existFile(fileName, optType, content, backFun) {
	var flag = false;
	if (undefined == fileName || "" == fileName || "null" == fileName)
		return false;
	//需要截取文件名
	var fileName = fileName;
	if (fileName.indexOf("/") != -1)
		fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
	if (fileName.indexOf("：") != -1)
		fileName = fileName.split("：")[1];
	var tmpPath = "_doc";

	if (optType == "THINK_TANK")
		tmpPath += "/THINK_TANK/" + fileName;
	else {
		tmpPath += "/COMMON/" + fileName;
	}

	plus.io.resolveLocalFileSystemURL(tmpPath, function(entry) {
		if (optType == "THINK_TANK") {
			var path = plus.io.convertLocalFileSystemURL(tmpPath);
			path = "file://" + path;
			if (undefined != backFun) {
				if(plus.os.name=="iOS"){
					backFun(tmpPath);
				}else{
					backFun(path);
				}
			}
		}
	}, function(error) {
		downFile(fileName, "THINK_TANK", content, viewword);
	});
}
//删除文件
function delFile(fileName, optType, backFun) {
	if (undefined == fileName || "" == fileName || "null" == fileName)
		return false;
	//需要截取文件名
	var fileName = fileName;
	if (fileName.indexOf("/") != -1)
		fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
	if (fileName.indexOf("：") != -1)
		fileName = fileName.split("：")[1];
	var tmpPath = "_doc";

	if (optType == "THINK_TANK")
		tmpPath += "/THINK_TANK/" + fileName;
	else {
		tmpPath += "/COMMON/" + fileName;
	}

	plus.io.resolveLocalFileSystemURL(tmpPath, function(entry) {
		if (optType == "THINK_TANK") {
			entry.remove(function(entry) {
				var path = plus.io.convertLocalFileSystemURL(tmpPath);
				path = "file://" + path;
				if (undefined != backFun) {
					alert("exist");
					backFun(path);
				}
			}, function(e) {});

		}
	}, function(error) {});
}