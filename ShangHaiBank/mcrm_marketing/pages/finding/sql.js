var dbInfo = {
	dbName: "yusysDB", // 名称
	dbVersion: "0.1", // 版本
	dbDisplayName: "产品数据库", // 显示名称
	dbEstimatedSize: 10 * 1024 * 1024 // 大小 (byte) 
};

var db;
var articleList;//标题集合
function OpenDB() {
	db = window.openDatabase(dbInfo.dbName, dbInfo.dbVersion,
		dbInfo.dbDisplayName, dbInfo.dbEstimatedSize);
	console.log('成功打开数据库');
}

function dbError(tx, error) {
	console.error(error);
}

//标题表

function createArticle() {
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_ARTICLE" +
			"(ID INTEGER PRIMARY KEY,ARTICLE TEXT,ARTICLE_NAME TEXT)", [],
			function() {
				console.log('OCRM_F_MOBILE_ARTICLE created successfully!');
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(1,'LOG','日志')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(2,'SCH','日程')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(3,'SCENE','场景')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(4,'SIGN','签到')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(5,'SHARE','分享')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(6,'ANT','@我的')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(7,'SP','审批')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(8,'OPP','商机')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(9,'YEJI','业绩')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(10,'GG','公告')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(11,'XTYX','协同营销')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE (ID,ARTICLE,ARTICLE_NAME) VALUES(12,'KHZJ','客户转介')");
			
			},
			dbError
		);
	});
}
/**
 * 标题应用表   status 0 ----未应用   1----应用
 */
function createArticleApp(userId) {
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_ARTICLE_APP" +
			"(ID INTEGER PRIMARY KEY,ARTICLE_ID TEXT,STATUS TEXT,USER_ID TEXT,ORDER_ID TEXT )", [],
			function() {
				console.log('OCRM_F_MOBILE_ARTICLE_APP created successfully!');
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(1,'1','1','"+userId+"','1')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(2,'2','1','"+userId+"','2')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(3,'3','1','"+userId+"','3')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(4,'4','1','"+userId+"','4')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(7,'7','0','"+userId+"','7')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(8,'8','0','"+userId+"','8')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(9,'9','0','"+userId+"','9')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(10,'10','0','"+userId+"','10')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(11,'11','0','"+userId+"','11')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (ID,ARTICLE_ID,STATUS,USER_ID,ORDER_ID) VALUES(12,'12','0','"+userId+"','12')");
				console.log('success!') 
			},
			dbError
		);
	});
}

/**
 * 标题默认表
 */
function createArticleDefault() {
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_ARTICLE_DEFAULT" +
			"(ID INTEGER PRIMARY KEY,DEFAULT_ID TEXT)", [],
			function() {
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_DEFAULT (ID,DEFAULT_ID) VALUES(1,'1')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_DEFAULT (ID,DEFAULT_ID) VALUES(2,'2')");
//				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_DEFAULT (ID,DEFAULT_ID) VALUES(3,'3')");
				tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_DEFAULT (ID,DEFAULT_ID) VALUES(4,'4')");
				console.log('OCRM_F_MOBILE_ARTICLE_DEFAULT created successfully!');
			},
			dbError
		);
	});
}
/*
 * 暂时没有用到
 */
function saveArticle(user_id, articleId, status) {
	if(undefined == user_id || "" == user_id) {
		return;
	}
	if(undefined == articleId || "" == articleId) {
		return;
	}
	if(undefined == status || "" == status) {
		return;
	}

	db.transaction(function(tx) {
		tx.executeSql("INSERT INTO OCRM_F_MOBILE_ARTICLE_APP (user_id,articleId,status) VALUES('" + user_id + "','" + articleId + "','" + status + "')", function() {
			console.log('插入成功');
		})
	});
}

function queryArticle(user_id,backFun) {
	if(undefined == user_id || "" == user_id) {
		return;
	}
	db.transaction(function(tx) {
		//SELECT a.*,t.* FROM OCRM_F_MOBILE_ARTICLE_APP a ,OCRM_F_MOBILE_ARTICLE t  WHERE  t.id  = a.articleId and a.userId='"+user_id+"' and a.status=1
		tx.executeSql("SELECT t.* FROM OCRM_F_MOBILE_ARTICLE_APP t where t.USER_ID='"+user_id+"'", [], function(tx1, results) {
				var len = results.rows.length;
				if(len < 1) {
					//小于0，说明用户没有进行初始化
					tx.executeSql("SELECT d.* FROM OCRM_F_MOBILE_ARTICLE_DEFAULT d", [], function(tx1, results) {
						var l = results.rows.length;
						articleList= new Array();
						for(var n = 0; n < l; n++) {
							var x = results.rows.item(n);
							articleList.push(x);
						}
						if (backFun) {
							backFun(articleList);
						}
						
					});
				} else {
					//获取用户设置数据
					tx.executeSql("SELECT a.*,t.* FROM OCRM_F_MOBILE_ARTICLE_APP a ,OCRM_F_MOBILE_ARTICLE t  WHERE  t.ID  = a.ARTICLE_ID  and a.USER_ID='"+user_id+"' and a.STATUS='1' ORDER BY a.ORDER_ID", [], function(tx1, result) {
						var l = result.rows.length;
						articleList= new Array();
						for(var n = 0; n < l; n++) {
							var x = result.rows.item(n);
							articleList.push(x);
						}
						if (backFun) {
							backFun(articleList);
						}
					})
				}

			},
			function(e) {
				alert(e);
			})
	})
}
/*
 * 暂时没有用到
 */
function updateArticle(user_id, articleId, status) {
	if(undefined == user_id || "" == user_id) {
		return;
	}
	if(undefined == articleId || "" == articleId) {
		return;
	}
	if(undefined == status || "" == status) {
		return;
	}

	db.transaction(function(tx) {
		tx.executeSql(" UPDATE OCRM_F_MOBILE_ARTICLE SET ", function() {
			console.log('插入成功');
		})
	});
}
 
/**
 * 获取标题
 */
function getArticle(userId,backFn) {
	db.transaction(function(tx) {
		//获取用户设置数据
		tx.executeSql("SELECT a.*,t.* FROM OCRM_F_MOBILE_ARTICLE_APP a ,OCRM_F_MOBILE_ARTICLE t  WHERE  t.ID  = a.ARTICLE_ID  and a.USER_ID='"+userId+"'", [], function(tx1, result) {
			var l = result.rows.length;
			articleList= new Array();
			for(var n = 0; n < l; n++) {
				var x = result.rows.item(n);
				articleList.push(x);
			}
			if (backFn) {
				backFn(articleList);
			}
		})
				
	});
}
/**
 * 设置标题应用
 * @param {Object} articleId  标题ID
 * @param {Object} status  状态  是否应用
 */

function setArticle(articleId,status,userId,order) {
	db.transaction(function(tx) {
		tx.executeSql("UPDATE OCRM_F_MOBILE_ARTICLE_APP SET STATUS='"+status+"' , ORDER_ID ='"+order+"' where ARTICLE_ID = '"+articleId+"' and USER_ID = '"+userId+"'", function() {
			console.log('修改成功');
		})
	});
}