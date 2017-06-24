/*!
 *	changzh
 *  Date: 2015-11-03
 *  用户信息
 */

(function($) {
	/**
	 * 取得session 值方法
	 * 使用方式如：
	 * var userName = _App.sessionUser.userId();
	 */
	var _SessionUser = {
		//用户Id
	 	userId : function() {
	 		return plus.storage.getItem('_userId');
	 	},
	 	//机构Id
	 	unitId : function() {
	 		
	 		return plus.storage.getItem('_unitId');
	 	},
	 	//用户名称
	 	userName : function() {
	 		
	 		return plus.storage.getItem('_userName');
	 	},
	 	//手机系统
	 	system : function() {
	 		
	 		return plus.storage.getItem('_system');
	 	},
	 	//个人头像
	 	userPic : function() {
	 		
	 		return plus.storage.getItem('_userPic');
	 	},
	 	//设备标识
	 	deviceId : function() {
	 		
	 		return plus.storage.getItem('_deviceId');
	 	},
	 	//控制菜单和功能点
	 	controls: function() {
	 		return plus.storage.getItem('_controls');
	 	}
	};
	/**
	 * 初始化session方法
	 */
	var _SessionInit = function (userInfo) {
		try{
			plus.storage.setItem('_userId', userInfo.userId);
			plus.storage.setItem('_unitId', userInfo.unitId);
			plus.storage.setItem('_userName', userInfo.userName);
			plus.storage.setItem('_system', userInfo.system);
			plus.storage.setItem('_userPic', userInfo.userPic);
			plus.storage.setItem('_deviceId', userInfo.deviceId);
			plus.storage.setItem('_controls', userInfo.controls);
		} catch(e) {
			console.log('sessionUser初始化失败。');
		}
		
	};
	/**
	 * 清除session方法
	 */
	var _RemoveSession = function () {
		try{
			plus.storage.removeItem('_userId');
			plus.storage.removeItem('_unitId');
			plus.storage.removeItem('_userName');
			plus.storage.removeItem('_system');
			plus.storage.removeItem('_userPic');
			plus.storage.removeItem('_deviceId');
			plus.storage.removeItem('_controls');
		} catch(e) {
			console.log('removeSessionUser失败。');
		}
		
	};
	/**
	 * 取session 值方法
	 */
	_App.sessionUser = _SessionUser;
	/**
	 * 初始化session方法
	 */
	_App.sessionInit = _SessionInit;
	/**
	 * 初始化session方法
	 */
	_App.removeSession = _RemoveSession;
	
	console.log('sessionUser init finished!');
}(mui))




