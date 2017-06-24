/*!
 *	changzh
 *  Date: 2015-07-06
 *  滑动分页工厂
 */

(function($) {
	
	var scrollerFactory = {
		/**
		 * 分页默认配置
		 */
		defaults: {
			loadFlag : true,		//是否默认加载数据
			relayTime : 1000,		//延时时间：单位毫秒
			flag  : true, 			//查询是否清空历史
			start : 0,				//开始记录行数
			limit : 5,				//分页大小
			totleCount : -1,		//记录总数
			totlePageCount : -1, 	//总页数
			currentPage : 1, 		//当前页数
			url : false,       //查询URL
			scrollerId : false,     //列表ID
			ulId : false,     //列表ID
			success : false,		//成功回调方法
			error : false,
		},
		init: function(options) {
			//var that = this;
			//alert('scrollerConfig:'+JSON.stringify(options));
			var scroller = {};
			scroller.config = options;
			scroller.loadData = function(flag) {
				//alert('load data='+flag)
				var that = scroller.config;
				var noData = false;
				var url = that.url;
				if(mui.isObject(url)) {
					//console.log("demo data------------------");
					setTimeout(function() {
						if(that.success) {
							document.getElementById(that.ulId).innerHTML = "";
							mui('#'+scroller.config.scrollerId).pullRefresh().endPullupToRefresh(true);
							that.success(url.demoData);
						} else {
							alert('demoData配置错误!');
						}
					}, 500);
					return;
				}
				if(flag) {
					that.start = 0;
					that.currentPage = 1;
				} else {
					that.start = that.start + that.pageSize;
					that.currentPage ++;
					if (that.currentPage > that.totlePageCount && that.totlePageCount > -1) {
						noData = true;
					}
					//alert('that'+JSON.stringify(that));
					//alert('load data noData:'+noData)
					mui('#'+scroller.config.scrollerId).pullRefresh().endPullupToRefresh(noData);
				}
				
				
				var condition = '';
				var pageInfo  = "start="+that.start+"&limit="+that.pageSize;
				if(that.getCondition) {
					condition = that.getCondition();
				}
				if (condition != null && condition != 'undefined' && condition != '') {
					condition += "&"+pageInfo;
				} else {
					condition = pageInfo;
				}
				url = url.indexOf('?')>0 ? url + '&' + condition: url + '?' + condition;
				//alert('url:'+ url)
				
				if(!noData) {
					_App.ajax({
						type : "GET",
						url :  url,
						cache : false, 
						async : false,
						dataType : 'application/json',
						success : function(response){
							response = JSON.parse(response);
							//alert('response'+JSON.stringify(response));
							that.totleCount = response.json.count;
							that.totlePageCount = Math.ceil(that.totleCount / that.pageSize); 
							//var el = document.getElementById(that.ulId).className;//.innerHTML;
							//alert('response.json.data.length='+ response.json.data.length);
							if (flag) {
								//var table = document.body.querySelector('.mui-table-view');
								//mui.alert(document.getElementById(that.ulId).innerHTML);
								//table.innerHTML ="";
								document.getElementById(that.ulId).innerHTML = "";
							}
							if(that.success) {
								that.success(response);
							} else {
								alert('查询配置错误!');
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown){
							//alert('error');
							//alert('XMLHttpRequest:'+JSON.stringify(XMLHttpRequest)
							//+'textStatus='+JSON.stringify(textStatus)+';errorThrown'+JSON.stringify(errorThrown));
							if(that.error) {
								that.error(XMLHttpRequest, textStatus, errorThrown);
							}
						}
					});
				} 
			};
			/**
			 * 下拉刷新
			 */
			scroller.pulldownRefresh = function() {
				setTimeout(function () {
					scroller.loadData(true);
					mui('#'+options.scrollerId).pullRefresh().endPulldownToRefresh();
					mui('#'+options.scrollerId).pullRefresh().refresh(true);
				}, scroller.config.relayTime);
			};
			/**
			 * 上拉加载更多
			 */
			scroller.pullupRefresh =  function () {
				setTimeout(function () {
					scroller.loadData(false);
				}, scroller.config.relayTime);	
			};
			return scroller;
		}
		
	};
	_App.scrollerFactory = scrollerFactory;
	//alert('scrollerFactory finished!');
	console.log('scrollerFactory finished!');
}(mui))