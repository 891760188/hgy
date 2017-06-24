var xtyxConfig = {
	// item3mobile
	url: basePath + 'ocrmShareAction!getLinkShare.json?bizType=XTYX', //查询URL
	pageSize: 6, //分页大小
	scrollerId: 'item12mobile', //mui滚动区域div的ID 
	getCondition: function() { //获取查询条件方法
		//searchContent();//查询条件 
	},
	success: function(response) {
		if(response.json.data.length > 0) {
			var data = response.json.data;
			var user_id = plus.storage.getItem('_userId');
			var supClass = 'icon-like sup_state_0';
			var _div = document.getElementById('ulId12');
			shareIdList = '';
			var shareIdArray = new Array;
			var bizTypeArray = new Array;
			for(var i = 0; i < data.length; i++) {
				var tmp = data[i];
				shareIdArray.push(tmp.SHARE_ID);
				bizTypeArray.push(tmp.BIZ_TYPE);
			}
			getsup(shareIdArray, bizTypeArray);
			for(var i = 0; i < data.length; i++) {
				shareIdList += data[i].SHARE_ID + ',';
				var _html = "";
				var li = document.createElement('li');
				li.className = 'liClass mui-table-view-cell find-table-view-cell toolHover';
				var is_sup = 0; //是否点赞  0----没有点赞 ，1-----点赞
				var is_focus = 0;
				var tmp = data[i];
				var bizType = tmp.BIZ_TYPE;
				var _zIcon = "icon-line-131"; //赞icon

				if(judgeMore[i] == '0') {
					var judgeMoreCont = 'style="display: none;"';
				} else if(judgeMore[i == '1']) {
					var judgeMoreCont = 'style="display: block;"';
				}
				if(tmp.COMCOUNT) {
					_p = '评论(' + tmp.COMCOUNT + ')'
				}
				if(tmp.SUP_ID) {
					//已经点赞了
					supClass = 'icon-like sup_state_1';
					_z = '取消';
					_zIcon = "icon-line-132 iconBlue";
					is_sup = 1;
				}
				var deleteStyle;
				if(tmp.SHARE_NAME == plus.storage.getItem('_userName')) {
					deleteStyle = 'block';
				} else {
					deleteStyle = 'none';
				}
				var moreCont;
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
				var shareOrLj = '';
				if(tmp.SHARE_LINK_ADDR != '') { //判断分享的是链接还是图片
					shareOrLj = '<div class="comm_content fxlj"><a data-url="' + tmp.SHARE_LINK_ADDR + '">点击链接</a></div>';
				} else {
					shareOrLj = '<div><img data-src="' + tmp.SHARE_URL + '" src="photo1.png" onload="lazyLoad(this)" style="width:80%;float:left;margin-left:10%;"/></div>';
				}
				_html += '<div><div class="mtvcLeft mtvcLeft1"><span class="mlUserPic"><img src="photo1.png" style="width: 38px;"></span><span class="mlUserInfo"><b>张晶力</b><i>2017-01-17</i></span></div></div>';
				_html += "<div class='comm_content'><p>" + tmp.SHARE_CONTENT + "</p></div>"

				_html += '<div class=" mui-table-view-cell find-plan" id="sign' + tmp.SHARE_ID + '">';
				_html += '<p></p>';
				_html += shareOrLj;
				_html += '<div class="find-button find-bt">';
				_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')" ></span>';
				_html += '<span class="icon-line-82" id="comm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\'XTYX\',' + tmp.SHARE_ID + ')"></span>';
				_html += '<span class="' + _zIcon + '" id="sup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '"  data-fn="doSupport(\'XTYX\',' + tmp.SHARE_ID + ')"></span></div></div>';
				_html += '<div class="mui-table-view-cell-bt">';
				_html += '<div class="supDiv">';
				_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>';
				_html += '<b id="supName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>';
				_html += '<b class="moreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>';
				_html += '</div>';
				_html += '</div>';
				_html += '<div id="lessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
				_html += '<div id="moreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
				_html += '</div><div id="bottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="moreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
				_html += '<div class="bottomBtn comPack" id="packUp_' + tmp.SHARE_ID + '" style="display:none">收起</div></div';
				_html += '</div>';

				li.innerHTML = _html;
				_div.appendChild(li);
			}
			//调用查找评论列表 
			if(shareIdList) {
				getComms(shareIdList,this);
			}
            loadListener(this);
			loadBottom();

		} else {
			loadPl(this);
		}
	},
	error: function() { //失败回调方法
		//			alert('error!');
	}

}

