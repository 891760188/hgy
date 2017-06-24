/*!
 *	jiangny
 *  Date: 2016-11-29
 *  菜单控制点
 */
(function($) {
	var grantControls = "";
	var _Grant = {
		init: function() {
			var grantUrl = (document.URL.split('/www'))[1];
			//先得到该页面保存的所有控制点
			var allGrants = _App.sessionUser.controls();
			if(allGrants.indexOf(grantUrl) != -1) {
				grantControls = (allGrants.split(grantUrl))[1].split("childrens")[0];
			}
			return grantControls;
		},
		edit: function(el) {
			var grantUnit = el.getAttribute("data-grant");
			if(grantUnit && grantControls.indexOf(grantUnit) != -1) {
				return true;
			}
			return false;
		}
	};
	_App.grant = _Grant;
	//alert('util init finished!');
	console.log('grant init finished!');
}(mui))