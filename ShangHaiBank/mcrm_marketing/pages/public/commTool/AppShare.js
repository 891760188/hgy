/*!
 *	分享组件
 * 		支持截屏图片分享，支持文本分享
 * 	创建人：jiangny
 *  创建时间: 2016-12-12
 * 	修改人：wuxl
 * 	修改时间：2016-12-27
 *  场景分享描述：passId，recordId是工作圈对这两个数据进行处理，点击跳转到对应的游戏界面 -- 特殊
 *  weOb.draw将Webview窗口的可视区域截屏并绘制到Bitmap图片对象中。
 *  前台传参：param:{
			shareTitle:"",//手动输入，分享的标题
			shareUrl: "",//图片地址，不需要开发者填写
			passId: "",//进入对应游戏界面的参数，详细可参考首页跳转到营销活动的方法 -- 场景必须
			recordId:""//进入对应游戏界面的参数，详细可参考首页跳转到营销活动的方法 -- 场景必须
			bizId:对应业务主键ID--非场景 必须
			bizType:业务类型：日志-LOG；日程-SCH；公告-NTC；场景-SCENE；商机-OPP；业绩-ACH；审批-APPR -- 必须
			authorityType:开放式协同(公开)-1；团队内部（秘密）-2 -- 默认为1
			shareOutFlag：分享标识：1-工作圈；2-微信 -- 必须
			shareInfoType：分享信息类型：1-图片；2-base64（echarts）；3-文本（包括地址类信息）
		},
	
 */
(function($) {
	var bitmap = null;
	var shares = null;
	var pictures = null; //截屏的图片地址
	//ids与bts是用来配置分享信息
	var ids = [{
		id: "weixin",
		ex: "WXSceneSession"
	}, {
		id: "weixin",
		ex: "WXSceneTimeline"
	}]
	var bts = [{
		title: "发送给微信好友"
	}, {
		title: "分享到微信朋友圈"
	}, {
		title: "分享到工作圈"
	}];
	var _Share = {
		//先截屏并保存到Bitmap图片对象中，ws为所要截屏的界面对象：一般都是plus.webview.currentWebview()
		//fn：回调函数，当分享到工作圈时要将数据提交到数据库
		init: function(ws, fn, errorFn) {
			if(!mui.isFunction(fn)){
				console.log("必须有成功回调函数！");
				return;
			}
			//参数ws.id为分享的页面对象
			if(ws) {
				plus.nativeUI.showWaiting();
				bitmap = new plus.nativeObj.Bitmap(ws.id);
				ws.draw(bitmap, function() {
					console.log('截屏绘制图片成功');
					bitmap.save("_doc/share.jpg", { //保存到doc文件夹下
						overwrite: true //参数：覆盖相同文件名文件
					}, function(i) {
						bitmap.clear();
						plus.nativeUI.closeWaiting();
						console.log('保存图片成功：' + JSON.stringify(i));
						var st = JSON.stringify(i.target);
						pictures = "_doc/" + st.substring(st.lastIndexOf("/") + 1, st.length - 1);
						fn(pictures);//图片地址在回调函数中取
					}, function(e) {
						console.log('保存图片失败：' + JSON.stringify(e));
						bitmap.clear();
						plus.nativeUI.closeWaiting();
						if(mui.isFunction(errorFn))
							errorFn();
					});
				}, function(e) {
					console.log('截屏绘制图片失败：' + JSON.stringify(e));
					bitmap.clear();
					plus.nativeUI.closeWaiting();
					if(mui.isFunction(errorFn))
						errorFn();
				});
			} else {
				mui.alert("页面对象获取出错!", "温馨提示");
			}
		},
		doUploadPic: function(pictures_, params, fn, errorFn) {//分享的是图片
			plus.nativeUI.showWaiting();
			//得到图片保存路径
			var server = basePath + "FileUpload";
			var task = plus.uploader.createUpload(server, {}, function(t, status) { //上传完成
				if(status == 200) {
					console.log("上传成功!");
					var myS = t.responseText;
					myS = myS.replace("{success:true,realFileName:'", "");
					myS = myS.replace("'}", "");
					params.shareUrl = myS;
					_App.share.doShare(params, fn, errorFn)
					plus.nativeUI.closeWaiting();
				} else {
					console.log("上传失败：" + status);
					plus.nativeUI.closeWaiting();
				}
			});
			task.addFile(pictures_, {
				key: "sharees"
			});
			task.start();
			if(bitmap)
				bitmap.clear(); //
		},
		doDownloadPic: function(obj, theSrc, thisSrc) {
			//obj：图片需要赋予给的对象，theSrc为后台传的图片名
			//用于本地搜索，本地没有，则到服务中下载

			if(!theSrc || theSrc == "") {
				return false;
			}
			var saveLocalFile = "_doc/" + theSrc;
			plus.io.resolveLocalFileSystemURL(saveLocalFile, function() {
				//本地已缓存 
				var patht1 = "file://" + plus.io.convertLocalFileSystemURL(saveLocalFile);
				if(patht1 == thisSrc) {
					return false;
				} else {
					obj.src = patht1;
				}
			}, function() {
				//获取不到文件，重新缓存

				var durls = basePath + "AnnexeDownload?filename=" + theSrc + "&annexeName=" + theSrc;
				var options = {
					method: "GET",
					filename: saveLocalFile
				};
				var dtask = plus.downloader.createDownload(durls, options, function(d, status) {
					// 下载完成
					if(status == 200) {
						var patht = plus.io.convertLocalFileSystemURL(d.filename);
						patht = "file://" + patht;
						console.log('下载成功' + d.filename);
						obj.onload = "";
						obj.src = patht;
					} else {
						mui.alert("下载失败!");
						if(errorFn) {
							errorFn();
						}
					}
				});
				dtask.start();
			});
		},
		//插入数据
		doShare: function(params, fun, errorFn) { //关注
			_App.ajax({
				type: "GET",
				url: basePath + 'ocrmShareAction!saveData.json',
				cache: false,
				data: params,
				dataType: "json",
				success: function(response) {
					mui.toast("分享成功！");
					if(fun) {
						fun();
					}
				},
				error: function() {
					mui.alert('分享失败！');
					if(errorFn) {
						errorFn();
					}
				}
			});
		},
		sendShare:function(params,fn,errorFn){//获取分享到哪儿,并分享出去
			var myShare = document.querySelector('.share');
			if(myShare){
				myShare.style.display = "block";
			}
			
			plus.nativeUI.actionSheet({
					cancel: "取消",
					buttons: bts
				},
				function(e) {
					var i = e.index;
					if(i == -1 || i == 0) {
						if(errorFn) {
							errorFn();
						}
						return false;
					}
					if(i != 3) {
						params.shareOutFlag = "2";//分享标识：1-工作圈；2-微信
						plus.share.getServices(function(s) {
							shares = {};
							for(var j in s) {
								var t = s[j];
								shares[t.id] = t;
							}
							_App.share.shareToWinx(params,ids[i - 1].id, ids[i - 1].ex,fn,errorFn);
						}, function(e) {
//							alert("获取分享服务列表失败：" + e.message);
							console.log("获取分享服务列表失败：" + e.message);
						});
						if(plus.os.name == "Android") {
							Intent = plus.android.importClass("android.content.Intent");
							File = plus.android.importClass("java.io.File");
							Uri = plus.android.importClass("android.net.Uri");
							main = plus.android.runtimeMainActivity();
						}
					} else {
						params.shareOutFlag = "1";//分享标识：1-工作圈；2-微信
						if(params.shareUrl && params.shareUrl != "undefined"){//图片分享，需要先上传
							params.shareInfoType = "1";//分享信息类型：1-图片；2-base64（echarts）；3-文本（包括地址类信息）
							_App.share.doUploadPic(params.shareUrl, params, fn, errorFn);
						}else{
							params.shareInfoType = "3";//分享信息类型：1-图片；2-base64（echarts）；3-文本（包括地址类信息）
							//数据保存
							_App.share.doShare(params, fn, errorFn)
						}
					}
				}
			);
		},
		shareToWinx: function(params,id, ex,fn, errorFn) {
			var s = null;
			console.log("分享操作：");
			if(!id || !(s = shares[id])) {
				console.log("无效的分享服务！");
				if(errorFn) {
					errorFn();
				}
				return;
			}
			if(s.authenticated) {
				console.log("---已授权---");
				_App.share.shareMessage(params,s, ex,fn, errorFn);
			} else {
				console.log("---未授权---");
				s.authorize(function() {
					_App.share.shareMessage(params,s, ex,fn, errorFn);
				}, function(e) {
					console.log("认证授权失败：" + e.code + " - " + e.message);
					if(errorFn) {
						errorFn();
					}
				});
			}
		},
		shareMessage: function(params,s, ex,fn,errorFn) {
			var msg = {
				extra: {
					scene: ex
				}
			};
			//内容，文本
			if(params.shareContent && params.shareContent != "undefined")
				msg.content = params.shareContent;
			//链接地址
			if(params.shareLinkAddr && params.shareLinkAddr != "undefined"){
				msg.href = params.shareLinkAddr;
			}
			//图片
			if(params.shareUrl && params.shareUrl != "undefined"){
				msg.pictures = [params.shareUrl]
			}/*之前为msg.sharePic，无法实现跳转到微信app，导致分享报错无法获取到图片url，所以将sharePIC改成了pictures*/
			console.log(JSON.stringify(msg));
			s.send(msg, function() {
				console.log("分享到\"" + s.description + "\"成功！ ");
				//数据保存
				_App.share.doShare(params, fn, errorFn)
			}, function(e) {
				console.log("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
				if(errorFn) {
					errorFn();
				}
			});
		}
	};
	_App.share = _Share;
	console.log('_Share init finished!');
}(mui))