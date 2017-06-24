/*!
 *	changzh
 *  Date: 2016-03-15
 *  文件操作组件
 */
(function($) {
	var _File = {
		/*
		 * 取得文件text
		 * entry:文件对象
		 * fn: 回调方法
		 */
		getFileText: function(entry, fn) {
			//plus.io.resolveLocalFileSystemURL(url, function( entry ) {
					// 可通过entry对象操作文件 
					entry.file( function(file){
						var fileReader = new plus.io.FileReader();
						fileReader.readAsText(file, 'utf-8');
						fileReader.onloadend = function(evt) {
							if(mui.isFunction(fn)) {
								fn(evt.target.result);
							} else {
								mui.alert( evt.target.result );
							}
							//plus.runtime.openFile( url )
						}
					} );
//				}, function ( e ) {
//					console.log( "getFileText URL failed: " + e.message );
//					return null;
//				} );
		},
		/*
		 * 创建文件
		 * name:文件名
		 * str:domstring
		 * 文件创建到'_doc/'目录下
		 */
		create: function(name, str, callback) {
			plus.io.requestFileSystem( plus.io.PRIVATE_DOC, function(fs){
				fs.root.getFile(name,{create:true}, function(fileEntry){
					fileEntry.file( function(file){
						//console.log("File Size:"+file.size);
						var fileWrite = new plus.io.FileWriter;
						fileEntry.createWriter(function(fileWrite){
							fileWrite.write(str);
							fileWrite.onwrite = function(e){
								if(mui.isFunction(callback)) {
									callback();
								}
							}
						})
					});
				});
			} );
		},
		/*
		 * 创建共享文件
		 * name:文件名
		 * str:domstring
		 * 文件创建到'_doc/'目录下
		 */
		createPublicFile: function(name, str, callback) {
			plus.io.requestFileSystem( plus.io.PUBLIC_DOCUMENTS, function(fs){
				fs.root.getFile(name,{create:true}, function(fileEntry){
					fileEntry.file( function(file){
						//console.log("File Size:"+file.size);
						var fileWrite = new plus.io.FileWriter;
						fileEntry.createWriter(function(fileWrite){
							fileWrite.write(str);
							fileWrite.onwrite = function(e){
								if(mui.isFunction(callback)) {
									callback();
								}
							}
						})
					});
				});
			} );
		},
		/*
		 * 创建文件
		 * entry: 源文件
		 */
		copy: function(entry, filename, callback) {
			var name = entry.name;
			if(filename !== null) {
				name = filename;
			}
			plus.io.resolveLocalFileSystemURL('_doc/', function( destEntry ) {
				console.log('copy start...');
				entry.copyTo(destEntry, name, function(){
					if(mui.isFunction(callback)) {
						callback();
					}
					console.log('复制成功')
				}, function(e){
					console.log('复制文件异常：'+e.message)
				} );
				
			}, function ( e ) {
				console.log( "copy failed: " + e.message );
			} );
		},
		/*
		 * 删除文件
		 * url: '_doc/crm.db'
		 */
		delete: function(url, successCb, errorCB) {
			plus.io.resolveLocalFileSystemURL(url, function( entry ) {
				// 可通过entry对象操作文件 
				console.log( url+"文件是否存在：" +entry.isFile);
				if(entry.isFile) {
					entry.remove( function () {
						console.log( "删除["+url+"] succeeded" );
						//console.log( "文件是否存在：" +entry.isFile);
						if(mui.isFunction(successCb)) {
							successCb();
						}
					}, function ( e ) {
						console.log( e.message );
					} );
				} 
			}, function ( e ) {
				console.log( url+' 不存在.' );
				if(mui.isFunction(errorCB)) {
					errorCB();
				}
			} );
		}
	};
	
	_App.file = _File;
	//console.log('file init finished!');
}(mui))