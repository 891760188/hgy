/*
create date：2015-09-29 17:09
created by：Yusys-Ued-WY
file name：ui.js
remark：ui组件/逻辑控制
last update：2015-09-29 17:09
*/
(function($){
	YSUI=function(){};
	YSUI.Accordion=function(id){
		mui('#'+id).on('tap','.ys-accNode',function(){
			if(this.classList.contains("ys-accnOpen")){
				if(this.nextElementSibling.classList.contains('ys-accContent')){
					this.classList.remove('ys-accnOpen');
				}
			}
			else{
				if(this.nextElementSibling && this.nextElementSibling.classList){
					this.classList.add('ys-accnOpen');
				}
			}
		});
	};
	YSUI.SuperBt=function(){
		document.querySelector("#superBt").addEventListener('tap', function() {
			if(this.classList.contains("active")){
				this.classList.remove('active');
			}
			else{
				this.classList.add('active');
			}
		});		
		mui('#superMenu').on('tap','a',function(){
		 	eval(this.getAttribute('data-fn'));
			document.querySelector("#superBt").classList.remove('active');
		});
	};
	
	/*标签组件调用
	 * YSUI.CircleTag(id,data)
	 * id:渲染标签的容器id
	 * data:标签数据。text,显示的文字，建议控制在4个字符内；bc，背景颜色样式，css已提供bc1至bc7供选择。
	 * 圆圈上最多显示前12个标签，前一半的标签显示在外圈，后一半标签显示在内圈，多余标签将以列表方式呈现，
	 * 数据格式如:var data={data:[{text:'成家立业',bc:'bc3'},{text:'三口之家',bc:'bc3'}]}。
	*/
	YSUI.CircleTag=function(id,tagData){
		var _o=document.getElementById(id);
		var _n=tagData.data.length;
		var _m=12;
		if(_n>12){
			_m=_n;
			_n=12;
		}
		var _d=document.createElement('div');
		var _p='<div class="ct-pic"><div class="icon-user"></div></div>';
		var _s='';
		var _coordinate=new Array('27.5%-20%','72.5%-80%','72.5%-20%','87.5%-50%','12.5%-50%','27.5%-80%',
		'27.5%-39%','50%-75%','50%-26%','27.5%-61.5%','71.5%-39%','71.5%-61.5%');
		for(var i=0;i<_n;i++){
			var _txt,_bc,_t,_l,_k;
			_txt=tagData.data[i].text.replace(/(.{2})(.*)/, "$1<br />$2");		
			_bc=tagData.data[i].bc;
			_k=i;
			if(i>=parseInt(_n/2)){
				_bc+=' sma';
				_k=i+6-parseInt(_n/2);
			}
			_l=_coordinate[_k].split('-')[0];
			_t=_coordinate[_k].split('-')[1];
			_s+='<div class="ct-tag '+_bc+'" style="left: '+_l+';top:'+_t+';">'+_txt+'</div>';
		}
		_s+='<div class="ct-dot a"></div><div class="ct-dot b"></div><div class="ct-dot c"></div><div class="ct-dot d"></div><div class="ct-dot e"></div>'
		_d.className='ct-tags';
		_d.innerHTML=_s;
		if(_o.getAttribute('centerImgUrl')&&_o.getAttribute('centerImgUrl').length>0){
			_p='<div class="ct-pic"><img src="'+_o.getAttribute('centerImgUrl')+'"/></div>';
		}
		_o.innerHTML='<div class="ct-cir"></div><div class="ct-cir"></div><div class="ct-cir"></div>'+_p;
		_o.appendChild(_d);
		if(_m>12){
			var _dd=document.createElement('div');
			_dd.className='moreTags';
			var _ss='<h1>更多标签</h1>';	
			for(var j=12;j<_m;j++){
				_ss+='<div class="'+tagData.data[j].bc.replace('bc','c')+'">'+tagData.data[j].text+'</div>';
			}						
			_dd.innerHTML=_ss;
			_o.parentElement.appendChild(_dd);
		}
	};
})();
