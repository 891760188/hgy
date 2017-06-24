(function($) {
	var _Ant = {
		defaultParam: {},
		textToImg: function(txt) {
			var len = txt.length;
			var i = 0;
			var fontSize = 45;
			var fontWeight = 'normal';
			var canvas = document.getElementById('text');
			canvas.width = fontSize * len-10;
			canvas.height = fontSize * (3 / 2) *
				(Math.ceil(txt.length / len) + txt.split('\n').length - 1.15);
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = $("showcolor").innerHTML;
			context.font = fontWeight + ' ' + fontSize + 'px sans-serif';
			context.textBaseline = 'top';
			canvas.style.display = 'none';
			console.log(txt.length);

			function fillTxt(text) {
				while(text.length > len) {
					var txtLine = text.substring(0, len);
					text = text.substring(len);
					context.fillText(txtLine, 0, fontSize * (3 / 2) * i++,
						canvas.width);
				}
				context.fillText(text, 0, fontSize * (3 / 2) * i, canvas.width);
			}
			var txtArray = txt.split('\n');
			for(var j = 0; j < txtArray.length; j++) {
				fillTxt(txtArray[j]);
				context.fillText('\n', 0, fontSize * (3 / 2) * i++, canvas.width);
			}
			var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

			return canvas.toDataURL("image/png");
		},
		// 获得输入框键盘焦点
		msgTextFocus: function(obj) {
			obj.focus();
			setTimeout(function() {
				obj.focus();
			}, 150);
		},
		// 光标移动到最后
		msgTextLastPos: function(obj) {
			if(window.getSelection) { //ie11 10 9 ff safari
				obj.focus(); //解决ff不获取焦点无法定位问题
				var range = window.getSelection(); //创建range
				range.selectAllChildren(obj); //range 选择obj下所有子内容
				range.collapseToEnd(); //光标移至最后
			} else if(document.selection) { //ie10 9 8 7 6 5
				var range = document.selection.createRange(); //创建选择对象
				range.moveToElementText(obj); //range定位到obj
				range.collapse(false); //光标移至最后
				range.select();
			}
		},
		init: function(obj, pageViewId, url) {
				obj.addEventListener('keydown', function(evt) {
					var code = evt.keyCode;
					console.log(code);
					url = url + "=" + pageViewId;
					console.log('code:' + code); 
					if(code == "50") {
						_App.util.goPage(url, {
							pageId: 'colleagues-id',
							refresh: true
						});
					}
					window.addEventListener('chooseUserMesEvent__', function(event) {
//											alert('回调了');
						obj.innerHTML = obj.innerHTML.substring(0, obj.innerHTML.length - 1);
						if(plus.nativeUI.showWaiting()) {
							plus.nativeUI.closeWaiting();
						}
						var act = event.detail.act;
						var chooseUserNames =decodeURIComponent(event.detail.chooseUserNames);
						var chooseUserIds = event.detail.chooseUserIds;
						var type = event.detail.chooseType;
//						console.log(_Ant.textToImg(chooseUserNames));
						imgName="@"+chooseUserNames;
						var _html = '<img  class="icon" chooseType="'+type+'" chooseId="'+chooseUserIds+'" src="'+_Ant.textToImg(imgName)+'" chooseName="'+imgName+'" ></img>'
							//						console.log(origin);
						obj.innerHTML += _html ;
						// 光标移动到最后
						_App.ant.msgTextLastPos(obj);
						// 获得输入框键盘焦点
						_App.ant.msgTextFocus(obj);
					});
				})
			} // 获得输入框键盘焦点

	};
	_App.ant = _Ant;
	console.log('_Ant init finished!');

}(mui))