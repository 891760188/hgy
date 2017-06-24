
/*!
 *	luoyd
 *  Date: 2016-01-13
 *  移动应用公有点赞API
 */
(function($) {
	var _Support = {
		CONSTANT:{//常量
		},
		config: {
		},
		backParam:{
			id:"",
			recordId: "",//对应业务模块的记录ID
			typeId: ""//模块类型标志，如日程：SCHEDULE、日志：LOG
		},
		doSupport:function(params,fun){//点赞
		    var dataTmp = {};
			dataTmp.recordId = params.recordId;
			dataTmp.typeId = params.typeId
			plus.nativeUI.showWaiting();
			_App.ajax({
				type : "GET",
				url : basePath+'OcrmSupportAction!saveData.json',
				cache: false, 
				data:dataTmp,
				dataType: "json", 
				success : function(response){
					
					plus.nativeUI.closeWaiting();
					mui.toast("点赞成功！");
		
					var count = response.json.data;
					if(undefined != count && null != count && "null" != count  && undefined != fun){
		                _Support.backParam.recordId = dataTmp.recordId;
						_Support.backParam.typeId = dataTmp.typeId;
						_Support.backParam.count = count;
						
						fun(_Support.backParam);
					}
				},
				error:function(){
					plus.nativeUI.closeWaiting();
					mui.alert('点赞失败！');
				}
			});	
		},
		cancleSupport:function(params,fun){//取消点赞
			var dataTmp = {};
			dataTmp.recordId = params.recordId;
			dataTmp.typeId = params.typeId
			plus.nativeUI.showWaiting();
			_App.ajax({
				type : "GET",
				url : basePath+'OcrmSupportAction!cancleSupport.json',
				cache: false, 
				data:dataTmp,
				dataType: "json", 
				success : function(response){
					
					plus.nativeUI.closeWaiting();
					mui.toast("取消点赞！");
		
					var count = response.json.data;
					if(undefined != count && null != count && "null" != count  && undefined != fun){
						_Support.backParam.recordId = dataTmp.recordId;
						_Support.backParam.typeId = dataTmp.typeId;
						_Support.backParam.count = count;
						fun(_Support.backParam);
					}
				},
				error:function(){
					plus.nativeUI.closeWaiting();
					mui.alert('取消点赞失败！');
				}
			});	
		}
	};
	_App.support = _Support;
	console.log('_Support init finished!');
}(mui))