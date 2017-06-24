
/*!
 *	luoyd
 *  Date: 2016-01-13
 *  移动应用公有关注API
 */
(function($) {
	var _Focus = {
		CONSTANT:{//常量
		},
		config: {
		},
		backParam:{
			id:"",
			recordId: "",//对应业务模块的记录ID
			typeId: ""//模块类型标志，如日程：SCHEDULE、日志：LOG
		},
		doFocus:function(params,fun){//关注
		    var dataTmp = {};
			dataTmp.recordId = params.recordId;
			dataTmp.typeId = params.typeId
			plus.nativeUI.showWaiting();
			_App.ajax({
				type : "GET",
				url : basePath+'OcrmFocusAction!saveData.json',
				cache: false, 
				data:dataTmp,
				dataType: "json", 
				success : function(response){
					
					plus.nativeUI.closeWaiting();
					mui.toast("关注成功！");
		
					var count = response.json.data;
					if(undefined != count && null != count && "null" != count  && undefined != fun){
		                _Focus.backParam.recordId = dataTmp.recordId;
						_Focus.backParam.typeId = dataTmp.typeId;
						_Focus.backParam.count = count;
						fun(_Focus.backParam);
					}
				},
				error:function(){
					plus.nativeUI.closeWaiting();
					mui.alert('关注失败！');
				}
			});	
		},
		cancleFocus:function(params,fun){//取消关注
			var dataTmp = {};
			dataTmp.recordId = params.recordId;
			dataTmp.typeId = params.typeId
			plus.nativeUI.showWaiting();
			_App.ajax({
				type : "GET",
				url : basePath+'OcrmFocusAction!cancleFocus.json',
				cache: false, 
				data:dataTmp,
				dataType: "json", 
				success : function(response){
					
					plus.nativeUI.closeWaiting();
					mui.toast("取消关注！");
		
					var count = response.json.data;
					if(undefined != count && null != count && "null" != count && undefined != fun){
						_Focus.backParam.recordId = dataTmp.recordId;
						_Focus.backParam.typeId = dataTmp.typeId;
						_Focus.backParam.count = count;
						fun(_Focus.backParam);
					}
				},
				error:function(){
					plus.nativeUI.closeWaiting();
					mui.alert('取消关注失败！');
				}
			});	
		}
	};
	_App.focus = _Focus;
	console.log('_Focus init finished!');
}(mui))