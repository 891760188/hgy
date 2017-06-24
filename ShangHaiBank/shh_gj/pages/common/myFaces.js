/*!
 * yangheng
 *  表情插件
 */
var inited=false;//是否初始化
var wheShow = -1;//是否显示,偶数显示，奇数不显示
(function($) {
	var MFace = {
		openFace: function(params) {
			var defaultParam = {
				id: 'facebox',//装载表情div
				popover:'popover',//mui popover
				path: '../../resource/emotion/', //路径
				assign: 'content', //装载表情div
				tip: 'em_'
			};
			var config = mui.extend(true, defaultParam, params || {});
			var id = config.id;
			var path = config.path;
			var tip = config.tip;
			var popover = config.popover;
			var emoButton=config.emoButtonClass;
			//表情按钮
			document.querySelector(emoButton).addEventListener('tap',function(e) {
				var emoDiv = document.getElementById(id);
				var strFace, labFace;
				strFace = '';
				if(!inited){
					//如果没有初始化
					for(var i = 1; i <= 75; i++) {
					labFace = '[' + tip + i + ']';
					strFace += '<div><img src="'+path+i+'.gif" class="emotionImg" data-id='+i+' /></div>';
					}
					document.getElementById(id).innerHTML=strFace;
					document.getElementById(id).style.display="block";
					document.getElementById(popover).style.bottom="200px";
					//监听
					mui('.emotions').on('tap','.emotionImg',function(){
						var src = this.getAttribute('src');
						var content = document.getElementById('commContent');
						var _Value = content.innerHTML;
						content.innerHTML=_Value+'<img src="'+src+'" class="icon" />';
					    if (window.getSelection) {//ie11 10 9 ff safari
					        content.focus(); //解决ff不获取焦点无法定位问题
					        var range = window.getSelection();//创建range
					        range.selectAllChildren(content);//range 选择obj下所有子内容
					        range.collapseToEnd();//光标移至最后
					    }
					    else if (document.selection) {//ie10 9 8 7 6 5
					        var range = document.selection.createRange();//创建选择对象
					        range.moveToElementText(content);//range定位到obj
					        range.collapse(false);//光标移至最后
					        range.select();
					    }
					});
					inited=true;//
				}
				wheShow++;
				wheShow=wheShow%2
				if(wheShow==0){
//					如果为偶数,显示
					document.getElementById(id).style.display="block";
					document.getElementById(popover).style.bottom="200px";
				}else{
//					如果为奇数,显示
					document.getElementById(id).style.display="none";
					document.getElementById(popover).style.bottom="0px";
				}
			});
		}

	}
	_App.mFace = MFace;
	console.log('MFace init finished!');
}(mui))