/*
 * desc:数据库web sql 操作
 */
var dbInfo = {
	dbName: "yusysDB", // 名称
	dbVersion: "0.1", // 版本
	dbDisplayName: "产品数据库", // 显示名称
	dbEstimatedSize: 10 * 1024 * 1024 // 大小 (byte) 
};

var db;

function createDB() {
	db = window.openDatabase(dbInfo.dbName, dbInfo.dbVersion,
		dbInfo.dbDisplayName, dbInfo.dbEstimatedSize);
}

function dbError(tx, error) {
	console.error(error);
}

//创建掌上智库数据库
function createThinkTankTable() { //Price REAL,
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_THINKTANK " +
			"(ID INTEGER PRIMARY KEY, TITLE TEXT,USER_NAME TEXT,ORG_NAME TEXT,ATTACH_PATH TEXT,OPT_TIME TEXT,COLLECTION TEXT,DOWNLOAD TEXT)", [],
			function() {
				console.log('OCRM_F_MOBILE_THINKTANK created successfully!');
			},
			dbError
		);
	});
}

function selectRecord(caseSql, backFun) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM OCRM_F_MOBILE_THINKTANK ' + caseSql, [], function(tx, results) {
			if (undefined != backFun) {
				backFun(results, caseSql);
			}
		}, dbError);
	});
}

function insertRecord(dTmp, backFun) {
	if (undefined == dTmp || "" == dTmp)
		return;
	var thkId = dTmp[0];
	var uId = dTmp[1];
	var tilte = dTmp[2];
	var userName = dTmp[3];
	var orgName = dTmp[4];
	var path = dTmp[5];
	var optTime = dTmp[6];
	var col = dTmp[7];
	var down = dTmp[8];

	var sql = 'INSERT INTO OCRM_F_MOBILE_THINKTANK (ID, TITLE,USER_NAME,ORG_NAME,ATTACH_PATH,OPT_TIME,COLLECTION,DOWNLOAD)' + ' VALUES(' + thkId + ', "' + tilte + '", "' + userName + '", "' + orgName + '", "' + path + '", "' + optTime + '", "' + col + '", "' + down + '") ';

	db.transaction(function(tx) {
		tx.executeSql(sql);
	});

}

function delData(id) {
	db.transaction(function(tx) {
		tx.executeSql(
			"delete from OCRM_F_MOBILE_THINKTANK where ID= ?", [id],
			function(tx, result) {},
			function(tx, error) {
				alert('删除失败: ' + error.message);
			});
	});
}