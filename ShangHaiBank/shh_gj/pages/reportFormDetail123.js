//var totalHeight = document.body.scrollHeight;
//			var  scrollHeight= totalHeight - 263 - 44;
//			var scroll = document.getElementById("sh-reScroll");
//			scroll.style.height = scrollHeight + "px";
//			mui('.mui-scroll-wrapper').scroll();

			/**
			 * 选择时间
			 * @param {Object} $
			 */
			(function($) {
				$.init();
				//				var result = $('#result')[0];
				var btns = $('#showDate');
				btns.each(function(i, btn) {
					btn.addEventListener('tap', function() {
						var optionsJson = this.getAttribute('data-options') || '{}';
						var options = JSON.parse(optionsJson);
						var id = this.getAttribute('id');
						/*
						 * 首次显示时实例化组件
						 * 示例为了简洁，将 options 放在了按钮的 dom 上
						 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
						 */
						var picker = new $.DtPicker(options);
						picker.show(function(rs) {
							/*
							 * rs.value 拼合后的 value
							 * rs.text 拼合后的 text
							 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
							 * rs.m 月，用法同年
							 * rs.d 日，用法同年
							 * rs.h 时，用法同年
							 * rs.i 分（minutes 的第二个字母），用法同年
							 */
							//							result.innerText = '选择结果: ' + rs.text;
							/* 
							 * 返回 false 可以阻止选择框的关闭
							 * return false;
							 */
							/*
							 * 释放组件资源，释放后将将不能再操作组件
							 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
							 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
							 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
							 */
							picker.dispose();
						});
					}, false);
				});
			})(mui);

			/*
			 * 选择币种
			 */
			(function($, doc) {
				$.init();
				$.ready(function() {
					//普通示例
					var userPicker = new $.PopPicker();
					userPicker.setData([{
						//						value: 'bwhy',
						text: '本外合一'
					}, {
						//						value: 'bb',
						text: '本币'
					}, {
						//						value: 'wb',
						text: '外币'
					}]);
					var showUserPickerButton = doc.getElementById('showUserPicker');
					var userResult = doc.getElementById('userResult');
					showUserPickerButton.addEventListener('tap', function(event) {
						userPicker.show(function(items) {
							userResult.innerText = JSON.stringify(items[0]);
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);
					//-----------------------------------------
					//级联示例
					var instructionPicker = new $.PopPicker({
						layer: 2
					});
					instructionPicker.setData(instructionData);
					var showInstructionPickerButton = doc.getElementById('showInstructionPicker');
					var instructionResult = doc.getElementById('cityResult');
					showInstructionPickerButton.addEventListener('tap', function(event) {
						instructionPicker.show(function(items) {
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					}, false);
				});
			})(mui, document);
			
			/*
			 *初始化显示的图形 
			 */
			function chart1(){
				var myChart1 = echarts.init(document.getElementById('mychartForm'));
				var option1 = {
					title: {
						show: false
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						right: '20%',
						padding: [10, 0, 0, 10],
						textStyle: {
							color: '#2D87EA'
						}
					},
					grid: {
						left: '10',
						right: '10',
						bottom: '25',
						top: '20',
						containLabel: true
					},
					textStyle: {
						color: '#e4e3e2'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ["一月", "二月", "三月", "四月", "五月", "六月"],
						axisLine: {
							lineStyle: {
								color: '#818284'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#818284'
							}
						},
					},
					yAxis: {
						show: true,
						type: 'value',
						axisLabel: {
							formatter: '{value}%',
							textStyle: {
								color: '#818284'
							}
						},
	
					},
					series: [{
							type: 'line',
							data: [10, 20, 40, 50, 60, 70],
							itemStyle: {
								normal: {
									color: '#007AFF'
								}
							}
						},
						{
							type: 'line',
							data: [20, 30, 50, 60, 70, 80],
							itemStyle: {
								normal: {
									color: '#007AFF'
								}
							}
						}
					]
				};
			// 使用刚指定的配置项和数据显示图表。
				myChart1.setOption(option1);
			}
			/**
			 * 点击显示的图形
			 */
			function chart2(){
				var myChart2 = echarts.init(document.getElementById('myReportChart1'));
				var option2 = {
					title: {
						show: false
					},
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						right: '20%',
						padding: [10, 0, 0, 10],
						textStyle: {
							color: '#2D87EA'
						}
					},
					grid: {
						left: '10',
						right: '20',
						bottom: '25',
						top: '20',
						containLabel: true
					},
					textStyle: {
						color: '#e4e3e2'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: ["一月", "二月", "三月", "四月", "五月", "六月"],
						axisLine: {
							lineStyle: {
								color: '#818284'
							}
						},
						axisLabel: {
							textStyle: {
								color: '#818284'
							}
						},
					},
					yAxis: {
						show: true,
						type: 'value',
						axisLabel: {
							formatter: '{value}%',
							textStyle: {
								color: '#818284'
							}
						},
	
					},
					series: [{
							type: 'line',
							data: [10, 20, 40, 50, 60, 70],
							itemStyle: {
								normal: {
									color: '#007AFF'
								}
							}
						},
						{
							type: 'line',
							data: [20, 30, 50, 60, 70, 80],
							itemStyle: {
								normal: {
									color: '#007AFF'
								}
							}
						}
					]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart2.setOption(option2);
			}
			chart1();
			chart2();
			
			
			
			var appConfig={
				uiReady:function(){
					
				},
				deviceReady:function(){
					 plus.screen.unlockOrientation();	
				}
			}
			_App.init(appConfig);
			window.addEventListener('resize',function(){
				var _width=document.body.scrollWidth;
				var x = document.getElementById('mychartForm').style.width=_width+"px";
				chart1();
			
		});
		var _width=document.body.scrollWidth;
		var y = document.getElementById('myReportChart1').style.width=_width+"px";
			chart2();
		//恢复默认
		var old_back = mui.back;
		mui.back=function(){
			plus.screen.lockOrientation("portrait-primary");
			old_back();
		};
		
		