visitLogHist = {};
(function($) {
	var db;
	/**
	 * 默认配置
	 */
	var _config = {
		needVistLog: true, //是否记录用户行为数据：true-是；false-否
		webviewPage: 8, //页面跳转上传数据条数
		buttonPage: 3 //按钮触发上传数据条数

	};
	/**
	 * web sql 数据库
	 */
	var dbInfo = {
		dbName: "yusysDB", // 名称
		dbVersion: "0.1", // 版本
		dbDisplayName: "产品数据库", // 显示名称
		dbEstimatedSize: 5 * 1024 * 1024 // 大小 (byte) 
	};
	var openDB = function() {
		db = window.openDatabase(dbInfo.dbName, dbInfo.dbVersion,
			dbInfo.dbDisplayName, dbInfo.dbEstimatedSize);
	};
	//执行数据库创建
	if(!db) {
		openDB();
		//创建缓存表
		createDatabase();
	}
	if(_config.needVistLog) {
		// 扩展API加载完毕后调用onPlusReady回调函数 
		document.addEventListener("plusready", onPlusReady, false);//执行plusready的时候，执行onplusready函数
	}

	/**
	 * 创建本地用户行为数据表
	 * 字段说明:
	 * ID:主键id
	 * USER_ID：用户id
	 * UNIT_ID机构id
	 * VISIT_TIME访问时间
	 * CUR_VIEW_ID当前webviewid
	 * CUR_PATH当前页面路径
	 * CUR_TITLE_NAME当前页面功能名称
	 * LAST_PATH：上一页面路径
	 * LAST_TITLE_NAME：上一页面功能名称
	 * START_TIME：页面触发时间
	 * END_TIME：页面关闭时间
	 */
	function createDatabase() {
		db.transaction(function(tx) {
			tx.executeSql(
				"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_VISIT_LOG" +
				"(ID TEXT PRIMARY KEY," +
				"USER_ID TEXT,UNIT_ID TEXT," +
				"VISIT_TIME TEXT,CUR_VIEW_ID TEXT," +
				"CUR_PATH TEXT,CUR_TITLE_NAME TEXT," +
				"LAST_PATH TEXT,LAST_TITLE_NAME TEXT,START_TIME,END_TIME)", [],
				function() {
					insertDbArray();
					console.log("create OCRM_F_MOBILE_VISIT_LOG success");
				},
				dbError
			);
		});
		db.transaction(function(tx1) {
			tx1.executeSql(
				"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_BUTTON_LOG" +
				"(ID TEXT PRIMARY KEY,START_TIME TEXT,USER_ID TEXT,UNIT_ID TEXT,BUTTON_NAME TEXT)", [],
				function() {
					console.log("create OCRM_F_MOBILE_BUTTON_LOG success");
				},
				function(e) {
					console.log('create error' + e.message);
				}
			);
		});
	};
	var dgCount = -1; //控制递归函数insertDbArray的参数
	function insertDbArray() {
		if(localStorage.getItem('backData') != null) {//如果backData中有数据，则将数据存入本地ocrm_f_mobile_visit_log表
			var backData = JSON.parse(localStorage.getItem("backData"));
			var len = backData.id.length;
			dgCount = dgCount + 1;
			if(len != dgCount) {//遍历backdata中的数据，依次存入ocrm_f_mobile_visit_log表
				db.transaction(function(tx) {
					tx.executeSql("INSERT INTO OCRM_F_MOBILE_VISIT_LOG (ID,USER_ID,UNIT_ID,VISIT_TIME,CUR_VIEW_ID,CUR_PATH,CUR_TITLE_NAME,LAST_PATH,LAST_TITLE_NAME,START_TIME,END_TIME) VALUES(?,?,?,?,?,?,?,?,?,?,?)", [
						backData.id[dgCount],
						backData.userId[dgCount],
						backData.unitId[dgCount],
						backData.visitTime[dgCount],
						backData.curViewId[dgCount],
						backData.curPath[dgCount],
						backData.curTitleName[dgCount],
						backData.lastPath[dgCount],
						backData.lastTitleName[dgCount],
						backData.startTm[dgCount],
						backData.endTm[dgCount]
					], function(e) {
						insertDbArray();
					}, function(e) {
						console.log('insert error' + e.message);
					});
				});
			} else {//遍历完成后，清除backdata中的数据
				console.log("removeItem backData!!");
				localStorage.removeItem('backData');
			}
		}
	}
	function onPlusReady() {
		var nw = plus.webview.currentWebview();
		//上传数据
		submitData(); //对本地数据库中表OCRM_F_MOBILE_VISIT_LOG数据进行一次查询，看是否有数据没有上传到服务器，如果有，则将数据上传（页面跳转记录）
		submitButtonData(); //对本地数据库中表OCRM_F_MOBILE_BUTTON_LOG数据进行一次查询，看是否有数据没有上传到服务器，如果有，则将数据上传（按钮触发记录）
		//获取界面信息数据，并且将数据存入viewData中
		getVisitInfo();
		//监听关闭界面事件
		nw.addEventListener("close", submitVisitData, false); //关闭触发，提交访问记录
	}

	function submitData() {//查询ocrm_f_mobile_visit_log表中是否有数据，如果有则将数据封装在dbArray的json数组中，上传服务器保存数据
		try {
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM OCRM_F_MOBILE_VISIT_LOG ORDER BY START_TIME DESC", [], function(tx1, results) {
						var len = results.rows.length;
						if(len > 0) {
							var dbArray = {
								"id": [],
								"userId": [],
								"unitId": [],
								"visitTime": [],
								"curViewId": [],
								"curPath": [],
								"curTitleName": [],
								"lastPath": [],
								"lastTitleName": [],
								"startTm": [],
								"endTm": []
							}
							var i = 0;
							while(i < len && i < _config.webviewPage) {
								dbArray.id[i] = results.rows.item(i).ID;
								dbArray.userId[i] = results.rows.item(i).USER_ID;
								dbArray.unitId[i] = results.rows.item(i).UNIT_ID;
								dbArray.visitTime[i] = results.rows.item(i).VISIT_TIME;
								dbArray.curViewId[i] = results.rows.item(i).CUR_VIEW_ID;
								dbArray.curPath[i] = results.rows.item(i).CUR_PATH;
								dbArray.curTitleName[i] = results.rows.item(i).CUR_TITLE_NAME;
								dbArray.lastPath[i] = results.rows.item(i).LAST_PATH;
								dbArray.lastTitleName[i] = results.rows.item(i).LAST_TITLE_NAME;
								dbArray.startTm[i] = results.rows.item(i).START_TIME;
								dbArray.endTm[i] = results.rows.item(i).END_TIME;
								i++;
							}
							mui.ajax(basePath + 'mobileUserBehaviourAction!addWebviewBehave.json', {
								type: "GET",
								data: {
									dbArray: JSON.stringify(dbArray)
								},
								//								async:false,
								cache: false,
								dataType: "json",
								success: function(response) {
									/*
									 根据服务器返回的已保存数据的selectId，删除其对应的本地数据库中OCRM_F_MOBILE_VISIT_LOG表的数据
									 * */
									deleteById(response.selectIdArr);
								},
								error: function(e) {
									return false;
								}
							})
						}
					},
					function(e) {
						mui.alert(e);
					})
			})
		} catch(e) {
			console.log('error');
			//TODO handle the exception
		}
	}
	/*
	 批量提交按钮点击记录
	 * */
	function submitButtonData() {//通过查询本地表OCRM_FOCRM_F_MOBILE_BUTTON_LOG_MOBILE_BUTTON_LOG中的数据，若有数据，则封装在名为dbArray的json数组中，提交服务器进行存储
		try {
			db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM OCRM_F_MOBILE_BUTTON_LOG", [], function(tx1, results) {
						var len = results.rows.length;
						if(len > 0) {
							var dbArray = {
								"startTime": [],
								"userId": [],
								"unitId": [],
								"buttonName": [],
								"id": []
							};
							var i = 0;
							while(i < len && i < _config.buttonPage) {
								dbArray.id[i] = results.rows.item(i).ID;
								dbArray.startTime[i] = results.rows.item(i).START_TIME;
								dbArray.userId[i] = results.rows.item(i).USER_ID;
								dbArray.unitId[i] = results.rows.item(i).UNIT_ID;
								dbArray.buttonName[i] = results.rows.item(i).BUTTON_NAME;
								i++;
							}
							mui.ajax(basePath + 'mobileUserBehaviourAction!addWebviewButtonBehave.json', {
								type: "GET",
								data: {
									dabsArray: JSON.stringify(dbArray)
								},
								cache: false,
								dataType: "json",
								success: function(response) {
									/*
									 根据服务器返回的已保存数据的selectId，删除其对应的本地数据库中OCRM_F_MOBILE_BUTTON_LOG表的数据
									 * */
									deleteButtonById(dbArray);
								},
								error: function(r) {
									console.log("delete error");
								}
							})
						}
					},
					function(e) {
						mui.alert(e);
					})
			})
		} catch(e) {
			console.log('error');
			//TODO handle the exception
		}

	}
	/*
	 根据button按钮触发事件的主键id删除本地数据
	 * */
	var deleteButtonById = function(idArray) {
		var idSeqLen = idArray.id.length;
		db.transaction(function(tx2) {
			for(var i = 0; i < idSeqLen; i++) {
				tx2.executeSql(
					"DELETE FROM OCRM_F_MOBILE_BUTTON_LOG WHERE ID=?", [idArray.id[i]],
					function() {
						console.log('DELETE OCRM_F_MOBILE_BUTTON_LOG data success');
					},
					dbError
				)
			}
		})

	}
	var submitArray;
	/*
	 点击页面退回的时候将数据存入本地数据库
	 * */
	var submitVisitData = function() {
		makeSubmitArray();//重新组装viewData数据，并且将返回页面的信息存在submitArray中
		insertData(submitArray);//将返回页面的信息存入backData中
	}
	var makeSubmitArray = function() { //将需要提交的数据组装到submitArray里
		try {
			this.document.removeEventListener('click');
			//退出页面触发
			var endTimeArray = new Array;
			var endTime = (new Date().getTime() / 1000).toFixed(1); //结束时间
			var viewData = JSON.parse(localStorage.getItem("viewData"));
			var length = viewData.startTime.length; //获取当前viewData中数组长度
			var viewId = plus.webview.currentWebview().id; //当前页面webviewId
			var userIdArray = new Array;
			var unitIdArray = new Array;
			var startTimeArray = new Array;
			var viewIdArray = new Array;
			var viewPathArray = new Array;
			var currentTitleArray = new Array;
			var idArray = new Array;
			var startTmArray = new Array;
			var viewDataReset = {
				"id": [],
				"userId": [],
				"unitId": [],
				"startTime": [],
				"viewId": [],
				"viewPath": [],
				"currentTitle": [],
				"startTm": []
			};
			var i = 0;
			while(viewData.viewId[i] != viewId) {
				userIdArray.push(viewData.userId[i]);
				unitIdArray.push(viewData.unitId[i]);
				startTimeArray.push(viewData.startTime[i]);
				viewIdArray.push(viewData.viewId[i]);
				viewPathArray.push(viewData.viewPath[i]);
				currentTitleArray.push(viewData.currentTitle[i]);
				idArray.push(viewData.id[i]);
				startTmArray.push(viewData.startTm[i]);
				i++;
			}
			var visitTime = (endTime - viewData.startTime[i]).toFixed(1); //访问时长
			var timeData = new Date();
			var be = timeData.toLocaleDateString().replace(/[^0-9:\s]/g, '/');
			be = be.substring(0, be.length);
			var endTm = be + ' ' + timeData.getHours() + ':' + timeData.getMinutes() + ':' + timeData.getSeconds(); //开始时间：格式：年月日时分秒

			viewDataReset.userId = userIdArray;
			viewDataReset.unitId = unitIdArray;
			viewDataReset.startTime = startTimeArray;
			viewDataReset.viewId = viewIdArray;
			viewDataReset.viewPath = viewPathArray;
			viewDataReset.currentTitle = currentTitleArray;
			viewDataReset.id = idArray;
			viewDataReset.startTm = startTmArray;
			localStorage.removeItem('viewData');
			localStorage.setItem('viewData', JSON.stringify(viewDataReset));
			submitArray = {
				"id": [plus.storage.getItem('_userId').toString() + (new Date().getTime()).toString()],
				"userId": [plus.storage.getItem('_userId')],
				"unitId": [plus.storage.getItem('_unitId')],
				"visitTime": [visitTime],
				"curViewId": [viewData.viewId[i]],
				"curPath": [viewData.viewPath[i]],
				"curTitleName": [viewData.currentTitle[i]],
				"lastPath": [viewData.viewPath[i - 1]],
				"lastTitleName": [viewData.currentTitle[i - 1]],
				"startTm": [viewData.startTm[i]],
				"endTm": [endTm]
			};
		} catch(e) {
			console.log("error");
			//TODO handle the exception
			return;
		}
	}
	var DataSubmit = function(submitData) {
		try {
			mui.ajax(basePath + 'mobileUserBehaviourAction!addWebviewBehave.json', {
				data: {
					dbArray: JSON.stringify(submitData)
				},
				dataType: 'json',
				async: false,
				type: 'get',
				timeout: 5000,
				cache: false,
				success: function(response) {},
				error: function(e) {
					insertData(submitData);
				}
			})
		} catch(e) {
			//TODO handle the exception
			insertData(submitData);
			return;
		}

	}

	/*
	 将页面跳转的记录保存在本地的OCRM_F_MOBILE_VISIT_LOG表中
	 * */
	function insertData(inserData) {
		if(localStorage.getItem('backData') != null) {
			var backData = JSON.parse(localStorage.getItem("backData"));
			var len = backData.id.length;
			backData.id[len] = inserData.id;
			backData.userId[len] = inserData.userId;
			backData.unitId[len] = inserData.unitId;
			backData.visitTime[len] = inserData.visitTime;
			backData.curViewId[len] = inserData.curViewId;
			backData.curPath[len] = inserData.curPath;
			backData.curTitleName[len] = inserData.curTitleName;
			backData.lastPath[len] = inserData.lastPath;
			backData.lastTitleName[len] = inserData.lastTitleName;
			backData.startTm[len] = inserData.startTm;
			backData.endTm[len] = inserData.endTm;
			localStorage.removeItem('backData');
			localStorage.setItem('backData', JSON.stringify(backData));
		} else {
			var backData = {
				"id": [inserData.id],
				"userId": [inserData.userId],
				"unitId": [inserData.unitId],
				"visitTime": [inserData.visitTime],
				"curViewId": [inserData.curViewId],
				"curPath": [inserData.curPath],
				"curTitleName": [inserData.curTitleName],
				"lastPath": [inserData.lastPath],
				"lastTitleName": [inserData.lastTitleName],
				"startTm": [inserData.startTm],
				"endTm": [inserData.endTm]

			};
			localStorage.setItem('backData', JSON.stringify(backData));
		}
	}

	var getVisitInfo = function() { //加载页面触发
		try {
			var startTime = (new Date().getTime() / 1000).toFixed(1); //开始时间(格式：秒)
			var viewId = plus.webview.currentWebview().id; //当前页面webviewId
			var viewPath = plus.webview.currentWebview().getURL().split(_AppName)[1]; //当前界面路径
			var currentTitle; //header名称
			var timeData = new Date();
			var be = timeData.toLocaleDateString().replace(/[^0-9:\s]/g, '/');
			be = be.substring(0, be.length);
			var startTm = be + ' ' + timeData.getHours() + ':' + timeData.getMinutes() + ':' + timeData.getSeconds(); //开始时间：格式：年月日时分秒
			try {
				currentTitle = document.getElementsByClassName('mui-title')[0].innerHTML; //当前header名称
			} catch(e) {
				currentTitle = '';
			}
			if(localStorage.getItem('viewData') != null) {
				var viewData = JSON.parse(localStorage.getItem("viewData"));
				var length = viewData.startTime.length; //获取当前viewData中数组长度
				for(var i = 0; i < length; i++) {
					if(viewData.viewId[i] == viewId) {
						return;
					}
				}
				viewData.startTime[length] = startTime;
				viewData.viewId[length] = viewId;
				viewData.viewPath[length] = viewPath;
				viewData.currentTitle[length] = currentTitle;
				viewData.startTm[length] = startTm;
				localStorage.setItem('viewData', JSON.stringify(viewData));
			} else {
				var webviewData = {
					"id": [],
					"userId": [],
					"unitId": [],
					"startTime": [],
					"viewId": [],
					"viewPath": [],
					"currentTitle": [],
					"startTm": []
				};
				webviewData.startTime[0] = startTime;
				webviewData.viewId[0] = viewId;
				webviewData.viewPath[0] = viewPath;
				webviewData.currentTitle[0] = currentTitle;
				webviewData.startTm[0] = startTm;
				localStorage.setItem('viewData', JSON.stringify(webviewData));
			}
		} catch(e) {
			//TODO handle the exception
			console.log('error');
		}
	}

	function deleteById(idArray) {
		idArray = idArray.substring(0, idArray.length - 1);
		var idArr = idArray.split(',');
		var idSeqLen = idArr.length;
		db.transaction(function(tx2) {
			for(var i = 0; i < idSeqLen; i++) {
				tx2.executeSql(
					"DELETE FROM OCRM_F_MOBILE_VISIT_LOG WHERE ID=?", [idArr[i].substring(1, idArr[i].length - 1)],
					function() {
						console.log('DELETE OCRM_F_MOBILE_VISIT_LOG data success');
					},
					dbError
				)
			}
		})
	}

	function dbError(tx, error) {
		console.error(error);
	}

	function dbError(tx, error) {
		console.error(error);
	}
	visitLogHist.submitData = DataSubmit;
	console.log('MK-App-VisitLog init finished!');
}(mui))