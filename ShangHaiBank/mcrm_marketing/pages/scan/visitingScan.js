var baseInfo = null;
var sign; //判断传过来的是哪个界面
// 拍照添加图片分享
function shareCameraPicture(infoData) {
	if(infoData == "1") {
		sign = 1;
	}
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		plus.nativeUI.showWaiting('正在识别中...');
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			var picAddress;
			entry.file(function(file) {
				size = file.size;
				if(size < 1572864) { //图片小于1.5M时
					picAddress = entry.toLocalURL();
					Audio2dataURL(picAddress);
				} else if(size < 7340032) { //图片小于7M时
					plus.zip.compressImage({
							src: entry.toLocalURL(),
							dst: entry.toLocalURL(),
							overwrite: true,
							quality: 95
						},
						function(event) {
							picAddress = event.target;
							Audio2dataURL(picAddress);
						},
						function(error) {
							alert("Compress error!");
						});
				} else { //图片大于7M时
					plus.zip.compressImage({
							src: entry.toLocalURL(),
							dst: entry.toLocalURL(),
							overwrite: true,
							quality: 90
						},
						function(event) {
							picAddress = event.target;
							Audio2dataURL(picAddress);
						},
						function(error) {
							alert("Compress error!");
						});
				}
			});
		}, function(e) {
			mui.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
		mui.toast("取消扫描");
	});
}

function Audio2dataURL(path) { //转化为base64编码
	plus.io.resolveLocalFileSystemURL(path, function(entry) {
		entry.file(function(file) {
			var reader = new plus.io.FileReader();
			reader.onloadend = function(e) {
				baseInfo = e.target.result;
				var baseInfo1 = baseInfo.split(",");
				baseInfo = baseInfo1[1];

				mui.ajax(basePath + 'visitingScanAction!visitingScanInfo.json', {
					data: {
						baseInfo: baseInfo
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 25000, //超时时间设置为20秒；
					success: function(response) {
						plus.nativeUI.closeWaiting();
						var demoData = JSON.parse(JSON.parse(decodeURI(response.contentData)).outputs[0].outputValue.dataValue);
						var name = demoData.name.toString();
						var company = demoData.company.toString();
						var department = demoData.department.toString();
						var email = demoData.email.toString();
						var tel_cell = demoData.tel_cell;
						var tel_work = demoData.tel_work;
						var addr = demoData.addr.toString();

						mui.ajax(basePath + 'customerAction!searchCustInfoByVisit.json?mobile=' + tel_cell, {
							data: {},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 25000, //超时时间设置为20秒；
							success: function(response) {
								var info = response.info; //判断扫描的客户是否存在，如果存在，info=1，不存在info=0
								if(info == '0') { //如果不存在，则将客户保存
									//									document.getElementById("changeDis").style.display = "block";
									var dataInfo = [{
										"name": name,
										"company": company,
										"department": department,
										"email": email,
										"tel_cell": tel_cell,
										"tel_work": tel_work,
										"addr": addr
									}]
									go2visitingScan(dataInfo);
								} else { //如果存在，跳转到对私客户详情界面
									go2CustDetail(company,name);
								}
							},
							error: function(a, b, c) {
								plus.nativeUI.closeWaiting();
								mui.alert("服务繁忙，请重试！");
							}
						});
					},
					error: function(a, b, c) {
						plus.nativeUI.closeWaiting();
						mui.alert("服务繁忙，请重试！");
					}
				});
			};
			reader.readAsDataURL(file);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			mui.toast("扫描失败: " + e.message);
		})
	})
}

function go2visitingScan(dataInfo) { //进入对私客户详情

	var tel_cell = dataInfo[0].tel_cell;
	var tel_work = dataInfo[0].tel_work;
	var addr = dataInfo[0].addr;
	var name = dataInfo[0].name;
	var company = dataInfo[0].company;
	var department = dataInfo[0].department;
	var email = dataInfo[0].email;
	if(sign == "1") {
		var url = "../../scan/visitingScan.html?tel_cell=" + encodeURIComponent(tel_cell) + "&tel_work=" + encodeURIComponent(tel_work) + "&addr=" + encodeURIComponent(addr) + "&name=" + encodeURIComponent(name) + "&company=" + encodeURIComponent(company) + "&department=" + encodeURIComponent(department) + "&email=" + encodeURIComponent(email);
	} else {
		var url = "../scan/visitingScan.html?tel_cell=" + encodeURIComponent(tel_cell) + "&tel_work=" + encodeURIComponent(tel_work) + "&addr=" + encodeURIComponent(addr) + "&name=" + encodeURIComponent(name) + "&company=" + encodeURIComponent(company) + "&department=" + encodeURIComponent(department) + "&email=" + encodeURIComponent(email);
	}
	_App.util.goPage(url, {
		pageId: 'certificateScan_Id',
		refresh: true
	});
}

function go2CustDetail(company,name) { //进入对公客户详情
	if(sign == "1") {
		var url = "../../custManage/comCustomerDetail.html?company=" + encodeURIComponent(company)+"&name="+encodeURIComponent(name);
	} else {
		var url = "../custManage/comCustomerDetail.html?company=" + encodeURIComponent(company)+"&name="+encodeURIComponent(name);
	}

	_App.util.goPage(url, {
		pageId: 'comCustomerDetail_Id',
		refresh: true
	});
}

function addCustInfo() { //新增客户信息
	var name = document.getElementById("name").value;
	var company = document.getElementById("company").value;
	var department = document.getElementById("department").value;
	var email = document.getElementById("email").value;
	var tel_cell = document.getElementById("tel_cell").value;
	var tel_work = document.getElementById("tel_work").value;
	var addr = document.getElementById("addr").value;

	mui.ajax(basePath + 'customerAction!addCustInfoByVisit.json', {
		data: {
			tel_cell: tel_cell,
			tel_work: tel_work,
			addr: encodeURIComponent(addr),
			name: encodeURIComponent(name),
			company: encodeURIComponent(company),
			department: encodeURIComponent(department),
			email: encodeURIComponent(email)
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 25000, //超时时间设置为20秒；
		success: function(response) {
			go2CustDetail(company,name);
			mui.toast("新增客户成功");
		},
		error: function(a, b, c) {
			plus.nativeUI.closeWaiting();
			mui.alert("服务繁忙，请重试！");
		}
	});
}