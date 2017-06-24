 var dbInfo={ 
	dbName:"yusysDB",  // 名称
    dbVersion:"0.1", // 版本
    dbDisplayName:"产品数据库", // 显示名称
    dbEstimatedSize:10*1024*1024  // 大小 (byte) 
 }; 
		
 var db; 
 function createDB(){ 
	 db = window.openDatabase(dbInfo.dbName , dbInfo.dbVersion , 
		 dbInfo.dbDisplayName , dbInfo.dbEstimatedSize); 
		 console.log('成功创建产品数据库');
 } 


 function dbError(tx, error){ 
	 console.error(error);  
 } 


//创建草稿箱数据库
//字段依次为主键ID，业务类型:(1--签到)，业务ID，时间，操作人，备注(地址)，标题
function createDraftTable() {
	db.transaction(function(tx) {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_DRAFT" +
			"(ID INTEGER PRIMARY KEY,BUSINESS_TYPE TEXT,BUSINESS_ID INTEGER,OP_TIME TEXT,OP_USER TEXT,TITLE TEXT,REMARK TEXT)", [],
			function() {
				console.log('OCRM_F_MOBILE_DRAFT created successfully!');
			},
			dbError
		);
	});
}

// //创建签到表
// //字段依次为主键ID，地址，关联客户，关联联系人，经度，维度，备注
function createSignTable() {
	var s = "CREATE TABLE IF NOT EXISTS OCRM_F_MOBILE_SIGN";
	s += "(ID INTEGER PRIMARY KEY,";//主键ID
	s += "SIGN_ADDRESS TEXT,";//地址
	s += "SIGN_CUSTNAME TEXT,";//关联客户
	s += "SIGN_CUSTNAMES TEXT,";//关联联系人
	s += "SIGN_LON TEXT,";//经度
	s += "SIGN_LAT TEXT,";//维度
	s += "SIGN_CONTENT TEXT,";//签到详情
	s += "CUST_ID TEXT,";//客户经理ID
	s += "SCH_ID TEXT,";//关联的日程ID
	s += "SCH_NAME TEXT,";//关联的日程名称
	s += "ACTIVITY_ID TEXT,";//关联的活动ID
	s += "ACTIVITY_NAME TEXT";//关联的活动名称
	s += ")";
	db.transaction(function(tx) {
		tx.executeSql(s, [],
			function() {
				console.log('OCRM_F_MOBILE_SIGN create successfully!');
			},
			dbError
		);
	});
}
//保存到签到草稿箱
function saveSign(signData, draftData) {
	if (undefined == signData || "" == signData) {
		return;
	}
	if (undefined == draftData || "" == draftData) {
		return;
	}
	var signCount = '';
	var draftCount = '';
	//查询草稿箱的最大ID
	db.transaction(function(tx) {
		tx.executeSql('SELECT MAX(ID) AS cot FROM OCRM_F_MOBILE_DRAFT', [], function(tx1, results) {
			var len = results.rows.length;
			var count = results.rows.item(0).cot;
			if (count == ''||undefined==count) {
				count = 0;
			}
			signCount = 1 + count;
			draftCount = 1 + count;
			var sql1 ='INSERT INTO OCRM_F_MOBILE_SIGN(ID,SIGN_ADDRESS,SIGN_CUSTNAME,SIGN_CUSTNAMES,SIGN_LON,SIGN_LAT,SIGN_CONTENT,CUST_ID'
			+ ') ';
			sql1 += "VALUES ('"+signCount+"','"+signData[0]+"','"+signData[1]+"',";
			sql1 += "'"+signData[2]+"','"+signData[3]+"','"+signData[4]+"','"+signData[5]+"','"+signData[6]+"'";
			sql1 += ')';
			
//			console.log("sql1>>>>"+sql1);
			
			var sql2 ='INSERT INTO OCRM_F_MOBILE_DRAFT(ID,BUSINESS_TYPE,BUSINESS_ID,OP_TIME,OP_USER,TITLE,REMARK) ';
			sql2 += " VALUES ('"+draftCount+"','"+draftData[0]+"','"+draftCount+"','"+draftData[1]+"','"+draftData[2]+"','"+draftData[3]+"','"+draftData[4]+"')";
			
//			console.log("sql2>>>>>>>>>>>"+sql2);
			db.transaction(function(tx){
				tx.executeSql(sql1);
			})
			
			db.transaction(function(tx) {
				tx.executeSql(sql2);
				mui.toast('成功保存到草稿箱');
			});
		},function(tx2, error){});
	});

}
//获取草稿箱数据
function getDraftData(caseSql, backFun) {
	db.transaction(function(tx) {
		tx.executeSql('SELECT * FROM OCRM_F_MOBILE_DRAFT '+caseSql, [], function(tx1, results) {
			var len = results.rows.length;
			if (backFun) {
				backFun(results);
			}
		}, dbError);
	});
}
//获取签到表数据
function getSignData(caseSql, backFun){
	db.transaction(function(tx) {
		var sql = 'SELECT * FROM OCRM_F_MOBILE_SIGN '+caseSql;
		console.log(sql);
		tx.executeSql(sql, [], function(tx1, results) {
			var len = results.rows.length;
			if (backFun) {
				backFun(results);
			}
		}, dbError);
	});
}
//删除数据
function deleteDraft(caseSql,backFun){
	db.transaction(function(tx) {
		//获取业务ID
		tx.executeSql('SELECT * FROM OCRM_F_MOBILE_DRAFT '+caseSql, [], function(tx, results) {
			var len = results.rows.length;
			var data = results.rows.item(0);
			var busType= data.BUSINESS_TYPE;
			//如果等于1，则表示签到表
			if(1*busType==1){
				//从签到表中删除
				tx.executeSql('DELETE  FROM OCRM_F_MOBILE_SIGN '+caseSql, [], function(tx, results) {
					console.log('成功从签到表删除');
					tx.executeSql('DELETE  FROM OCRM_F_MOBILE_DRAFT '+caseSql, [], function(tx, results) {
						console.log('成功从草稿箱表中删除');
						if (undefined != backFun) {
							backFun(results);
						}
					}, dbError);
				}, dbError);
			}
			
		}, dbError);
	},dbError)
}
