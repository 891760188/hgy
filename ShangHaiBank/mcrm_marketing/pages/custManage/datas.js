/*
 * auth：yh
 * time：2017年3月14日13:57:05
 * 构造数据需要使用修改过的echarts
 * 
 */
var categories = [{
	"name": "北京天琪科技集团股份有限公司",
	"itemStyle": {
		"normal": {
			"color": "#4896cd"
		}
	}
}, {
	"name": "对外投资",
	"itemStyle": {
		"normal": {
			"color": "#ff713c"
		}
	}
}, {
	"name": "股东",
	"itemStyle": {
		"normal": {
			"color": "#78bc27"
		}
	}
}, {
	"name": "高管",
	"itemStyle": {
		"normal": {
			"color": "#f99900"
		}
	}
}, {
	"name": "历史法人",
	"itemStyle": {
		"normal": {
			"color": "#dc97ff"
		}
	}
}];

var links = new Array;
for(var i= 1; i < 8;i++){
	var cir_links = {
		"source": 0, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	};
	links.push(cir_links);
}

for(var i= 8; i < 24;i++){
	var cir_links = {
		"source": 1, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	};
	links.push(cir_links);
}

for(var i= 35; i < 45;i++){
	var cir_links = {
		"source": 3, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	};
	links.push(cir_links);
}

for(var i= 45; i < 52;i++){
	var cir_links = {
		"source": 7, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	};
	links.push(cir_links);
}

for(var i= 24; i < 35;i++){
	var cir_links = {
		"source": 2, //起始节点，0表示第一个节点
		"target": i //目标节点，1表示与索引为1的节点进行连接
	};
	links.push(cir_links);
}

var demoData = [{
	"id": 0,
	"name": "北京天琪科技集团股份有限公司",
	"category": 0,
	"value":10,
	"r": 0

}, {
	"id": 1,
	"name": "对外投资",
	"category": 1,
	"value":10,
	"r": 1

}, {
	"id": 2,
	"name": "股东",
	"category": 2,
	"value":10,
	"r": 1

}, {
	"id": 3,
	"name": "高管",
	"category": 3,
	"value":10,
	"r": 1

}, {
	"id": 4,
	"name": "法院公告",
	"category": 10,
	"r": 1

}, {
	"id": 5,
	"name": "裁判文书",
	"category": 5,
	"value":10,
	"r": 1

}, {
	"id": 6,
	"name": "历史股东",
	"category": 10,
	"value":10,
	"r": 1

}, {
	"id": 7,
	"name": "历史法人",
	"category": 4,
	"value":10,
	"r": 1

}, {
	"id": 8,
	"name": "上海宇壹信息科技有限公司",
	"category": 1,
	"r": 2

}, {
	"id": 9,
	"name": "珠海宇诚信科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 10,
	"name": "珠海天琪科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 11,
	"name": "珠海天琪鸿泰科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 12,
	"name": "无锡天琪科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 13,
	"name": "铜根源（北京）信息咨询有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 14,
	"name": "上海拍贝信息科技有限公司",
	"category": 1,
	"r": 2

}, {
	"id": 15,
	"name": "长沙拓银电子科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 16,
	"name": "浙江天琪班克信息技术有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 17,
	"name": "北京互动软件技术有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 18,
	"name": "天琪数据科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 19,
	"name": "天津天琪科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 20,
	"name": "北京优迪信息技术有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 21,
	"name": "北京天琪华智咨询服务有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 22,
	"name": "成都天琪科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 23,
	"name": "广州天琪信息科技有限公司",
	"value":10,
	"category": 1,
	"r": 2

}, {
	"id": 24,
	"name": "珠海宇琴通诚资产管理合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 25,
	"name": "Fidelity Information Services International Holdings,Inc.",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 26,
	"name": "珠海宇琴优迪资产管理合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 27,
	"value":10,
	"name": "尚远有限公司",
	"category": 2,
	"r": 2

}, {
	"id": 28,
	"name": "珠海宇琴鸿泰资产管理有限公司",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 29,
	"name": "珠海宇琴高科资产管理合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 30,
	"name": "珠海宇琴华创资产管理合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 31,
	"name": "华侨星城（上海）股权投资基金合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 32,
	"name": "珠海爱康佳华资产管理合伙企业(有限合伙)",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 33,
	"name": "珠海宇琴鸿信资产管理合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 34,
	"name": "杭州海富恒歆股权投资合伙企业（有限合伙）",
	"value":10,
	"category": 2,
	"r": 2

}, {
	"id": 35,
	"name": "洪卫东",
	"value":10,
	"isPerson":true,
	"category": 3,
	"r": 2

}, {
	"id": 36,
	"name": "戴士平",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 37,
	"name": "雷家骕",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 38,
	"name": "李建国",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 39,
	"name": "刘东",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 40,
	"name": "宋开宇",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 41,
	"name": "王燕梅",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 42,
	"name": "封竞",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 43,
	"name": "毛志宏",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 44,
	"name": "任利京",
	"isPerson":true,
	"value":10,
	"category": 3,
	"r": 2

}, {
	"id": 45,
	"name": "前进财富投资有限公司",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 46,
	"name": "珠海宇琴广利信息咨询合伙企业（有限合伙）",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 47,
	"name": "珠海宇琴鸿信信息咨询合伙企业（有限合伙）",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 48,
	"name": "珠海宇琴优迪信息咨询合伙企业（有限合伙）",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 49,
	"name": "珠海宇琴华创信息咨询合伙企业（有限合伙）",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 50,
	"name": "珠海宇琴金智信息咨询合伙企业（有限合伙）",
	"value":10,
	"category": 4,
	"r": 2

}, {
	"id": 51,
	"name": "珠海宇琴鸿泰信息咨询有限公司",
	"value":10,
	"category": 4,
	"r": 2

}]

/*
 * 个人图谱数据---------------------------------------------------------------------------------------------------------------------------------
 */
var personCategory=[{
	"name": "家庭",
	"itemStyle": {
		"normal": {
			"color": "#4896cd"
		}
	}
}, {
	"name": "同事",
	"itemStyle": {
		"normal": {
			"color": "#ff713c"
		}
	}
}, {
	"name": "朋友",
	"itemStyle": {
		"normal": {
			"color": "#78bc27"
		}
	}
}, {
	"name": "公司",
	"itemStyle": {
		"normal": {
			"color": "#f99900"
		}
	}
}];
var personData=[{
	"name": "吴亮",
	"value":10,
	"r": 0
},{
	"name": "家庭",
	"category": 0,
	"value":10,
	"r": 1
},{
	"name": "同事",
	"category": 1,
	"value":10,
	"r": 1
},{
	"name": "朋友",
	"category": 2,
	"value":10,
	"r": 1
},{
	"name": "公司",
	"category": 3,
	"value":10,
	"r": 1
},{
	"name": "孟令泽",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "王志飞",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "何亮",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "林文龙",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "林月",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "张丹",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "张龙",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "王通",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "杨月",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "刘哲",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "刘大龙",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "于宇",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "王凯",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "王达",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "杨月",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "杨曾",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "晓卢",
	"category": 1,
	"value":10,
	"r": 2
},{
	"name": "陈烨",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "陈潇",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "李大伟",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "郭更新",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "吕光",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "董鹏",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "苏达",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "蔡铭",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "任非",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "张仲",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "苗仲",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "安俞",
	"category": 2,
	"value":10,
	"r": 2
},{
	"name": "吴达",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "吴杰",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "吴哲",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "吴蒙",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "吴江",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "郭微",
	"category": 0,
	"value":10,
	"r": 2
},{
	"name": "北京天琪科技集团股份有限公司",
	"category": 3,
	"type":1,
	"value":10,
	"r": 2
},{
	"name": "无锡天琪科技科技有限公司",
	"category": 3,
	"type":1,
	"value":10,
	"r": 2
}];
var personLink=new Array;
personLink.push({
	source:0,
	target:1,
	relation:'家庭'
});
personLink.push({
	source:0,
	target:2,
	relation:'同事'
});

personLink.push({
	source:0,
	target:3,
	relation:'朋友'
});

personLink.push({
	source:0,
	target:4,
	relation:'公司'
});


for(var i= 5 ;i<22;i++){
	var tmp = {
		source:2,
		target:i
	}
	personLink.push(tmp);
}
for(var i= 22 ;i<34;i++){
	var tmp = {
		source:3,
		target:i
	}
	personLink.push(tmp);
}
personLink.push({
	source:1,
	target:34,
	relation:'父亲'
});
personLink.push({
	source:1,
	target:35,
	relation:'儿子'
});
personLink.push({
	source:1,
	target:36,
	relation:'儿子'
});
personLink.push({
	source:1,
	target:37,
	relation:'爷爷'
});
personLink.push({
	source:1,
	target:38,
	relation:'女儿'
});
personLink.push({
	source:1,
	target:39,
	relation:'母亲'
});
for(var i= 40 ;i<43;i++){
	var tmp = {
		source:4,
		target:i
	}
	personLink.push(tmp);
}