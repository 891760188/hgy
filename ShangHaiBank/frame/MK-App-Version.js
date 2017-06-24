/*!
 *	changzh
 *  Date: 2015-12-15
 *  版本管理组件
 */
(function($) {
	var _Version = {
		getVerison: function(f) {
			if(mui.isFunction(f)) {
				plus.runtime.getProperty(plus.runtime.appid,function(inf){
			   		f(inf.version);
				});
			}
		},
		/*
		 * 更新
		 */
		update: function (wgtUrl){
			var that  = this;
		    plus.nativeUI.showWaiting("下载更新文件...");
		    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
		        if ( status == 200 ) { 
		            console.log("下载更新成功：" + d.filename);
		            that.installWgt(d.filename); // 安装wgt包
		        } else {
		            console.log("下载更新文件失败！");
		            plus.nativeUI.alert("下载更新文件失败！");
		        }
		        //plus.nativeUI.closeWaiting();
		    }).start();
		},
		/*
		 * 安装更新文件
		 */
		installWgt: function (path){
		    plus.nativeUI.showWaiting("安装更新应用...");
		    //plus.runtime.install(path,{},function(){
		    plus.runtime.install( path, {force:true}, function(){
		        plus.nativeUI.closeWaiting();
		        console.log("更新成功！");
//		        plus.nativeUI.alert("应用资源更新完成！",function(){
//		        	console.log("plus.runtime.restart()！");
//		        });
		        plus.runtime.restart();
		    },function(e){
		        plus.nativeUI.closeWaiting();
		        console.log("安装更新失败["+e.code+"]："+e.message);
		        plus.nativeUI.alert("安装更新失败["+e.code+"]："+e.message);
		    });
		}
	};
	_App.version = _Version;
	//alert('version init finished!');
	console.log('version init finished!');
}(mui))