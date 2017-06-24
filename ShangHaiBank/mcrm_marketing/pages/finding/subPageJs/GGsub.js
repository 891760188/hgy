var GgConfig = { //公告配置
	url: basePath + 'ocrmShareAction!getShareByType.json?bizType=GG', //查询URL
	pageSize: 6, //分页大小  
	async: false,
	scrollerId: 'item11mobile', //mui滚动区域div的ID 
	getCondition: function() { //获取查询条件方法
		//searchContent();//查询条件
	},
	success: function(response) {
		if(response.json.data.length > 0) {
			var data = response.json.data;
			var user_id = plus.storage.getItem('_userId');
			var _photoUrl = plus.storage.getItem("_photoUrl_");
			var _div = document.getElementById('ulId11');
			var shareIdArray = new Array;
			var bizTypeArray = new Array;
			shareIdList = '';
			for(var i = 0; i < data.length; i++) {
				var tmp = data[i];
				shareIdArray.push(tmp.SHARE_ID);
				bizTypeArray.push(tmp.BIZ_TYPE);
			}
			getsup(shareIdArray, bizTypeArray);

			for(var i = 0; i < data.length; i++) {
				shareIdList += data[i].SHARE_ID + ',';
				var disp;
				var bizCont = '';
				var tmp = data[i];
				if(tmp.BIZ_CONTENT.length > '160') {
					bizCont = tmp.BIZ_CONTENT.substring(0, 160) + '......';
					disp = "block";
				} else {
					bizCont = tmp.BIZ_CONTENT;
					disp = "none";
				}
				var _html = "";
				var li = document.createElement('li');
				li.className = 'liClass mui-table-view-cell find-table-view-cell toolHover';
				var is_sup = 0; //是否点赞  0----没有点赞 ，1-----点赞
				var is_focus = 0;
				var bizType = tmp.BIZ_TYPE;
				var nIcon = "icon-line-133";
				var _z = ''; //赞html
				var _zIcon = "icon-line-131";
				if(judgeMore[i] == '0') {
					var judgeMoreCont = 'style="display: none;"';
				} else if(judgeMore[i == '1']) {
					var judgeMoreCont = 'style="display: block;"';
				}
				if(tmp.SUP_ID) {
					//已经点赞了
					supClass = 'icon-like sup_state_1';
					_z = '';
					_zIcon = "icon-line-132 iconBlue";
					is_sup = 1;
				}
				if(_photoUrl == "tou1.png") {
					_photoUrl = "../homePage/tou1.png";
				}
				var deleteStyle;
				if(tmp.SHARE_NAME == plus.storage.getItem('_userName')) {
					deleteStyle = 'block';
				} else {
					deleteStyle = 'none';
				}
				var moreCont;
				var moreContIcon;
				if(supName[i].length == 0) {
					moreCont = 'none';
					moreContIcon = 'none';
				} else {
					moreCont = 'block';
					moreContIcon = 'block';
				}
				if(supName[i].split('、').length < 10) {
					moreCont = 'none';
				}
				_html += '<div class="mui-table-view-cell-top">'
				_html += '<div class="mtvcLeft mtvcLeft1">'
				_html += '<span class="mlUserPic"><img src="photo1.png" style="width: 38px;" /></span>'
				_html += '<span class="mlUserInfo"><b>' + tmp.SHARE_NAME + '</b><i>' + tmp.SHARE_TIME + '</i></span>'
				_html += '</div>'
				_html += '</div>'
				_html += '<div class="mui-table-view-cell find-plan">'
				_html += '<p style="font-size: 20px;color: #333;line-height: 24px;">' + tmp.BIZ_NAME + '</p>'
				_html +='<p style="float: left;padding-right: 15px;">'+tmp.BIZ_PBER+'</p>';
				_html +='<p>'+tmp.BIZ_TIME+'</p>'
				_html += '<p id="GGCont_' + tmp.SHARE_ID + '" style="text-indent: 2em" class="contentInfo">' + bizCont + ''
				_html += '</p>'
				_html += '<div class="bottomBtn moreContent" data-fn="GGCont_' + tmp.SHARE_ID + '" GgCont="' + tmp.BIZ_CONTENT + '" GgSmallCont="' + bizCont + '" style="display:' + disp + ';">显示更多</div>'

				_html += '<div class="find-button find-bt">'
				_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')"  style="display:' + deleteStyle + '"></span>'
				_html += '<span class="icon-line-82" id="comm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\''+tmp.BIZ_TYPE+'\',' + tmp.SHARE_ID + ')"></span>';
				_html += '<span class="' + _zIcon + '" id="sup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '" shareName="' + tmp.SHARE_NAME + '" shareId="' + tmp.SHARE_ID + '" data-fn="doSupport(\'GG\',' + tmp.SHARE_ID + ')" sign="sup">' + _z + '</span>' //点赞
				_html += '</div>'
				_html += '</div>'
				_html += '<div class="mui-table-view-cell-bt">'
				_html += '<div class="supDiv">'
				_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>'
				_html += '<b id="supName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>'
				_html += '<b class="moreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>'
				_html += '</div>';
				_html += '</div>';
				_html += '<div id="lessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
				_html += '<div id="moreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
				_html += '</div><div id="bottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="moreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
				_html += '<div class="bottomBtn comPack" id="packUp_' + tmp.SHARE_ID + '" style="display:none">收起</div></div>';
				_html += '</div>';
				li.innerHTML = _html;
				_div.appendChild(li);
			}
			if(shareIdArray) {
				getComms(shareIdList,this);
			}
			loadListener(this);
			loadBottom(this);

		} else {
			loadPl(this);
		}
	},
	error: function() { //失败回调方法
		alert('error!');
	}
}