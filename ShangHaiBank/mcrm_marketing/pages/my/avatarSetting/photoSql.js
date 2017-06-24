var dbInfo = {
	dbName: "yusysDB", // 名称
	dbVersion: "0.1", // 版本
	dbDisplayName: "产品数据库", // 显示名称
	dbEstimatedSize: 10 * 1024 * 1024 // 大小 (byte) 
};

var db;

function OpenDB() {
	db = window.openDatabase(dbInfo.dbName, dbInfo.dbVersion,
		dbInfo.dbDisplayName, dbInfo.dbEstimatedSize);
	console.log('成功打开数据库');
}

function dbError(tx, error) {
	console.error(error);
}

//头像数据库

function createPhotoTable() {
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_PHOTO" +
			"(ID INTEGER PRIMARY KEY,USER_ID TEXT,PHOTO_SRC TEXT,OLD_PATH TEXT)", [],
			function() {
				console.log('OCRM_F_MOBILE_PHOTO created successfully!');
			},
			dbError
		);
	});
}

function saveLocalPhotoPath(user_id, photoSrc) {
	if(undefined == user_id || "" == user_id) {
		return;
	}
	if(undefined == photoSrc || "" == photoSrc) {
		return;
	}

	db.transaction(function(tx) {
		tx.executeSql('SELECT MAX(ID) AS cot,PHOTO_SRC FROM OCRM_F_MOBILE_PHOTO', [], function(tx1, results) {
			var len = results.rows.length;
			var count = results.rows.item(0).cot;
			var oldPath = results.rows.item(0).PHOTO_SRC;
			if(count == '' || undefined == count) {
				count = 0;
			}
			var keyID = 1 + count;
			alert(keyID)
			db.transaction(function(tx) {
				var sql = 'INSERT INTO OCRM_F_MOBILE_PHOTO(ID,USER_ID,PHOTO_SRC) ';
				sql += " VALUES ('" + keyID + "','" + user_id + "','" + photoSrc + "','" + oldPath + "')";
				console.log("sql>>>>>>>>>>>" + sql);
				db.transaction(function(tx) {
					tx.executeSql(sql);
				})
			});
		})
	})
}