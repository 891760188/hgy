//静态机构数据
var org = {
		'data': [{
			'orgId': '1',
			'ID': '1',
			'makeTalk': 'lizongjian',
			'img': 'temp_01.gif',
			'name': '李宗建',
			'position': '总行部门领导'
		}, {
			'orgId': '2',
			'ID': '2',
			'makeTalk': 'wangduizhang',
			'img': 'temp_01.gif',
			'name': '王兑章',
			'position': '分行团队长'
		}, {
			'orgId': '2',
			'ID': '3',
			'makeTalk': 'zhangjingli',
			'img': 'temp_02.gif',
			'name': '张晶丽',
			'position': '分行客户经理'
		}, {
			'orgId': '2',
			'ID': '4',
			'makeTalk': 'caijinli',
			'img': 'temp_03.gif',
			'name': '蔡金力',
			'position': '分行产品经理'
		}, {
			'orgId': '3',
			'ID': '5',
			'makeTalk': '张可有',
			'img': 'temp_01.gif',
			'name': '张可有',
			'position': '事业部团队长'
		}, {
			'orgId': '3',
			'ID': '6',
			'makeTalk': '李双',
			'img': 'temp_02.gif',
			'name': '李双',
			'position': '事业客户经理'
		}, {
			'orgId': '3',
			'ID': '7',
			'makeTalk': '吴明',
			'img': 'temp_03.gif',
			'name': '吴明',
			'position': '事业产品经理'
		}]
	}
	//机构名称
var orgName = {
	'data': [{
		'name': '总行',
		'orgId': '1'
	}, {
		'name': '分行',
		'orgId': '2'
	}, {
		'name': '能源矿业事业部',
		'orgId': '3'
	}]
};
//机构搜索数据
var orgS = {
	"data": [{
		orgId: '1',
		ID: '1',
		makeTalk: 'lizongjian',
		img: 'temp_01.gif',
		name: '李宗建',
		position: '总行部门领导'
	}]
};
//常用人数据
var common = {
	'data': [{
		'ID': '1',
		'makeTalk': '李宗建',
		'img': 'temp_01.gif',
		'name': '李宗建',
		'position': '总行部门领导'
	}, {
		'ID': '2',
		'makeTalk': '王兑章',
		'img': 'temp_01.gif',
		'name': '王兑章',
		'position': '分行团队长'
	}, {
		'ID': '3',
		'makeTalk': '张晶丽',
		'img': 'temp_02.gif',
		'name': '张晶丽',
		'position': '分行客户经理'
	}, {
		'ID': '4',
		'makeTalk': '蔡金力',
		'img': 'temp_03.gif',
		'name': '蔡金力',
		'position': '分行产品经理'
	}, {
		'ID': '5',
		'makeTalk': '张可有',
		'img': 'temp_01.gif',
		'name': '张可有',
		'position': '事业部团队长'
	}, {
		'ID': '6',
		'makeTalk': '李双',
		'img': 'temp_02.gif',
		'name': '李双',
		'position': '事业客户经理'
	}, {
		'ID': '7',
		'makeTalk': '吴明',
		'img': 'temp_03.gif',
		'name': '吴明',
		'position': '事业产品经理'
	}]
};
//常用人搜索数据
var commonS = {
	'data': [{
		'ID': '1',
		'makeTalk': '李宗建',
		'img': 'temp_01.gif',
		'name': '李宗建',
		'position': '总行部门领导'
	}]
};
//索引数据，多维数组
var indexDatas = {
	'data': [
		[{
			'ID': '1',
			'group': 'A',
			'dataValue': 'ANJ',
			'makeTalk': '安杰',
			'tags': 'AnJie',
			'name': '安杰'
		}, {
			'ID': '2',
			'group': 'A',
			'dataValue': 'AX',
			'makeTalk': '艾雪',
			'tags': 'AiXue',
			'name': '艾雪'
		}],

		[{
			'ID': '3',
			'group': 'B',
			'dataValue': 'MKM',
			'makeTalk': '鲍克明',
			'tags': 'BaoKeMing',
			'name': '鲍克明'
		}, {
			'ID': '4',
			'group': 'B',
			'dataValue': 'BM',
			'makeTalk': '包宁',
			'tags': 'BaoMing',
			'name': '包宁'
		}],

		[{
			'ID': '5',
			'group': 'C',
			'dataVvalue': 'CM',
			'makeTalk': '蔡明',
			'tags': 'caiming',
			'name': '蔡明'
		}],

		[{
			'ID': '6',
			'group': 'D',
			'dataValue': 'DHJ',
			'makeTalk': '杜海菊',
			'tags': 'DuHaiJu',
			'name': '杜海菊'
		}],

		[{
			'ID': '7',
			'group': 'E',
			'dataValue': 'EF',
			'makeTalk': '呃飞',
			'tags': 'ErFei',
			'name': '呃飞'
		}],

		[{
			'ID': '8',
			'group': 'F',
			'dataValue': 'FHM',
			'makeTalk': '方和明',
			'tags': 'FangHeMing',
			'name': '方和明'
		}],

		[{
			'ID': '9',
			'group': 'G',
			'dataValue': 'GM',
			'makeTalk': '龚梅',
			'tags': 'GongMei',
			'name': '龚梅'
		}],

		[{
			'ID': '10',
			'group': 'H',
			'dataValue': 'HY',
			'makeTalk': '黄页',
			'tags': 'HuangYe',
			'name': '黄页'
		}],

		[{
			'ID': '11',
			'group': 'J',
			'dataValue': 'JMJ',
			'makeTalk': '金铭决',
			'tags': 'JinMingjue',
			'name': '金铭决'
		}],

		[{
			'ID': '12',
			'group': 'K',
			'dataValue': 'KJT',
			'makeTalk': '阚锦涛',
			'tags': 'KanJinTao',
			'name': '阚锦涛'
		}],

		[{
			'ID': '13',
			'group': 'L',
			'dataValue': 'LJC',
			'makeTalk': '赖金成',
			'tags': 'LaiJinCheng',
			'name': '赖金成'
		}],

		[{
			'ID': '14',
			'group': 'M',
			'dataValue': 'MH',
			'makeTalk': '苗红',
			'tags': 'Miaohong',
			'name': '苗红'
		}],

		[{
			'ID': '15',
			'group': 'N',
			'dataValue': 'NCM',
			'makeTalk': '宁蔡明',
			'tags': 'NingCaiMing',
			'name': '宁蔡明'
		}],

		[{
			'ID': '16',
			'group': 'P',
			'dataValue': 'PF',
			'makeTalk': '彭飞',
			'tags': 'PengFei',
			'name': '彭飞'
		}],

		[{
			'ID': '17',
			'group': 'R',
			'dataValue': 'RX',
			'makeTalk': '任雪',
			'tags': 'RENXUE',
			'name': '任雪'
		}],

		[{
			'ID': '18',
			'group': 'S',
			'dataValue': 'SF',
			'makeTalk': '少飞',
			'tags': 'ShaoFei',
			'name': '少飞'
		}],

		[{
			'ID': '19',
			'group': 'T',
			'dataValue': 'TD',
			'makeTalk': '唐丹',
			'tags': 'TangDan',
			'name': '唐丹'
		}],

		[{
			'ID': '20',
			'group': 'W',
			'dataValue': 'ANJ',
			'makeTalk': '王克卿',
			'tags': 'WangkeQing',
			'name': '王克卿'
		}],

		[{
			'ID': '21',
			'group': 'X',
			'dataValue': 'XH',
			'makeTalk': '肖红',
			'tags': 'XiaoHong',
			'name': '肖红'
		}],

		[{
			'ID': '22',
			'group': 'Y',
			'dataValue': 'YSM',
			'makeTalk': '闫世明',
			'tags': 'YanShiMing',
			'name': '闫世明'
		}],

		[{
			'ID': '23',
			'group': 'Z',
			'dataValue': 'ZKY',
			'makeTalk': '张可有',
			'tags': 'ZhanKeYou',
			'name': '张可有'
		}]
	]
};