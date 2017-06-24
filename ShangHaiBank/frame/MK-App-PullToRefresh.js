/*!
 *	changzh
 *  Date: 2015-07-06
 *  滑动刷新组件
 *  页面内可以实现多个面签分页
 */

(function($) {
	
	var PullToRefreshFactory = {
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
		/**
		 * 页面内分页组件数组
		 */
		scrollers: [],
		/**
		 * 滑动刷新工厂初始化方法
		 * @param {Object} options
		 */
		init: function(options) {
			//alert('PullToRefreshFactory.init');
			console.log('PullToRefreshFactory.init');
			var that = this;
			for(var i = 0; i < options.length; i++) {
				var  scroller = that.initialize(options[i]);
				that.scrollers.push(scroller);
			}
		},
		/**
		 * 初始化分页组件
		 * @param {Object} scrollConfig
		 */
		initialize: function(scrollConfig) {
			//var that = this;
			//alert('scrollerConfig:'+JSON.stringify(options));
			var scroller = {};
			scroller.config = scrollConfig;
			var pullRefreshEl = document.getElementById(scrollConfig.scrollerId).children[0].children[0];
			scroller.loadData = function(flag) {
				//alert('load data='+flag)
				var that = scroller.config;
				var noData = false;
				var url = that.url;
				//alert('scrollerConfig:'+JSON.stringify(scroller.config));
				//alert('url:'+mui.isObject(url));
				if(mui.isObject(url)) {
					if(that.success) {
						var table = pullRefreshEl.children[0];
						table.innerHTML ="";
						that.success(url.demoData);
						scroller.PullToRefresh.endPullUpToRefresh(true);
					} else {
						alert('demoData配置错误!');
					}
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
					scroller.PullToRefresh.endPullUpToRefresh(noData);
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
								var table = pullRefreshEl.children[0];
								table.innerHTML ="";
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
			//console.log(JSON.stringify(scrollConfig));
			
			//console.log('pullRefreshEl.className='+pullRefreshEl.className);
			scroller.PullToRefresh = $(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							//var ul = self.element.querySelector('.mui-table-view');
							scroller.loadData(true);
							//ul.insertBefore(createFragment(ul, index, 10, true), ul.firstChild);
							self.refresh(true);
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					contentdown: '',
					callback: function() {
						var self = this;
						setTimeout(function() {
							var ul = self.element.querySelector('.mui-table-view');
							scroller.loadData(false);
							//ul.appendChild(createFragment(ul, index, 5));
							//self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
			
			return scroller;
		}
		
	};
	_App.pullToRefreshFactory = PullToRefreshFactory;
	//alert('scrollerFactory finished!');
	console.log('scrollerFactory finished!');
}(mui))