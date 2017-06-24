var commonClick = false; //常用 初始化标志
var orgClick = false; //机构初始化标志
var indexClick = false; //索引初始化标志
var indexedObj, indexedElmtId;
var parentView = "" //表示从哪一个页面来的
var chooseUserNames = ","; //选中的用户名
var chooseUserIds = ","; //选中的用户ID
var dataFnType;
var backPage; //上一个界面的id
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);

}

function plusReady() {
	backPage = decodeURIComponent(_App.util.getUrlParamByName("pageVeiwId")); //返回的界面ID
	backPage = plus.webview.getWebviewById(backPage);
}
mui.ready(function() {
		dataFnType = _App.util.getUrlParamByName("dataFnType"); //事件类型
	})
	/**
	 * 加载机构列表
	 */
function getOrg() {
	if(orgClick) {
		//如果已经加载就不在此加载
		return;
	}
	_App.ajax({
		type: "GET",
		url: basePath + "mobileColleaguesAction!getOrg.json",
		cache: false,
		dataType: "json",
		success: function(res) {
			var d = res.json.data;
			var _html = '';
			for(var i = 0; i < d.length; i++) {
				var _b = '<b class="mui-icon icon-radio-unchecked phone-right orgSelect" data-fn="orgSelect(\'' + d[i].orgId + '\',\'' + d[i].name + '\')"></b>';
				_html += '<div class="ys-accNode"><span>' + d[i].name + '</span> ';
				if(dataFnType == "radio") {
					//如果前一个界面传过来的参数是需要选择，需要添加样式  （实际上机构只能是单选的）
					_html += _b;
				}
				_html += '</div><div class="ys-accContent" id="' + d[i].orgId + '"> </div>'
			}
			document.getElementById('colAcd').innerHTML = _html;
			//加载完机构之后，在加载机构里面的数据
			getOrgData();
		},
		error: function() {

		}
	});
};
/**
 * 加载机构数据
 */
function getOrgData() {
	if(!orgClick) {
		_App.ajax({
			type: 'get',
			url: basePath + "mobileColleaguesAction!getOrgDatas.json",
			cache: false,
			dataType: "json",
			success: function(res) {
				var data = res.json.data;

				for(var i = 0; i < data.length; i++) {
					var _html = '';
					var dataFun = "";
					var _span = '';
					if(dataFnType == "radio") {
						//如果是多选，以后应该还有单选 ，则不进入makeTalk 进入select事件
						dataFun = 'mulSelect("org_' + data[i].ID + '")'
							//把电话按钮改成  选择 ,添加id方便修改样式
						_span = '<span id="org_' + data[i].ID + '"  selectName="' + data[i].name + '" class="mui-icon icon-radio-unchecked phone-right" ></span>';
					} else {
						dataFun = 'makeTalk("' + data[i].makeTalk + '")';
						_span = '<span class="mui-icon mui-icon-phone" data-fn="makeTelephone(' + data[i].phone + ');"></span>'
					}

					_html = '<div class="ys-accNode"  data-fn=' + dataFun + '><div class="ys-anContent"><b>';
					_html += '<img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" /></b>' + data[i].name + '<i>' + data[i].position + '</i>';
					_html += _span;
					_html += '</div></div>';
					document.getElementById(data[i].orgId).innerHTML += _html;
					orgClick = true; //把机构数据标志置为true
				}

			},
			error: function() {

			}
		});
	}

}
/**
 * 加载常用数据
 */
function getCommon() {
	if(commonClick) {
		//如果已经点击了，那么就不在加载
		return;
	}
	_App.ajax({
		type: 'get',
		url: basePath + "mobileColleaguesAction!getCommonDatas.json",
		cache: false,
		dataType: 'json',
		success: function(res) {
			var data = res.json.data;
			var _html = '';
			_html = '<div class="ys-accContent">';
			for(var i = 0; i < data.length; i++) {
				var dataFun = "";
				var _span = '';
				if(dataFnType == "radio") {
					//如果是单选 ，则不进入makeTalk 进入select事件
					dataFun = 'mulSelect("com_' + data[i].ID + '")'
						//把电话按钮改成  选择 ,添加id方便修改样式
					_span = '<span id="com_' + data[i].ID + '"  selectName="' + data[i].name + '" class="mui-icon icon-radio-unchecked phone-right" ></span>';
				} else {
					dataFun = 'makeTalk("' + data[i].makeTalk + '")';
					_span = '<span class="mui-icon mui-icon-phone" data-fn="makeTelephone(' + data[i].phone + ');"></span>'
				}
				_html += '<div class="ys-accNode" data-fn=' + dataFun + '><div class="ys-anContent">';
				_html += '<b><img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" />';
				_html += '</b>' + data[i].name + '<i>' + data[i].position + '</i>';
				_html += _span;
				_html += '</div></div>';
			}
			_html += '<a href="tel:13800138000" id="telId"></a>';
			document.getElementById('commonId').innerHTML = _html;
			commonClick = true;
		},
		error: function() {

		}
	})
};
/**
 * 加载索引数据
 */
function getIndexDatas() {
	if(!indexClick) {
		//如果已经初始化，就不在加载数据
		_App.ajax({
			type: 'get',
			url: basePath + "mobileColleaguesAction!getIndexDatas.json",
			cache: false,
			dataType: 'json',
			success: function(res) {
//				console.log('请求index');
				var data = res.json.data;
				var _html = '<div class="mui-indexed-list-empty-alert">没有数据</div>';
				_html += '<ul class="mui-table-view">';
				for(var i = 0; i < data.length; i++) {
					var dataGroupV = '';
					if(data[i][0] != undefined || data[i][0] != "") {
						dataGroupV = data[i][0].group;
						//初始化数据的列表头   A、B、C、D...
					}
					//				data: {
					//					[[],[]],[]
					//				}
					var lists = data[i];
					if(lists.length > 0) {
						_html += '<li data-group="' + dataGroupV + '" class="mui-table-view-divider mui-indexed-list-group">' + dataGroupV + '</li>';
						for(var j = 0; j < lists.length; j++) { //数据循环
							var dataFun = "";
							var _span = '';
							if(dataFnType == "radio") {
								//如果是多选，以后应该还有单选 ，则不进入makeTalk 进入select事件
								dataFun = 'mulSelect("ind_' + lists[j].ID + '")'
									//把电话按钮改成  选择 ,添加id方便修改样式
								_span = '<span id="ind_' + lists[j].ID + '"  selectName="' + lists[j].name + '" class="mui-icon icon-radio-unchecked phone-right" ></span>';
							} else {
								dataFun = 'makeTalk("' + lists[j].makeTalk + '")';
								_span = '<span class="mui-icon mui-icon-phone phone-right"></span>'
							}
							_html += '<li data-value="' + lists[j].dataValue + '" data-fn=' + dataFun + ' data-tags="' + lists[j].tags + '" ';
							_html += 'class="mui-table-view-cell mui-indexed-list-item toolHover">' + lists[j].name + _span + '</li>'
						}
					}

				}
				////			document.getElementById('phoneCallUl').innerHTML = _html;
				////			console.log(document.getElementById('phoneCallUl').innerHTML);
				////			indexedObj.init(indexedElmtId);

				var list = document.getElementById('indexAbListId');
				list.innerHTML = _html;
				var _header = document.querySelector('header.mui-bar');
				var _h = (list.offsetHeight - _header.offsetHeight) + 'px';
				list.style.height = _h;
				indexedObj.init(indexedElmtId);

				//			
				indexClick = true; //把标志置为true
			},
			error: function() {

			}
		});
	}

}

function orgSearch(query) {
	_App.ajax({
		type: 'get',
		url: basePath + "mobileColleaguesAction!orgSearch.json",
		cache: false,
		data: {
			query: query
		},
		dataType: "json",
		success: function(res) {
			var data = res.json.data;

			for(var i = 0; i < data.length; i++) {
				var _html = '';
				_html = '<div class="ys-accNode"  data-fn="makeTalk("' + data[i].makeTalk + '");"><div class="ys-anContent"><b>';
				_html += '<img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" /></b>' + data[i].name + '<i>' + data[i].position + '</i>';
				_html += '<span class="mui-icon mui-icon-phone" data-fn="makeTelephone(' + data[i].phone + ');"></span></div></div>';
				document.getElementById('colAcd').innerHTML = _html; //直接搜索出来数据
			}

		},
		error: function() {

		}
	})
}

function commonSearch(query) {
	_App.ajax({
		type: 'get',
		url: basePath + "mobileColleaguesAction!commonSearch.json",
		cache: false,
		dataType: 'json',
		data: {
			query: query
		},
		success: function(res) {
			var data = res.json.data;
			var _html = '';
			_html = '<div class="ys-accContent">';
			for(var i = 0; i < data.length; i++) {

				_html += '<div class="ys-accNode"  data-fn="makeTalk("' + data[i].makeTalk + '");"><div class="ys-anContent">';
				_html += '<b><img src="../../../themes/default/images/temp/' + data[i].img + '" alt="" />';
				_html += '</b>' + data[i].name + '<i>' + data[i].position + '</i><span class="mui-icon mui-icon-phone" data-fn="makeTelephone(' + data[i].phone + ');">';
				_html += '</span></div></div>';
			}
			_html += '<a href="tel:13800138000" id="telId"></a>';
			document.getElementById('commonId').innerHTML = _html;
		},
		error: function() {

		}
	})
}
/**
 * 给机构搜索按钮加上监听事件
 */
document.getElementById('msiByOrg').querySelector('.mui-icon-search').addEventListener('tap', function() {
		var search = this.parentNode.children[0];
		console.log(search.value);
		orgSearch(search.value);

	})
	/**
	 * 给常用人搜索按钮加上监听事件
	 */
document.getElementById('msiOften').querySelector('.mui-icon-search').addEventListener('tap', function() {
	var search = this.parentNode.children[0];
	console.log(search.value);
	commonSearch(search.value);
})

/**
 * 多选数据，并返回（选择人员）  共用的 ，
 */
function mulSelect(id) {
	var obj = document.getElementById(id);
	var userName = obj.getAttribute('selectName');
	var userId = id.substring(4); //org_+   com_+   ind_+
	if(!backPage) {
		mui.alert("页面还未准备好，请稍后...");
		return false;
	}
	//触发详情页面的newsId事件
	mui.fire(backPage, 'chooseUserMesEvent__', {
		act: "refresh",
		chooseUserNames: encodeURIComponent(userName),
		chooseUserIds: userId,
		chooseType: "radio"
	});
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().close();

}
/**
 * 给机构 绑定点击事件（只是机构，不是机构下面的数据）
 */
mui('#colAcd').on('tap', '.orgSelect', function() {
	eval(this.getAttribute('data-fn'));
});
/**
 * 选择机构
 */
function orgSelect(id, orgName) {
	if(!backPage) {
		mui.alert("页面还未准备好，请稍后...");
		return false;
	}
	//触发详情页面的newsId事件
	mui.fire(backPage, 'chooseUserMesEvent__', {
		act: "refresh",
		chooseUserNames: encodeURIComponent(orgName),
		chooseUserIds: id,
		chooseType: "radio"
	});
	plus.nativeUI.closeWaiting();
	plus.webview.currentWebview().close();
}
//点击确定 返回@界面
function saveChoose() {
	if(chooseUserIds == ",") {
		var btn = ["确定", "取消"];
		mui.confirm('没有选择人员，确认关闭当前窗口？', '温馨提示', btn, function(e) {
			if(e.index == 0) {
				mui.back();
			}
		});
	} else { //返回选中值
		if(!backPage) {
			mui.alert("页面还未准备好，请稍后...");
			return false;
		}
		//触发详情页面的newsId事件
		mui.fire(backPage, 'chooseUserMesEvent__', {
			act: "refresh",
			chooseUserNames: encodeURIComponent(chooseUserNames),
			chooseUserIds: chooseUserIds
		});
		plus.webview.currentWebview().close();
	}
}
/**
 * 重写返回事件
 * 目前主要针对@功能的单选且不选择直接返回处理
 */
var oldback = mui.back;
mui.back = function() {
	if(dataFnType == "radio") {
		if(!backPage) {
			mui.alert("页面还未准备好，请稍后...");
			return false;
		}
		//触发详情页面的newsId事件
		mui.fire(backPage, 'chooseUserMesEvent__', {
			act: "refresh",
			chooseUserNames: "",
			chooseUserIds: "",
			chooseType: ""
		});
	}
	oldback();
}

function pageHeightInit() {
	//自适应高度
	var _header = document.querySelector('header.mui-bar');
	var _slider = document.querySelector('div.mui-slider-indicator');
	var _h = (document.body.offsetHeight - _header.offsetHeight - _slider.offsetHeight) + 'px';
	document.getElementById("msiByOrg").style.height = _h;
	document.getElementById("msiOften").style.height = _h;
	document.getElementById("item3mobile").style.height = _h;
}
//输入法监听
window.addEventListener("resize", function() {
	pageHeightInit();
});