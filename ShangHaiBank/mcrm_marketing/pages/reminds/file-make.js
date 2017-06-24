
var daiBan = function(approveContent){
	var key = document.getElementById("id1").value;
	if(key != ""&&key != null&&typeof(key) != 'undefined'){
		approveContent = key;
	}
	_App.ajax({
    	type : "get",
    	url :basePath + 'approveAction!search.json?approveContent='+approveContent,
//		data:{},
   		cache: false,
// 		async: false,
   		dataType: "json",
   		success : function(response){
   			var data = response.searchInfo1.data;
   			var length = data.length;
   			if(length > 0){
   			for(var i = 0;i < length;i++){
   				var table = document.getElementById('ulId');
   				var APPROVE_CONTENT = data[i].APPROVE_CONTENT;//申请内容
   			    var PROPOSE_TIME = data[i].PROPOSE_TIME;//申请发起时
   			    var PROPOSER = data[i].PROPOSER;//申请人
   			    var APPROVE_ID = data[i].APPROVE_ID;//审批id
   			    var Bid = data[i].ID;//OCRM_F_CI_APPROVE_LINK表的主键id
   				var ul = document.createElement('ul');
   				ul.innerHTML = '<div class="mui-table-view-cell-bt" style="text-align: left;background-color: gray;"></div>'
   				              +'<ul class="mui-table-view mui-table-view-group">'
   				              +'<li class="mui-table-view-cell" data-idd="' + APPROVE_ID + '" >'
   				              +'<a class="mui-navigate-right d" data-idd="'+APPROVE_ID+'">'
   				              +'<b class="tagTips icon-star-empty c4 bdc4" id="planDoTip2">关联事件</b>'+APPROVE_CONTENT
   				              +'<p>申请人：'+PROPOSER+'</p>'
   				              +'<p id="planDoName">申请时间：'+PROPOSE_TIME+'</p>'
   				              +'<div class="idxStepBox">'
   				              +'<div class="idxStep idxsOk">'
   				              +'<div class="idxsQ">1</div>'
   				              +'<div class="idxsT">客户经理提交</div>'
   				              +'</div>'
   				              +'<div class="idxStep idxsNow">'
   				              +'<div class="idxsQ">2</div>'
   				              +'<div class="idxsT">支行长审批</div>'
   				              +'</div>'
   				              +'<div class="idxStep">'
   				              +'<div class="idxsQ">3</div>'
   				              +'<div class="idxsT">分行主管审批</div>'
   				              +'</div>'
   				              +'</div>'
   				              +'</a>'
   				              +'<div id="planDo2" class="mui-table-view-cell-bt">'
   				              +'<button class="mui-table-btn-flag a" id="button1" data-idd="'+APPROVE_ID+'">代签收</button>'
   				              +'<button class="mui-table-btn-flag b" id="button2" data-idd="'+APPROVE_ID+'">正常办理</button>'
   				              +'<button class="mui-table-btn-flag c" id="button3" data-idd="'+APPROVE_ID+'">打回</button>'
   				              +'</div>'
   				              +'</li>'
   				              +'</ul>';
   				              table.appendChild(ul);
   			}
   			mui('#ulId').on('tap', '.a', function() {//代签收按钮触发
			var id = this.getAttribute('data-idd');
			if (undefined != id && "" != id) {
				var currWebId = plus.webview.currentWebview().id;
				currWebId = encodeURIComponent(currWebId);
				_App.util.goPage('approveReply.html?id=' + id + '&pageId=' + currWebId + '&Bid=' + Bid, {
					refresh: true,
					pageId: 'reply_html1'
				});
			}
		});
		mui('#ulId').on('tap','.b',function(){//正常办理按钮触发
			var id = this.getAttribute('data-idd');
			if (undefined != id && "" != id) {
				var currWebId = plus.webview.currentWebview().id;
				currWebId = encodeURIComponent(currWebId);
				_App.util.goPage('approveReply.html?id=' + id + '&pageId=' + currWebId + '&Bid=' + Bid, {
					refresh: true,
					pageId: 'reply_html2'
				});
			}
		});
		mui('#ulId').on('tap','.c',function(){//打回按钮触发
			var id = this.getAttribute('data-idd');
			if (undefined != id && "" != id) {
				
				var currWebId = plus.webview.currentWebview().id;
				currWebId = encodeURIComponent(currWebId);
				_App.util.goPage('approveReply.html?id=' + id + '&pageId=' + currWebId + '&Bid=' + Bid, {
					refresh: true,
					pageId: 'reply_html3'
				});
			}
		});
		mui('#ulId').on('tap','.d',function(){
			var id = this.getAttribute('data-idd');
			_App.util.goPage('approveDetail.html?id=' + id);
		})
// 			mui.alert("签到成功!");
   			}else{
   				mui.toast("当前没有待办审批");
   			}
   			
		},
   		error:function(a,b,c){
   			mui.toast("签到失败");
   		}
   	});
}

var yiBan = function(approveContent){
	var key = document.getElementById("id3").value;
	if(key != ""&&key != null&&typeof(key) != 'undefined'){
		approveContent = key;
	}
	_App.ajax({
    	type : "get",
    	url :basePath + 'approveAction!searchYiban.json?approveContent='+approveContent,
    	async:false,
//		data:{},
   		cache: false,
// 		async: false,
   		dataType: "json",
   		success : function(response){
// 			console.log(JSON.stringify(response));
   			var data = response.searchInfo2.data;
   			var length = data.length;
   			if(length > 0){
	   			for(var i = 0;i < length;i++){
	   				var table = document.getElementById('olId');
	   				var APPROVE_CONTENT = data[i].APPROVE_CONTENT;//申请内容
	   			    var PROPOSE_TIME = data[i].PROPOSE_TIME;//申请发起时间
	   			    var PROPOSER = data[i].PROPOSER;//申请人
	   			    var APPROVE_ID = data[i].APPROVE_ID;//审批id
	   			    var Bid = data[i].ID;//OCRM_F_CI_APPROVE_LINK表的主键id
	   			    var APPROVE_STATUS = lookUp(data[i].APPROVE_STATUS);//审批状态
	   			    var IS_ATTENTION = data[i].IS_ATTENTION;
	   				var ol = document.createElement('ul');
	   				ol.innerHTML = '<div class="mui-table-view-cell-bt" style="text-align: left;background-color: gray;"></div>'
								    +'<ul class="mui-table-view mui-table-view-group">'
								    +'<ul class="mui-table-view mui-table-view-group">'
									+'<li class="mui-table-view-cell">'
									+'<a class="mui-navigate-right">'
									+'<b class="tagTips icon-star-half c2 bdc2" id="saleDoTip">关联事件</b>'+APPROVE_CONTENT+''
									+'<p>申请人：'+PROPOSER+'</p>'
									+'<p id="planDoName">申请时间：'+PROPOSE_TIME+'</p>'
									+'<div class="idxStepBox">'
									+'<div class="idxStep idxsOk">'
									+'<div class="idxsQ">1</div>'
									+'<div class="idxsT">客户经理提交</div>'
								    +'</div>'
									+'<div class="idxStep idxsS">'
									+'<div class="idxsQ">2</div>'
									+'<div class="idxsT">支行长审批</div>'
								    +'</div>'
									+'<div class="idxStep">'
									+'<div class="idxsQ">3</div>'
									+'<div class="idxsT">分行主管审批</div>'
									+'</div></div>'
									+'</a>'
                                    +'<p>'
									+'<div id="saleDo" class="mui-table-view-cell-bt">'
									+'<p><button class="mui-pull-left" id="attention" data-idd="'+Bid+'">'+IS_ATTENTION+'</button></p>'
									+'<p><div style="margin-top: 2px;">'+APPROVE_STATUS+'</div></p>'
									+'</div>'
									+'</p></li></ul>';
	   				table.appendChild(ol);
	   			}
// 			mui.alert("签到成功!");
		
   			}else{
   				mui.alert("当前没有已办审批！");
   			}
   			mui('.mui-table-view-cell-bt').on('tap', '.mui-pull-left', function() {
			if (this.innerHTML == "关注") {
//				mui.toast("已关注");
				this.innerHTML = "已关注";
			} else {
//				mui.toast("取消关注");
				this.innerHTML = "关注";
			}
			var isAttention =document.getElementById("attention").innerText;
			var Bid = this.getAttribute('data-idd');
			_App.ajax({
    	        type : "get",
    	        url :basePath + 'approveAction!addAttention.json?isAttention='+isAttention+'&Bid='+Bid,
//		        data:{},
   		        cache: false,
// 		        dataType: "",
   		        success : function(response){
   			        mui.toast(this.innerHTML);
		        },
   		        error:function(){
   			        mui.toast('操作失败！');
   		        }
   	        });
		});
   			},
   		error:function(a,b,c){
   			mui.alert("加载失败");
   		}
   	});
}

var lookUp = function(a){
	//0:代签收，1:正常办理，2:打回，3未审批)
	if(a == 0){
		return "代签收";
	}else if(a == 1){
		return "正常办理"
	}else if(a == 2){
		return "打回";
	}else{
		return "未审批";
	}
	
}

var searchTask = function(){//待办审批搜索功能
	var view = document.getElementById('ulId');
	view.innerHTML='';
	var key = document.getElementById("id1").value;
	mui('#ulId').off('tap', '.a');
	mui('#ulId').off('tap', '.b');
	mui('#ulId').off('tap', '.c');
	mui('#ulId').off('tap', '.d');
	daiBan(key);
}

var searchTask1 = function(){//已办审批搜索功能
	mui('.mui-table-view-cell-bt').off('tap', '.mui-pull-left');
	var view = document.getElementById('olId');
	view.innerHTML='';
	var key = document.getElementById("id3").value;
	yiBan(key);
}
