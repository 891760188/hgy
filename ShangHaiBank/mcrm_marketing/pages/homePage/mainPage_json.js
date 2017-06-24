function randomData() {
    return Math.round(Math.random()*1000);
}
var demoData = {
	"json": {
		"data": [
//		{
//			id: 'id1',
//			indexId: '1',
//			option: {
//			    title : {
//			        text: '全行不良贷款分布',
//			        x:'center',				        
//			            padding:[10,0,0,0],
//				        textStyle:{
//				        	color:'#666',
//				        	fontWeight:'normal',
//				        	fontSize:14
//				        }
//			    },
//			    tooltip : {
//			        trigger: 'item'
//			    },
//			   
//			    dataRange: {
//			        x: 'left',
//			        y: 'bottom',
//			        padding:[5,5,30,5],
//			        splitList: [
//			            //
//			           {start: 0, end: 1,label:'低',color:'#78bc27'},
//			            {start: 1, end: 2, label: '中',color:'#4896cd'},
//			            {start: 2, end:3,label: '高', color: '#ff713c'}
//			         
//			        ],
////			        color: ['#93C6B0', '#6385A0', '#C33531']
//			        //4896cd  ff713c  78bc27
//			    },
//			   
//			    series : [
//			        {
//			            name: '不良贷款',
//			            type: 'map',
//			            mapType: 'china',
//			            roam: false,
//			            itemStyle:{
//			                normal:{
//			                    label:{
//			                        show:false,
//			                        textStyle: {
//			                           color: "rgb(249, 249, 249)"
//			                        }
//			                    }
//			                },
//			                emphasis:{label:{show:true}}
//			            },
//			            data:[
//			                {name: '北京',value: 0.73},
//			                {name: '天津',value: 0.82},
//			                {name: '上海',value: 0.98},
//			                {name: '重庆',value: 1.12},
//			                {name: '河北',value: 1.43},
//			                {name: '河南',value: 1.25},
//			                {name: '云南',value: 1.54},
//			                {name: '辽宁',value: 1.73},
//			                {name: '黑龙江',value: 1.83},
//			                {name: '湖南',value: 1.92},
//			                {name: '安徽',value: 1.99},
//			                {name: '山东',value: 2.11},
//			                {name: '新疆',value: 2.03},
//			                {name: '江苏',value: 1.92},
//			                {name: '浙江',value: 2.29},
//			                {name: '江西',value: 1.09},
//			                {name: '湖北',value: 1.92},
//			                {name: '广西',value: 1.72},
//			                {name: '甘肃',value: 1.23},
//			                {name: '山西',value: 1.02},
//			                {name: '内蒙古',value: 1.56},
//			                {name: '陕西',value: 2.36},
//			                {name: '吉林',value: 2.32},
//			                {name: '福建',value: 1.28},
//			                {name: '贵州',value: 2.09},
//			                {name: '广东',value: 2.23},
//			                {name: '青海',value: 2.16},
//			                {name: '西藏',value: 1.08},
//			                {name: '四川',value: 0.02},
//			                {name: '宁夏',value: 0.29},
//			                {name: '海南',value: 1.59},
//			                {name: '台湾',value: 1.28},
//			                {name: '香港',value: 1.29},
//			                {name: '澳门',value: 1.24},
//			                {name: '南海诸岛',value: 1.8}
//			            ]
//			        }
//			    ]
//}
//		}, {
//			id: 'id2',
//			indexId: '2',
//			option: {
//				title : {
//			        text: '个人存款',
//			        x: 'center',
//			        align: 'right',
//		            padding:[10,0,0,0],
//			        textStyle:{
//			        	color:'#666',
//			        	fontWeight:'normal',
//			        	fontSize:14
//			        }
//			    },
//				series: [{
//			            name: '2016年9月',
//			            type: 'gauge',
//			            radius:'75%',
//			            detail: {
//			            	formatter:'{value}%',
//			            	offsetCenter: [0, '55%'],
//							textStyle:{
//								fontSize: 22
//							}
//			            },
//			            data: [{value: 60}],
//			            axisLine:{
//			            	lineStyle:{
//			            		width:18,
//			            		color:[[0.2, '#17d5af'], [0.8, '#2293de'], [1, '#ff713c']]
//			            	}
//			            },
//			            pointer: {
//							length: '80%',
//							width: 6
//						}
//			        }],
//				animation: false
//				}
//				},
				
				{
					id: 'id3',
					indexId: '3',
					option : {
					    title : {
							text: '商机漏斗',
							x:'center',
							padding:[10,0,0,0],
							textStyle:{
								color:'#666',
								fontWeight:'normal',
								fontSize:14
							}
						},
					    tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c}%"
					    },
//					    legend: {
//							left: "left", 
//							bottom:"30",
//							data: ["得到项目信息", "有选型的意向", "客户同意选型","已确定来开标","已中标"]
//						},
					    calculable: true,
					    color: _chartsColors,//["#4896cd", "#ff713c", "#78bc27", "#f99900", "#36cbde","#608cf4","#f2eb32","#dc97ff","#ff8c8f","#47f7a4","#f9b966"],
					    series: [
					        {
					           name: '商机斗图',
								type: 'funnel',
								left: '10%',
								bottom:40,
								top:50,
								width: '80%',
								// height: {totalHeight} - y - y2,
								min: 0,
								max: 10,
								minSize: '0%',
								maxSize: '100%',
								funnelAlign: 'center',
								sort: 'descending', // 'ascending', 'descending'
								gap: 4,
					            label: {
					                normal: {
					                    show: true,
					                    position: 'right'
					                },
					                emphasis: {
					                    textStyle: {
					                        fontSize: 20
					                    }
					                }
					            },
					            labelLine: {
					                normal: {
					                    length: 10,
					                    lineStyle: {
					                        width: 1,
					                        type: 'solid'
					                    }
					                }
					            },
					            itemStyle: {
					                normal: {
					                    borderColor: '#fff',
					                    borderWidth: 1
					                }
					            },
					            data: [
					                {value: 1, name: '商机成交'},
					                {value: 1, name: '商务谈判'},
					                {value: 2, name: '方案论证'},
					                {value: 4, name: '确认商机'},
					                {value: 6, name: '了解商机'}
					            ]
					        }
					    ]
				}
		},{
				id: 'id4',
				indexId: '4',
				option:{
					title : {
				        text: '业绩趋势',
				        x:'center',				        
			            padding:[10,0,0,0],
				        textStyle:{
				        	color:'#666',
				        	fontWeight:'normal',
				        	fontSize:14
				        }
			    	},
			    	tooltip: {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c}"
					    },
			    	legend: {
			    		data: ["个人业务","对公业务","存款趋势","贷款趋势"],
			    		padding:[45,0,20,0],
				        textStyle:{
				        	color:'#666'
				        }
			    	},
			    grid: {
			    	top:'90',
			        left: '20',
			        right: '-50',
			        bottom: '10',
			        containLabel: true
			    },
			    	xAxis:[{
			    		type: "category", 
			    		data: ["1月", "2月", "3月", "4月", "5月", "6月"],
				        axisLine:{
				            lineStyle:{
				                color:'#aaa',
				                width:0
				            }
				        },
				        axisLabel: {
				        	textStyle: {
								color:'#888'
							}
		        		}
			    	}],
			    	color: _chartsColors,//["#4896cd", "#ff713c", "#78bc27", "#f99900", "#36cbde","#608cf4","#f2eb32","#dc97ff","#ff8c8f","#47f7a4","#f9b966"],
			    	barWidth:15,
			    	series: [{
			        		name: "个人业务",
			        		data: ["3.41", "7.22", "1.60", "3.91", "9.95", "8.45"],
			        		type: "bar",
			    			barWidth:12
		      			},{
			        		name: "对公业务",
			        		data: ["6.41", "10.22", "1.90", "5.91", "10.95", "8.95"],
			        		type: "bar",
			    			barWidth:12
		      			},{
			      			yAxisIndex: "1", 
			      			name: "存款趋势", 
			      			data: ["9.92", "2.25", "4.58", "5.03", "5.1", "9.58"],
			      			type: "line"
		      			},{
			      			yAxisIndex: "1", 
			      			name: "贷款趋势", 
			      			data: ["2.92", "4.25", "3.58", "6.03", "7.1", "5.58"],
			      			type: "line"
		      			}
		      		],
		      		yAxis: [{
		        		axisLabel: {
		        			formatter: "{value}万元",
				        	textStyle: {
								color:'#888'
							}
		        		},
		        		name: "个人业务",
		        		type: "value",
				        axisLine:{
				            lineStyle:{
				                color:'#aaa',
				                width:0
				            }
				        }
		      		},{
		        		axisLabel: {
		        			formatter: "{value}万元",
				        	textStyle: {
								color:'#888'
							}
		        		},
		        		show:false,
		        		name: "对公业务",
		        		type: "value",
				        axisLine:{
				            lineStyle:{
				                color:'#aaa',
				                width:0
				            }
				        }
		      		},{
		      			axisLabel: {
		      				formatter: "{value}%",
				        	textStyle: {
								color:'#888'
							}
		        		},
		      			name: "存款趋势", 
		      			type: "value",
				        axisLine:{
				            lineStyle:{
				                color:'#aaa',
				                width:0
				            }
				        }
		      		},{
		      			axisLabel: {
		      				formatter: "{value}%",
				        	textStyle: {
								color:'#888'
							}
		        		},
		        		show:false,
		      			name: "贷款趋势", 
		      			type: "value",
				        axisLine:{
				            lineStyle:{
				                color:'#aaa',
				                width:0
				            }
				        }
		      		}]
			}
		}
//		{
//			id: 'id5',
//			indexId: '5',
//			option: {
//			    title: {
//			        text: '风险控制',
//			         x:'center',
//			         padding:[10,0,0,0],
//				        textStyle:{
//				        	color:'#666',
//				        	fontWeight:'normal',
//				        	fontSize:14
//				        }
//			    },
//			    
//			    tooltip: {
//			        trigger: 'axis'
//			    },
//			     center: ['50%', '50%'],
//			    radar: 
//			        {
//			            indicator: [
//			                {text: '存款偏离度', axisLabel: {show: true, textStyle: {fontSize: 14, color: '#666'}},max: 100},
//			                {text: '流动行比例', max: 100},
//			                {text: '行业贷款集中度', max: 100},
//			                {text: '存款比', max: 100}
//			            ],
//			            radius: 65
//			        }
//			    ,
//			    series: 
//			        {
//			            type: 'radar',
//			            x:'center',
//			             tooltip: {
//			                trigger: 'item'
//			            },
//			            itemStyle: {normal: {color:'#32C7D6'}},
//			           
//			            data: [
//			                {
//			                    value: [60,73,85,70],
//			                    name: '风险控制'
//			                }
//			            ]
//			        }
//			    
//}
//			    
//		}
		]
	}
};