/***
 * 保存任务数据
 */
var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));

function saveApply() {
	var applyReason = document.getElementById('applyReason').value;
	var startTime = document.getElementById('startTime').value;
	var endTime = document.getElementById('endTime').value;
	_App.ajax({
		type: "POST",
		url: basePath + 'ocrmFMobileLeaveApproveAction!addApply.json?applyReason=' + applyReason + '&startTime=' + startTime + '&endTime=' + endTime,
		cache: false,
		dataType: "json",
		contentType: "application/x-www-form-urlencoded; charset=utf-8",
		success: function(response) {
			var cwebviewId = decodeURIComponent(_App.util.getUrlParamByName("cwebviewId"));
			cwebviewId = plus.webview.getWebviewById(cwebviewId);
			mui.fire(cwebviewId, 'refreshApprove', {});
			mui.toast("新增成功");
			plus.webview.currentWebview().close();
		},
		error: function() {
			plus.nativeUI.closeWaiting();
			mui.alert('保存失败！');
		}
	});
};

//初始化数据
function initTask(id) {
	//	var id = _App.util.getUrlParamByName("id");
	if(id != "null") {
		var condition = {}; //查询条件
		condition.id = id;
		_App.ajax({
			type: "get",
			url: basePath + 'ocrmFMobileWaitingTaskAction!index.json?conditions=' + JSON.stringify(condition),
			data: {},
			cache: false,
			dataType: "json",
			success: function(response) {
				var data = response.json.data;
				var dt = new Date();
				var str = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate() + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
				if(data.length > 0) {
					document.getElementById("title").value = data[0].TITLE;
					document.getElementById("name").value = data[0].NAME;
					document.getElementById("parter").innerText = data[0].ACC_PEOPLE;
					document.getElementById("time").value = str;
					var selectCount = document.getElementById("state").options;
					for(var i = 0; i < selectCount.length; i++) {
						if(selectCount[i].value == data[0].STATES) {
							selectCount.selected = true;
						}
					}
					document.getElementById("detail").innerHTML = data[0].DETAIL;
				} else {
					mui.toast("已全部加载完成");
				}
			},
			error: function(a, b, c) {
				mui.alert("网络连接出错!");
			}
		});
	}
}