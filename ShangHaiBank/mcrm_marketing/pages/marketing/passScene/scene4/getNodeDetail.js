
function getNowThreeDetail(refId) {
	var data_ = {};
	data_.signId = "" + refId;
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneOneManageAction!getSignMes.json',
		data: data_,
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data[0];
			var startTime = data.createDate + " " + data.signTime;
			var divId = document.getElementById('divId');
			var _html = "";
			_html += '<ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell"><a><span class="mui-icon mui-icon-minus">';
			_html += '</span><b>时间:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div1">' + startTime + '</span></a></li>';
			_html += '<li class="mui-table-view-cell"><a class="mui-navigate-right"><span class="mui-icon mui-icon-location"></span>';
			_html += '<b>地址:</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id="div2">' + data.signAddress + '</span>';
			_html += '</a></li></ul>';

			_html += '<ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell"><a class="mui-navigate-right">';
			_html += '<span class="mui-icon mui-icon-star"></span><b>拜访客户:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custName">' + data.custName + '</span>';
			_html += '</a></li><li class="mui-table-view-cell"><a class="mui-navigate-right"><span class="mui-icon mui-icon-star"></span>';
			_html += '<b>电话:</b>&nbsp;&nbsp;&nbsp;&nbsp;<span id="custNames">13121014011</span></a></li>';
			_html += '<li class="mui-table-view-cell"><a class=""><span class="mui-icon mui-icon-compose"></span>';
			_html += '<b>签到详情:</b><br><br><span>';
			_html += '<textarea type="text" id="ts" readonly=true class="mui-input-clear" style="height:6em;" placeholder="备注内容" readonly="true">' + data.signMemo + '</textarea>';
			_html += '</span></a></li></ul>';
			divId.innerHTML = _html;
			document.querySelector('.mui-title').innerHTML="3客户拜访";
			//			document.getElementById('div1').innerHTML = startTime;
			//			document.getElementById('div2').innerHTML = data.signAddress;
			//			document.getElementById('custName').innerHTML = data.custName;
			//			document.getElementById('custNames').innerHTML = data.custNames;
			//			document.getElementById('ts').innerHTML = data.signMemo;
			//			document.getElementById('ts').setAttribute('readonly', 'true');
		},
		error: function(a, b, c) {
			mui.alert("获取信息失败");
		}
	});
}

function getNowTwoDetail(refId) {
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeTwoDetail.json?refId=' + refId,
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data[0];
			var _html = "";
			var is_key;
			if(data.IS_KEY == 1) {
				is_key = "是";
			} else {
				is_key = "否";
			}
			var divId = document.getElementById('divId');
			_html += '<form id="addShceduleForm" action="" method="get"><ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell" style="height:6em;">'
			_html += '<textarea id="schTitle" type="text" class="mui-input-clear borderCss" placeholder="日程标题" readonly="true">' + data.SCH_CONTENT + '</textarea></li></ul>'
			_html += '<ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell"><a class="mui-navigate-right mytime" data-options="{}">'
			_html += '<span class="mui-icon icon-clock"></span> 开始时间&nbsp;&nbsp;&nbsp;&nbsp;<span id="startTime">' + data.START_TIME + '</span></a></li>'
			_html += '<li class="mui-table-view-cell"><a class="mui-navigate-right mytime" data-options="{}"><span class="mui-icon icon-bell"></span> 结束时间&nbsp;&nbsp;&nbsp;&nbsp;'
			_html += '<span id="endTime">' + data.START_TIME + '</span></a></li><li class="mui-table-view-cell"><a class="mui-navigate-right" id="visitP">'
			_html += '<span class="mui-icon icon-man"></span> 参与 &nbsp;&nbsp;&nbsp;&nbsp;<span id="parter">' + data.PARTER + '</span></a></li></ul>'
			_html += '<ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell"><a id="addrTmp"><span class="mui-icon icon-location2"></span> 地点 &nbsp;&nbsp;&nbsp;&nbsp;'
			_html += '<span id="addr">' + data.ADDR + '</span></a></li></ul><ul class="mui-table-view mui-table-view-group"><li class="mui-table-view-cell">'
			_html += '<a><span class="mui-icon icon-exit"></span>	重要<div id="isKey" style="display:none;">1</div>'
			_html += '<div class="mui-switch-handle"></div></div><div id="switchBtnId2" style="position: absolute;top: 13px;right: 15px;">' + is_key + '</div></a></li></ul></form>'
			divId.innerHTML = _html;
			
			document.querySelector('.mui-title').innerHTML="2日程安排";

			//			document.getElementById('startTime').innerHTML = data.START_TIME;
			//			document.getElementById('endTime').innerHTML = data.END_TIME;
			//
			//			document.getElementById('schTitle').innerHTML = data.SCH_CONTENT;
			//			document.getElementById('schTitle').setAttribute('readonly', 'true')
			//
			//			document.getElementById('parter').innerHTML = data.PARTER;
			//			document.getElementById('addr').innerHTML = data.ADDR;
			//			document.getElementById('switchBtnId').style.display = "none";
			//			if(data.IS_KEY == 1) {
			//				document.getElementById('switchBtnId2').innerHTML = "是";
			//			} else {
			//				document.getElementById('switchBtnId2').innerHTML = "否";
			//			}

		},
		error: function() {
			mui.alert('出错了！');
		}
	});
}

function getNowOneDetail(activeId) {
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "get",
		url: basePath + 'mktSceneFourManageAction!getNodeOne.json',
		data: {
			activeId: activeId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			ws.close();
			var data = response.json.data[0];
			showDetail(data);
		},
		error: function() {
			ws.close();
			mui.alert('加载失败！');
		}
	});
}

function showDetail(data) {
	
	document.querySelector('.mui-title').innerHTML="1客户查看";
	var phone = "13121014011";
	var addr = "四川省武侯区天府大道中段辅路";
	var birth = "7月20日";
	var is_Core = "是";
	var name = data.CUST_NAME;
	var cust_id = data.CUST_ID;
	var formDiv = document.getElementById('divId');
	formDiv.innerHTML = '<form class="mui-input-group">' +
		'<div class="mui-input-row"><label>姓名:</label><input id="actName" type="text" readonly="readonly" value="' + name + '"></div>' +
		'<div class="mui-input-row"><label>生日:</label><input id="actName" type="text" readonly="readonly" value="' + birth + '"></div>' +
		'<div class="mui-input-row"><label>核心客户:</label><input id="actName" type="text" readonly="readonly" value="' + is_Core + '"></div>' +
		'<div class="mui-input-row"><label>客户号:</label><input id="actName" type="text" readonly="readonly" value="' + data.IDENT_NO + '"></div>' +
		'<div class="mui-input-row"><label>电话:</label><input id="actName" type="text" readonly="readonly" value="' + phone + '"></div>' +
		'<div class="mui-input-row"><label>地址:</label><input id="cost" type="text" readonly="readonly" value="' + addr + '"></div>'

}