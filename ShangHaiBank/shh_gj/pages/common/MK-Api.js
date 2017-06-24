/*!
 *	changzh
 *  Date: 2015-07-06
 *  移动应用api
 */
(function($) {
	
	/**
	 * 分页工厂类
	 * 		使用方式：
	 * 		1、初始化 var myPage = _App.scrollerFactory(config);
	 */ 	2、查询方法 myPage.query(url);
	var _App.scrollerFactory = false;
	
	/**
	 * 应用工具类
	 *
	 * 使用方式：
	 *  页面跳转
	 *	_App.util.goPage(url);
	 */
	var _App.util = false;
	
	/**
	 * 应用ajax
	 *
	 * 使用方式：
	 *	_App.ajax({
     *		type : "GET",
     *		url :  url,
	 *		cache : false, 
	 *		async : false,
	 *		dataType : 'application/json',
	 *		success : function(response){
	 *			//TODO successhandler
	 *		},
	 *		error: function(XMLHttpRequest, textStatus, errorThrown){
	 *			//TODO successhandler
	 *		}
	 *	});
	 */
	var _App.ajax = false;
	
	
	
}(mui))

