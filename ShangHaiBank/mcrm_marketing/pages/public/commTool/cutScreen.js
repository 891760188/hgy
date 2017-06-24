/*
 * 截图插件
 * 作者：杨恒
 * 时间：2017年1月13日16:55:22
 * 说明：截图是传入要截图dom的ID名称，要截图的div不要使用百分比，例如百分比定位，百分比大小。
 * 回调函数返回的截图的保存的地址+截图名称
 * 修改：增加一种截图方式，第一种是纯js截图，第二种是原生截图，js截图在css3某些样式不生效，例如translate属性
 */

var bitmap = null;
/*
 * 纯js截图
 */
function cutScreen(divId, callBack) {
	plus.nativeUI.showWaiting('请稍等...');
	var dom = document.getElementById(divId);
	var w = dom.offsetWidth;
	var h = dom.offsetHeight;
	var offTop = dom.offsetTop;
	var canvas = document.createElement("canvas"); //创建一个canvas节点
	var scale = 3; //清晰度，越大越清晰
	canvas.width = w * scale; //定义canvas 宽度 * 缩放
	var _h = _androidSUBHeight.replace(/[^0-9]/ig, '');
	canvas.height = (h + offTop + Number(_h)) * scale; //定义canvas高度 *缩放,需要加上自义的高度
	canvas.getContext("2d").scale(scale, scale); //获取context,设置scale 
	var opts = {
		allowTaint: true, //允许加载跨域的图片
		tainttest: true, //检测每张图片都已经加载完成
		scale: scale, // 添加的scale 参数
		canvas: canvas,
		width: w, //dom 原始宽度
		height: h //dom 原始高度
	};
	html2canvas(dom, opts).then(function(canvas) {
		var imgUrl = canvas.toDataURL("image/png");
		bitmap = new plus.nativeObj.Bitmap();
		bitmap.loadBase64Data(imgUrl);
		saveBitmap(callBack);

	});
}

function saveBitmap(callBack) {
	var timestamp = new Date().getTime();
	var imgName = "a.png";
	bitmap.save("_doc/" + imgName, {
		overwrite: true
	}, function(i) {
		console.log('保存图片成功：' + JSON.stringify(i));
		imgUrl =  i.target;
		callBack( imgUrl);
		plus.nativeUI.closeWaiting();
	}, function(e) {
		console.log('保存图片失败：' + JSON.stringify(e));
		plus.nativeUI.closeWaiting();
	});
}
/**
 * 原生截图
 */
function orienCutScreen(webId, options, callBack) {
	if(webId && options) {
		bitmap = new plus.nativeObj.Bitmap("test");
		var wb = plus.webview.getWebviewById(webId)
		wb.draw(bitmap, function() {
			saveBitmap(callBack);
			console.log('截屏绘制图片成功');
		}, function(e) {
			console.log('截屏绘制图片失败：' + JSON.stringify(e));
		}, {
			check: false, // 设置为检测白屏
			clip: {
				top: options.top,
				left: options.left,
				height: options.height,
				width: options.width
			}
		});
	} else {
		console.log('部分对象为空');
	}

}