/*!
 *	wuxl
 *  Date: 2016-01-06
 *  Sqlite操作
 */

(function($) {
	var _sqlite = {
	 	opendb : function(dbName){
	 		var xhr = new XMLHttpRequest();
			xhr.open('GET', _filePath+"db/"+dbName, true);
			xhr.responseType = 'arraybuffer';
			
			xhr.onload = function(e) {
			  var uInt8Array = new Uint8Array(this.response);
			  sqlitedb = new SQL.Database(uInt8Array);
			};
			xhr.send();
	 	},
	 	query : function(sql){
	 		var data = [];
	 		var stmt = sqlitedb.prepare(sql);
	 		while(stmt.step()) {
		    	var row = stmt.getAsObject();
		    	data.push(row);
		    }
	 		return data;
	 	},
	 	exec : function(sql){
	 		sqlitedb.run(sql);
	 	}
	};
	_App.sqlite = _sqlite;
	console.log('sqlite init finished!');
}(mui))