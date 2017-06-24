var baseInfo = null;
var sign; //判断传过来的是哪个界面
// 拍照添加图片分享
function shareCameraPicture1(infoData) {
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
					Audio2dataURL1(picAddress);
				} else if(size < 7340032) { //图片小于7M时
					plus.zip.compressImage({
							src: entry.toLocalURL(),
							dst: entry.toLocalURL(),
							overwrite: true,
							quality: 95
						},
						function(event) {
							picAddress = event.target;
							Audio2dataURL1(picAddress);
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
							Audio2dataURL1(picAddress);
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

function Audio2dataURL1(path) { //转化为base64编码
	plus.io.resolveLocalFileSystemURL(path, function(entry) {
		entry.file(function(file) {
			var reader = new plus.io.FileReader();
			reader.onloadend = function(e) {
				plus.nativeUI.showWaiting('正在识别中...');
				baseInfo = e.target.result;
				var baseInfo1 = baseInfo.split(",");
				baseInfo = baseInfo1[1];
				mui.ajax(basePath + 'certificateScanAction!certificateScanInfo.json', {
					data: {
						baseInfo: baseInfo
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 25000, //超时时间设置为20秒；
					success: function(response) {
						plus.nativeUI.closeWaiting();
						var demoData = JSON.parse(JSON.parse(decodeURI(response.contentData)).outputs[0].outputValue.dataValue);
						var certificateNum = demoData.num;
						var name = demoData.name.toString();
						var sex = demoData.sex.toString();
						var nationality = demoData.nationality.toString();
						var birth = demoData.birth.toString();
						var address = demoData.address.toString();

						mui.ajax(basePath + 'customerAction!searchCustInfo.json?certificateNum=' + certificateNum, {
							data: {},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 25000, //超时时间设置为20秒；
							success: function(response) {
								var info = response.info; //判断扫描的客户是否存在，如果存在，info=1，不存在info=0
								if(info == '0') { //如果不存在，则将客户保存
									var dataInfo = [{
										"certificateNum": certificateNum,
										"name": name,
										"sex": sex,
										"nationality": nationality,
										"birth": birth,
										"address": address
									}]

									go2certificateScan(dataInfo);
								} else { //如果存在，跳转到对私客户详情界面
									go2CustDetail1(name);
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
			mui.toast("扫描失败" + e.message);
		})
	})
}

function go2CustDetail1(name) { //进入对私客户详情
	if(sign == "1") {
		var url = "../../custManage/priCustomerDetail.html?name=" + encodeURIComponent(name);
	} else {
		var url = "../custManage/priCustomerDetail.html?name=" + encodeURIComponent(name);
	}
	_App.util.goPage(url, {
		pageId: 'priCustomerDetail_Id',
		refresh: true
	});
}

function go2certificateScan(dataInfo) { //进入对私客户详情
	var certificateNum = dataInfo[0].certificateNum;
	var name = encodeURIComponent(dataInfo[0].name);
	var sex = encodeURIComponent(dataInfo[0].sex);
	var nationality = encodeURIComponent(dataInfo[0].nationality);
	var birth = encodeURIComponent(dataInfo[0].birth);
	var address = encodeURIComponent(dataInfo[0].address);
	if(sign == "1") {
		var url = "../../scan/certificateScan.html?name=" + name + "&certificateNum=" + certificateNum + "&sex=" + sex + "&nationality=" + nationality + "&birth=" + birth + "&address=" + address;
	} else {
		var url = "../scan/certificateScan.html?name=" + name + "&certificateNum=" + certificateNum + "&sex=" + sex + "&nationality=" + nationality + "&birth=" + birth + "&address=" + address;
	}

	_App.util.goPage(url, {
		pageId: 'certificateScan_Id',
		refresh: true
	});
}

function addCustInfo1() { //新增客户信息
	var certificateNum = document.getElementById("num").value;
	var name = document.getElementById("name").value;
	var sex = document.getElementById("sex").value;
	var nationality = document.getElementById("nationality").value;
	var birth = document.getElementById("birth").value;
	var address = document.getElementById("address").value;
	mui.ajax(basePath + 'customerAction!addCustInfo.json', {
		data: {
			certificateNum: certificateNum,
			name: encodeURIComponent(name),
			sex: encodeURIComponent(sex),
			nationality: encodeURIComponent(nationality),
			birth: encodeURIComponent(birth),
			address: encodeURIComponent(address)
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 25000, //超时时间设置为20秒；
		success: function(response) {
			go2CustDetail1(name);
			mui.toast("新增客户成功");
		},
		error: function(a, b, c) {
			plus.nativeUI.closeWaiting();
			mui.alert("服务繁忙，请重试！");
		}
	});
}