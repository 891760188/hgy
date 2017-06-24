/**
 * 关系图-force布局
 * 杨恒
 * 2017年3月1日11:28:28
 * yangheng2
 */
var demoData = new Array;

var nodes = {
	"id": 0,
	"name": "一级:1",
	"value": 1,
	"category": 0,
	"symbolSize": "45",
	'itemStyle': {
		'normal': {
			'color': '#ff713c'
		}
	}

};
demoData.push(nodes);
for(var i = 1; i < 5; i++) {
	var nodes = {
		"id": i,
		"name": "二级:" + i,
		"value": 10,
		"category": 1,
		"symbolSize": "30",
		'itemStyle': {
			'normal': {
				'color': '#78bc27'
			}
		}
	};
	demoData.push(nodes);

}
for(var i = 5; i < 10; i++) {
	var nodes = {
		"id": i,
		"name": "三级:" + i,
		"value": 100,
		"category": 2,
		"symbolSize": "20",
		'itemStyle': {
			'normal': {
				'color': '#36cbde'
			}
		}
	};
	demoData.push(nodes);
}
for(var i = 10; i < 50; i++) {
	var nodes = {
		"id": i,
		"name": "四级:" + i,
		"value": 1000,
		"category": 3,
		"symbolSize": "10",
		'itemStyle': {
			'normal': {
				'color': '#4896cd'
			}
		}
	};
	demoData.push(nodes);
}
/**
 *  link---------------------------------------------------------------------------------------------------
 */
var links = new Array;
for(var i = 1; i < 5; i++) {
	var link = {
		"source": 0, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	}
	links.push(link);

}

for(var i = 5; i < 10; i++) {
	var link = {
		"source": 1, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	}
	links.push(link);
}
for(var i = 10; i < 25; i++) {
	var link = {
		"source": 6, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	}
	links.push(link);
}
for(var i = 30; i < 50; i++) {
	var link = {
		"source": 7, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	}
	links.push(link);
}
for(var i = 25; i < 30; i++) {
	var link = {
		"source": 7, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	}
	links.push(link);
}
for(var i = 25; i < 30; i++) {
	var link = {
		"source": 8, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#4896cd"
			}
		}

	}
	links.push(link);
}
//----------------------------------------------------------------------------------------------------------------
/**
 * 关系图-circular布局
 * 杨恒
 * 2017年3月1日11:28:28
 * yangheng2
 */

/* centerCoordinate:中心坐标
 * radius:半径 
 * angle:夹角（相对于一象限的X轴）
 */
var getCoordinate = function(centerCoordinate, radius, angle) {
	var _x = 0,
		_y = 0;
	_x = centerCoordinate.x + radius * Math.cos(angle * Math.PI / 180);
	_y = centerCoordinate.y + radius * Math.sin(angle * Math.PI / 180);
	return({
		x: _x,
		y: _y
	});
};

var _x, _y; //中心点坐标
	var width = document.getElementById('main').offsetWidth;
	var height = document.getElementById('main').offsetHeight;
	_x = width / 2;
	_y = height / 2;
var cir_category = [{
	"name": "一级",
	"itemStyle": {
		"normal": {
			"color": "#ff713c"
		}
	}
}, {
	"name": "二级",
	"itemStyle": {
		"normal": {
			"color": "#78bc27"
		}
	}
}, {
	"name": "三级",
	"itemStyle": {
		"normal": {
			"color": "#36cbde"
		}
	}
}, {
	"name": "四级",
	"itemStyle": {
		"normal": {
			"color": "#4896cd"
		}
	}
}]
var cir_data = new Array;
for(var i = 0; i < 1; i++) {
	var spot = getCoordinate({
		x: _x,
		y: _y
	}, 3, 50);
	var cir_nodes = {
		"id": i,
		"name": "一级:" + i,
		"value": 10,
		"category": 0,
		"x": spot.x,
		"y": spot.y,
		"z": 0,
		"symbolSize": "10",
		'itemStyle': {
			'normal': {
				'color': '#ff713c'
			}
		}
	};
	cir_data.push(cir_nodes);
}
for(var i = 1; i < 11; i++) {
	var spot = getCoordinate({
		x: _x,
		y: _y
	}, 5, -24 + 12 * i);
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "四级:" + i,
		"value": 10,
		"category": 3,
		"x": spot.x,
		"y": spot.y,
		"z": 0,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#4896cd'
			}
		}
	};
	cir_data.push(cir_nodes);
}
for(var i = 11; i < 15; i++) {
	var spot = getCoordinate({
		x: _x,
		y: _y
	}, 5, -12 + 12 * i);
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "三级:" + i,
		"value": 10,
		"category": 2,
		"x": spot.x,
		"y": spot.y,
		"z": 0,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#36cbde'
			}
		}
	};
	cir_data.push(cir_nodes);
}

for(var i = 15; i < 24; i++) {
	var spot = getCoordinate({
		x: _x,
		y: _y
	}, 3, 135 + 25 * (i - 14));
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "二级:" + i,
		"value": 10,
		"category": 1,
		"x": spot.x,
		"y": spot.y,
		"z": 0,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#78bc27'
			}
		}
	};
	cir_data.push(cir_nodes);
}
for(var i = 24; i < 25; i++) {
	var cir_nodes = {
		"id": i,
		"name": "二级:" + i,
		"value": 10,
		"category": 1,
		"x": _x,
		"y": _y,
		"z": 0,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#78bc27'
			}
		}
	};
	cir_data.push(cir_nodes);
}

//---------------------------link
var cir_link = new Array;
for(var i = 1; i < 11; i++) {
	var cir_links = {
		"source": 0, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#4896cd"
			}
		}

	};
	cir_link.push(cir_links);
}

for(var i = 11; i < 15; i++) {
	var cir_links = {
		"source": 0, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	cir_link.push(cir_links);
}

for(var i = 15; i < 25; i++) {
	var cir_links = {
		"source": 24, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	cir_link.push(cir_links);
}

cir_link.push({

	"source": 0, //起始节点，0表示第一个节点
	"target": 24, //目标节点，1表示与索引为1的节点进行连接
	"lineStyle": {
		"normal": {
			"color": "#36cbde"
		}
	}

});
//----------------------------------------------第三幅图-------------------------------

var cir_category = [{
	"name": "一级",
	"itemStyle": {
		"normal": {
			"color": "#ff713c"
		}
	}
}, {
	"name": "二级",
	"itemStyle": {
		"normal": {
			"color": "#78bc27"
		}
	}
}, {
	"name": "三级",
	"itemStyle": {
		"normal": {
			"color": "#36cbde"
		}
	}
}, {
	"name": "四级",
	"itemStyle": {
		"normal": {
			"color": "#4896cd"
		}
	}
}]
var circular_data = new Array;
for(var i = 0; i < 1; i++) {
	var cir_nodes = {
		"id": i,
		"name": "一级:" + i,
		"value": 10,
		"category": 0,
		"symbolSize": "10",
		'itemStyle': {
			'normal': {
				'color': '#ff713c'
			}
		}
	};
	circular_data.push(cir_nodes);
}
for(var i = 1; i < 11; i++) {
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "四级:" + i,
		"value": 10,
		"category": 3,
		"z": 0,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#4896cd'
			}
		}
	};
	circular_data.push(cir_nodes);
}
for(var i = 11; i < 15; i++) {
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "三级:" + i,
		"value": 10,
		"category": 2,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#36cbde'
			}
		}
	};
	circular_data.push(cir_nodes);
}

for(var i = 15; i < 24; i++) {
	console.log(JSON.stringify(spot));
	var cir_nodes = {
		"id": i,
		"name": "二级:" + i,
		"value": 10,
		"category": 1,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#78bc27'
			}
		}
	};
	circular_data.push(cir_nodes);
}
for(var i = 24; i < 25; i++) {
	var cir_nodes = {
		"id": i,
		"name": "二级:" + i,
		"value": 10,
		"category": 1,
		"symbolSize": "5",
		'itemStyle': {
			'normal': {
				'color': '#78bc27'
			}
		}
	};
	circular_data.push(cir_nodes);
}
/*
 * 环形 links
 * {}
 */
var circular_link = new Array;
for(var i = 1; i < 11; i++) {
	var cir_links = {
		"source": 5, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}

for(var i = 11; i < 20; i++) {
	var cir_links = {
		"source": 0, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}
for(var i = 11; i < 17; i++) {
	var cir_links = {
		"source": 17, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}

for(var i = 15; i < 23; i++) {
	var cir_links = {
		"source": 22, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}

for(var i = 6; i < 15; i++) {
	var cir_links = {
		"source": 11, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}

for(var i = 19; i < 25; i++) {
	var cir_links = {
		"source": 24, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}

for(var i = 0; i < 3; i++) {
	var cir_links = {
		"source": 24, //起始节点，0表示第一个节点
		"target": i, //目标节点，1表示与索引为1的节点进行连接
		"lineStyle": {
			"normal": {
				"color": "#36cbde"
			}
		}

	};
	circular_link.push(cir_links);
}