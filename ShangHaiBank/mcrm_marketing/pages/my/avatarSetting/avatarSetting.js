//相册选取
function appendByGallery() {
		plus.gallery.pick(function(p) {
			imgs.src = p;
			imgs.onload = function() {
				EXIF.getData(imgs, function() {
					var ori = EXIF.getTag(imgs, "Orientation");
					avapath = p;
					oris(ori, avapath); 
				});
			}
		});
}
//放弃
function appendByCameras(){
	deleteImage(target);
	plus.webview.currentWebview().reload();
}
//本地拍照
function appendByCamera() {
		var cmr = plus.camera.getCamera();
		var res = cmr.supportedImageResolutions[0];
		var fmt = cmr.supportedImageFormats[0];
		cmr.captureImage(function(path) {
			var absPath = document.URL.split("/www/")[0] + "/"
			path = path.substring(1, path.length);
			path = absPath + path;
			imgs.src = path;
			imgs.onload = function() {
				EXIF.getData(imgs, function() {
					var ori = EXIF.getTag(this, "Orientation");
					avapath = path;
					oris(ori, avapath);
				});
				
			}
		});
}
//上传
function appendByGallerys(){
	if (target !== "") {
				uploadFile(target);
				target = "";
			}
	document.getElementById('userpsBt2').style.display="none";
	document.getElementById('userpsBt1').style.display="block";
	
}
var wwt;
//判断当前选取图片方向
function oris(ori, path) {
	wwt = plus.nativeUI.showWaiting();
	switch (ori) {
		case 1:
			//当为1时候，显示正确
			rotateImage(0, path,0);
			break;
		case 3:
			rotateImage(2, path,0);
			break;
		case 6:
			rotateImage(1, path,0);
			break;
		case 8:
			rotateImage(3, path,0);
			break;
		default:
			rotateImage(4,path,1);
			break;
	}
}
//旋转图片,安卓部分手机需要选择，ios不能使用该方法（会不显示），由于其在图片显示的时候已经将图片方向转变
function rotateImage(Ori, path,len) {
	var paths = path.substring(path.lastIndexOf('/') + 1, path.length);
	var dst_ = "_doc/" + paths;
	var options;
	if (plus.os.name != "iOS"||len==1) {
		var q_ = 15;
		options = {
			src: path,
			dst: dst_,
			overwrite: true,
			quality: q_,
			rotate: 90 * Ori // 旋转90度
		};
	} else {
		q_ = 10;
		options = {
			src: path,
			dst: dst_,
			overwrite: true,
			quality: q_
		};
	}
	plus.zip.compressImage(options,
		function(event) {
			wwt.close();
			target = event.target; // 压缩转换后的图片url路径，以"file://"开头
			files.push({
				name: "uploadkey",
				path: target
			});
			imgss.src = target;
			document.getElementById('userpsBt1').style.display="none";
			document.getElementById('userpsBt2').style.display="block";
		},
		function(error) {
			wwt.close();
//			alert("Compress error!");
		});

}
// 上传头像
function uploadFile(path) {
	var wt = plus.nativeUI.showWaiting();
	var task = plus.uploader.createUpload(server, {
			method: "POST",
			url: files[0].path
		},
		function(t, status) { //上传完成
			if (status == 200) {
				//上传成功后得到文件名
				var s = t.options.url;
				var fileName = s.substring(s.lastIndexOf('/') + 1, s.length);
				var uploadName = t.responseText.split('realFileName:')[1].split('}')[0];
				var uploadNames = uploadName.substring(1, uploadName.length - 1);
				_App.ajax({
					type: "get",
					url: basePath + 'adminAccountOperation!upDateImg.json',
					data: {
						temp1: uploadNames
					},
					cache: false,
					dataType: "json",
					success: function(response) {
						//获取不到文件，重新缓存
						var saveLocalFile = "_doc/" + uploadNames;
						var durls = basePath + "AnnexeDownload?filename=" + uploadNames + "&annexeName=" + uploadNames;
						var options = {
							method: "GET",
							filename: saveLocalFile
						};
						var dtask = plus.downloader.createDownload(durls, options, function(d, status) {
							// 下载完成
							if (status == 200) {
								var patht = plus.io.convertLocalFileSystemURL(d.filename);
								patht = "file://" + patht;
								mui.alert("设置头像成功!");
								deleteImages(plus.storage.getItem("_userPic"));
								plus.storage.setItem('_userPic',uploadNames);//设置新的路径
								plus.storage.setItem('_userPic', uploadNames);
								mui.fire(plus.webview.getWebviewById('user-menu'),'avapic',{
									id:patht
								});
								mui.fire(plus.webview.getWebviewById('../my/my.html'),'SETEDPHOTO',{
									src:patht
								});
								//监听首页
								mui.fire(plus.webview.getWebviewById('mainPage.html'),'SETEDPHOTO',{
									src:patht
								});
							} else {
								mui.alert("下载失败!");
							}
						});
						//dtask.addEventListener( "statechanged", onStateChanged, false );
						dtask.start();
						//本地缓存本队头像名和上传头像名
					},
					error: function(a, b, c) {
						mui.alert("网络连接出错!");
					}
				});
				wt.close();
			} else {
				mui.alert("设置头像失败：" + status);
				wt.close();
			}
		}
	);
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, {
			key: f.name
		});
	}
	task.start();
}

function deleteImage(targets) {
	var judurl = plus.io.convertAbsoluteFileSystem(targets);
	plus.io.resolveLocalFileSystemURL(judurl, function(entry) {
		entry.remove(function(entry) {
			target = "";
		}, function(e) {
			mui.alert(e.message);
		});
	}, function(error) {
		mui.alert("没找到文件");
	});
};
function deleteImages(pathname){
	var judurl ="_doc/"+plus.io.convertAbsoluteFileSystem(pathname);
	plus.io.resolveLocalFileSystemURL(judurl, function(entry) {
		entry.remove(function(entry) {
		}, function(e) {
			mui.alert(e.message);
		});
	}, function(error) {
//		mui.alert("没找到文件");
	});
}
