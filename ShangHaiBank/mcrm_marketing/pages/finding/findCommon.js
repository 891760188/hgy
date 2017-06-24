var _d;

/*
 * 查找评论信息
 */
function getComms(shareIds,that) {
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmShareAction!getComById.json',
		data: {
			shareIds: shareIds
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json;
			for(var i = 0; i < data.length; i++) {
				var d = data[i];
				var moreComFlag = false;
				
				if(d.length > 5) {
					moreComFlag = true; //还有数据需要加载
				}
				if(d.length > 0) {
					var id = d[0].BIZ_ID;
					var _html = "";
					
					if(moreComFlag) {
						for(var j = 0; j < d.length - 1; j++) {
							if(d[j].CREATE_USERID==userId){
								if(that.scrollerId!='item1mobile'){
									_d="<span id=commMSpan_"+d[j].COMM_ID+" data-id="+d[j].COMM_ID+">删除</span>";
								}else{
									_d="<span id=allCommMSpan_"+d[j].COMM_ID+" data-id="+d[j].COMM_ID+">删除</span>";
								}
							}else{
								_d="";
							}
							_html += "<div><b>" + d[j].USER_NAME + "</b>:<i>" + d[j].COMM_CONTENT +"</i>"+_d+"</div>";
							
						}
						if(that.scrollerId!='item1mobile'){
							document.getElementById('moreBtn_' + id).style.display = "block"; //显示更多按钮
						}else{
							document.getElementById('allMoreBtn_' + id).style.display = "block"; //显示更多按钮
						}

					} else {
						for(var j = 0; j < d.length; j++) {
							if(d[j].CREATE_USERID==userId){
								if(that.scrollerId!='item1mobile'){
									_d="<span id=commLSpan_"+d[j].COMM_ID+" data-id="+d[j].COMM_ID+">删除</span>"
								}else{
									_d="<span id=commMSpan_"+d[j].COMM_ID+" data-id="+d[j].COMM_ID+">删除</span>"
								}
							}else{
								_d="";
							}
							_html += "<div><b>" + d[j].USER_NAME + "</b>:<i>" + d[j].COMM_CONTENT +"</i>"+_d+"</div>";
						}
						if(that.scrollerId!='item1mobile'){
								document.getElementById('moreBtn_' + id).style.display = "none"; //显示更多按钮
							}else{
								document.getElementById('allMoreBtn_' + id).style.display = "none"; //显示更多按钮
							}
					}
					
					var comDiv = document.getElementById('allLessCom_'+id);
					if(comDiv) {
						comDiv.innerHTML = _html;
					}
					comDiv  = document.getElementById('lessCom_'+id);
					if(comDiv) {
						comDiv.innerHTML = _html;
					}
				}
			}

		},
		error: function() {
			mui.alert('加载失败！');
		}
	});
}
/*
 * 分页展示更多评论数据,点击评论下方的展示更多后调用
 */
function pageComments(shareId, nowPage,that,self) {
	var lessCom = self.parentNode.parentNode.querySelectorAll('.comDiv')[0];
	var moreCom = self.parentNode.parentNode.querySelectorAll('.comDiv')[1];
	_App.ajax({
		type: "get",
		url: basePath + 'ocrmShareAction!pageComments.json',
		data: {
			shareId: shareId
		},
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.json.data;
			var _html = "";
			for(var i = 0; i < data.length; i++) {
				if(data[i].CREATE_USERID==userId){
					if(that.scrollerId!='item1mobile'){
						_d="<span id=commMSpan_"+data[i].COMM_ID+" data-id="+data[i].COMM_ID+">删除</span>"
					}else{
						_d="<span id=allcCommMSpan_"+data[i].COMM_ID+" data-id="+data[i].COMM_ID+">删除</span>"
					}
				}else{
					_d="";
				}
				_html += "<div><b>" + data[i].USER_NAME + "</b>:<i>" + data[i].COMM_CONTENT +"</i>"+ _d+"</div>";
			}
			//按钮切换
			self.style.display='none';
			self.parentNode.lastChild.style.display='block';
			moreCom.innerHTML = _html;
			//div切换
			moreCom.style.display='block';
			lessCom.style.display='none';
		},
		error: function() {
			mui.alert('加载失败！');
		}
	});
}

var getsup = function(shareIdArray, bizTypeArray, row) { //获取日志的点赞人名称
	if(row == undefined) {
		row = '1';
	}
	supName = new Array;
	judgeMore = new Array;
	_App.ajax({
		type: "GET",
		url: basePath + 'ocrmShareAction!getSup.json?bizId=' + shareIdArray + '&bizType=' + bizTypeArray + '&row=' + row,
		cache: false,
		dataType: "json",
		success: function(response) {
			var data = response.searchSup;
			var judgeIfMore = response.judgeIfMore;
			var name = '';
			for(var a = 0; a < judgeIfMore.length; a++) {
				judgeMore.push(judgeIfMore[a]);
			}
			for(var a = 0; a < data.length; a++) { //对每一个分享的点赞人名称数据做整合
				for(var b = 0; b < data[a].length; b++) {
					if(data[a][b] != null) {
						name += data[a][b] + '、';
					}
				}   
				name = name.substring(0, name.length - 1);
				supName.push(name);
				name = '';
			}
		},
		error: function() {
			mui.toast('获取点赞人失败');
		}
	});
}

var supNameDelete = function(recId, bizType,element) { 
	if(!element){
			console.log('图标不存在');
			return ;
		}
	var _b = element.parentElement.parentElement.parentElement.querySelector('.supDiv').querySelector('b');
	var id = 'supName_' + recId; //获取点赞人名称的b标签id
//	var content = document.getElementById(id).innerHTML;
	var content = _b.innerHTML;
	var shareName = plus.storage.getItem('_userName');
	if(content.indexOf(shareName + '、') != '-1') {
		_b.innerHTML = content.replace(shareName + '、', '');
	} else if(content.indexOf('、' + shareName) != '-1') {
		_b.innerHTML = content.replace('、' + shareName, '');
	} else {
		var supDiv = _b.parentNode.childNodes[0].style.display = 'none';
		var supDiv = _b.parentNode.childNodes[2].style.display = 'none';
		_b.innerHTML = content.replace(shareName, '');
	}
}

var supNameAdd = function(recId, bizType,element) { 
		if(!element){
			console.log('图标不存在');
			return ;
		}
		var _b = element.parentElement.parentElement.parentElement.querySelector('.supDiv').querySelector('b');
		var id = 'supName_' + recId; //获取点赞人名称的b标签id
//		var content = document.getElementById(id).innerHTML;
		var content = _b.innerHTML;
		var shareName = plus.storage.getItem('_userName');
		var supDiv = _b.parentNode.childNodes[0].style.display = 'block';
		if(content == '') {
			_b.innerHTML = content + shareName;
		} else {
			_b.innerHTML = content + '、' + shareName;
		}
	}
	//删除分享
function delShare(shareId) {
	var ws = plus.nativeUI.showWaiting();
	_App.ajax({
		type: "GET",
		url: basePath + 'ocrmShareAction!delShareGG.json?shareId=' + shareId,
		cache: false,
		//		data: shareId,
		dataType: "json",
		success: function(response) {
			ws.close();
			mui.toast('删除成功');
			var id = 'allSupName_' + shareId; 
			document.getElementById(id).parentNode.parentNode.parentNode.style.display = 'none';
			var _t = document.getElementById('supName_' + shareId);
			if(_t){
				_t.parentNode.parentNode.parentNode.style.display = 'none';
			}
		},
		error: function() {
			ws.close();
			mui.toast('删除失败');
		}
	})
}
/**
 * 没有数据时调用
 */
function loadPl(that) {
	var pl = mui("#" + that.scrollerId)[0].querySelector('.mui-pull-loading');
	if(pl) {
		pl.innerText = "没有数据！"
	}
}

window.addEventListener('finishShareEvent__', function(e) {
	var params = e.detail.params;
	var bty = params.bizType;
	var indexNum = loadDataArray.indexOf(bty);
	if(indexNum>-1){
		loadDataArray.splice(indexNum,indexNum+1);
		console.log('删除其他');
	}
	indexNum = loadDataArray.indexOf('#item1mobile');
	if(indexNum>-1){
		console.log('删除全部');
		loadDataArray.splice(indexNum,indexNum+1);
	}
	
});

window.addEventListener('WORK_CICLE_CLICK', function() {
	var flag = loadDataArray.indexOf("#item1mobile");
	if(flag<0){
		plus.nativeUI.showWaiting();
		_App.pullToRefreshFactory.scrollers[0].loadData(true);
		loadDataArray.push("#item1mobile");
		plus.nativeUI.closeWaiting();
	}
});

function loadListener(that) {
	var lid = '#' + that.scrollerId;
	mui(lid + ' .find-button').off('tap', 'span');
	//底部，评论、赞、关注点击事件监听
	mui(lid + '  .find-button').on('tap', 'span', function() {
		var fn = this.getAttribute('data-fn');
		eval(fn);
	})
	mui(lid).off('tap', '.moreBtn');
	//点击评论下的更多,显示更多
	mui(lid).on('tap', '.moreBtn', function() {
		var shareId = this.getAttribute('id').replace(/[^0-9]/ig, '');
		var nowPage = this.getAttribute("comCount");
		pageComments(shareId, nowPage,that,this);
	});
	//监听评论收起
	mui(lid).off('tap', '.comPack');
	mui(lid).on('tap', '.comPack', function() {
		var self = this;
		var lessCom = self.parentNode.parentNode.querySelectorAll('.comDiv')[0];
		var moreCom = self.parentNode.parentNode.querySelectorAll('.comDiv')[1];
		lessCom.style.display='block';
		moreCom.style.display='none';
		self.style.display='none';
		self.parentNode.querySelector('.moreBtn').style.display='block';
	});
	
	mui(lid).off('tap','.moreContent');
	//内容收起
	mui(lid).on('tap', '.moreContent', function() {
		var GGContId = this.getAttribute('data-fn');
		if(this.innerHTML == '显示更多') {
			var GgCont = this.getAttribute('GgCont');
			this.parentElement.querySelector('.contentInfo').innerHTML = GgCont;
			this.innerHTML = '收起';
		} else {
			var GgSmallCont = this.getAttribute('GgSmallCont');
			this.parentElement.querySelector('.contentInfo').innerHTML = GgSmallCont;
			this.innerHTML = '显示更多';
		}
	})
	//分享链接
	mui(lid).off('tap', '.fxlj');
	mui(lid).on('tap', '.fxlj', function() {
		var url = this.childNodes[0].getAttribute('data-url');
		_App.util.goPage(url, {
			refresh: true
		});
	});
	mui(lid).off('tap','.comDiv span');
	mui(lid).on('tap','.comDiv span',function(){
		var commId = this.getAttribute('data-id');
		deleteComment(commId,that);
		
	})
};
//删除评论
function deleteComment(commId,that){
	
	_App.ajax({
		type: "GET",
		url: basePath + 'ocrmShareAction!deleteCom.json?commId=' + commId,
		cache: false,
		//		data: shareId,
		dataType: "json",
		success: function(response) {
			var href = that.scrollerId
			var id = href.replace(/[^0-9]/ig, "");
				id = id - 1;
			_App.pullToRefreshFactory.scrollers[id].loadData(true);
			_App.pullToRefreshFactory.scrollers[0].loadData(true);
			//子页签
//			var commSpan = document.getElementById('commLSpan_'+commId);
//			if(commSpan){
//				commSpan.parentNode.parentNode.removeChild(commSpan.parentNode);
//			}
//			commSpan = document.getElementById('commMSpan_'+commId);
//			if(commSpan){
//				commSpan.parentNode.parentNode.removeChild(commSpan.parentNode);
//			}
//			
//			//全部页签
//			commSpan = document.getElementById('allCommMSpan_'+commId);
//			if(commSpan){
//				commSpan.parentNode.parentNode.removeChild(commSpan.parentNode);
//			}
//			
//			commSpan = document.getElementById('allCommMSpan_'+commId);
//			if(commSpan){
//				commSpan.parentNode.parentNode.removeChild(commSpan.parentNode);
//			}
			
			mui.toast('删除成功！');
		},
		error: function() {
			mui.toast('删除失败');
		}
	})

}

function loadBottom(that) {
	mui("#"+that.scrollerId).off('tap', '.bottomDiv .bottomBtn');
//	mui("#"+that.scrollerId).on('tap', '.bottomDiv .bottomBtn', function() {
//		alert('2')
//		var load = this.parentNode.getAttribute('loaded');
//		var lessDiv = document.getElementById(that.scrollerId).querySelectorAll('.comDiv')[0];//lessDiv
//		var moreDiv = document.getElementById(that.scrollerId).querySelectorAll('.comDiv')[1];//moreDiv
//		
//		var moreBtn = document.getElementById(that.scrollerId).querySelector('.bottomDiv').querySelectorAll('div')[0];
//		var pupBtn = document.getElementById(that.scrollerId).querySelector('.bottomDiv').querySelectorAll('div')[1];
//		var ff = this.classList.contains('moreBtn');
//		if(ff) {
//			//点击的是显示更多
//			lessDiv.style.display = "none"; //隐藏默认评论div
//			moreDiv.style.display = "block"; //展示更多评论div
//
//			pupBtn.style.display = "block"; //显示收起
//			moreBtn.style.display = "none"; //隐藏更多
//		} else {
//			//点击收起
//			lessDiv.style.display = "block";
//			moreDiv.style.display = "none";
//
//			pupBtn.style.display = "none"; //隐藏收起按钮
//			moreBtn.style.display = "block"; //显示更多按钮
//		}
//	});
}
