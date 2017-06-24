/*!
 *	changzh
 *  Date: 2015-12-09
 *  网络状态组件
 */

(function($) {
	/**
	 * 取得网络信息方法
	 * 使用方式如：
	 * var isConnection = _App.netWork.isConnection();
	 */
	var _NetWork = {
		connectionType : function() {
			var type = {};
			type[plus.networkinfo.CONNECTION_UNKNOW] = "Unknown connection"; 
			type[plus.networkinfo.CONNECTION_NONE] = "None connection"; 
			type[plus.networkinfo.CONNECTION_ETHERNET] = "Ethernet connection"; 
			type[plus.networkinfo.CONNECTION_WIFI] = "WiFi connection"; 
			type[plus.networkinfo.CONNECTION_CELL2G] = "Cellular 2G connection"; 
			type[plus.networkinfo.CONNECTION_CELL3G] = "Cellular 3G connection"; 
			return type;
		},
		connectionTypeCN : function() {
			var type = {};
			type[plus.networkinfo.CONNECTION_UNKNOW] = "网络连接状态未知"; 
			type[plus.networkinfo.CONNECTION_NONE] = "未连接网络"; 
			type[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络"; 
			type[plus.networkinfo.CONNECTION_WIFI] = "无线WIFI网络"; 
			type[plus.networkinfo.CONNECTION_CELL2G] = "蜂窝移动2G网络"; 
			type[plus.networkinfo.CONNECTION_CELL3G] = "蜂窝移动3G网络"; 
			return type;
		},
		//网络是否连接
	 	isConnection : function() {
	 		var isConnection = plus.networkinfo.getCurrentType();
	 		if(isConnection == 0 || isConnection == 1) {
	 			return false;
	 		} else {
		 		return true;
	 		}
	 	},
	 	/*
	 	 * 取得当前网络状态
	 	 * flag: 是否返回中文状态
	 	 */
	 	getConnectionType : function(CN) {
	 		var that = this;
	 		if(CN == true) {
	 			var type = that.connectionTypeCN();
	 			return type[plus.networkinfo.getCurrentType()];
	 		} else {
	 			var type = that.connectionType();
	 			return type[plus.networkinfo.getCurrentType()];
	 		}
	 	}
		
	};
	/**
	 *  网络状态句柄
	 */
	_App.netWork = _NetWork;
	
	console.log('_NetWork init finished!');
}(mui))




