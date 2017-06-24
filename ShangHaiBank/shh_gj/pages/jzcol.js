$(document).ready(function () {
	/**
			 * 点击显示的图形
			 */
	function chart2(){
		mui('#popover').popover('show');
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
			barWidth:20,
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
					type: 'bar',
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
	};
	var _width=document.body.scrollWidth;
	var _height=document.body.scrollHeight - 263 - 40;
	$("#jqGrid").html("");
    $("#jqGrid").jqGrid({
        url: 'data.json',
        datatype: "json",
        colNames: ['指标', '余额', '较上日', '较上月'],
        colModel: [
//			{ label: 'Category Name', name: 'CategoryName', width: 100, frozen: true },
			{ label: '指标', name: 'ProductName', width: 150, frozen: true },
			{ label: '余额', name: 'Country', width: 250 },
			{ label: '较上日', name: 'Price', width: 250, sorttype: 'number' },
			{ label: '较上月', name: 'Quantity', width: 250, sorttype: 'integer' }   
//			{ label: '较上年', name: 'Quantity', width: 250, sorttype: 'integer' },
        ],
        onSelectRow:function(){
        	chart2();	
        },
		loadonce: true,
        shrinkToFit: false, // must be set with frozen columns, otherwise columns will be shrank to fit the grid width
        width: _width,
        height: _height,
        rowNum: 15
    });

    $("#jqGrid").jqGrid("setFrozenColumns");
    
});