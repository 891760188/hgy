var allTabConfig = {
	url: basePath + 'ocrmShareAction!getShareAll.json', //查询URL
	pageSize: 6, //分页大小
	scrollerId: 'item1mobile', //mui滚动区域div的ID
	getCondition: function() { //获取查询条件方法
		//searchContent();//查询条件
	},
	success: function(response) { 
		if(response.json.data.length > 0) {

			var data = response.json.data;
			var user_id = plus.storage.getItem('_userId');
			var supClass = 'icon-like sup_state_0';
			var _div = document.getElementById('allContent');
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
				//如果是日志，公告类型
				var disp;
				var bizCont = '';    
				if(bizType=="LOG"||bizType=="GG"){
					if(tmp.BIZ_CONTENT.length > '160') {
					bizCont = tmp.BIZ_CONTENT.substring(0, 160) + '......';
					disp = "block";
					} else {
						bizCont = tmp.BIZ_CONTENT;
						disp = "none";
					}
				}
				 
				if(tmp.SHARE_URL){
					//图片类型
					_html += '<div><div class="mtvcLeft mtvcLeft1"><span class="mlUserPic"><img src="photo1.png" style="width: 38px;"></span><span class="mlUserInfo"><b>张晶力</b><i>2017-01-17</i></span></div></div>';
					_html += "<div class='comm_content'><p>" + tmp.SHARE_CONTENT + "</p></div>"
	
					_html += '<div class=" mui-table-view-cell find-plan" id="all_' + tmp.SHARE_ID + '">';
					_html += '<p></p>';
					_html += '<div><img data-src="' + tmp.SHARE_URL + '" src="loading.png" onload="lazyLoad(this)" style="width:80%;float:left;margin-left:10%;"/></div>'
					_html += '<div class="find-button find-bt">';
					_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')" ></span>';
					_html += '<span class="icon-line-82" id="allComm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\''+bizType+'\',' + tmp.SHARE_ID + ')"></span>';
					_html += '<span class="' + _zIcon + '" id="allSup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '"  data-fn="allDoSupport(\''+bizType+'\',' + tmp.SHARE_ID + ')"></span></div></div>';
	
					_html += '<div class="mui-table-view-cell-bt">';
					_html += '<div class="supDiv">';
					_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>';
					_html += '<b id="allSupName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>';
					_html += '<b class="moreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>';
					_html += '</div>';
					_html += '</div>';
					_html += '<div id="allLessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
					_html += '<div id="allMoreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
					_html += '</div><div id="allBottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="allMoreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
					_html += '<div class="bottomBtn" id="allPackUp_' + tmp.SHARE_ID + '" style="display:none">收起</div></div>';
					_html += '</div>';
				}else if(tmp.SHARE_LINK_ADDR){
					//链接地址类型
					_html += '<div><div class="mtvcLeft mtvcLeft1"><span class="mlUserPic"><img src="photo1.png" style="width: 38px;"></span><span class="mlUserInfo"><b>张晶力</b><i>2017-01-17</i></span></div></div>';
					_html += "<div class='comm_content'><p>" + tmp.SHARE_CONTENT + "</p></div>"
	
					_html += '<div class=" mui-table-view-cell find-plan" id="all_' + tmp.SHARE_ID + '">';
					_html += '<p></p>';
					_html += '<div class="comm_content fxlj"><a data-url="' + tmp.SHARE_LINK_ADDR + '">点击链接</a></div>'
					_html += '<div class="find-button find-bt">';
					_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')" ></span>';
					_html += '<span class="icon-line-82" id="allComm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\''+bizType+'\',' + tmp.SHARE_ID + ')"></span>';
					_html += '<span class="' + _zIcon + '" id="allSup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '"  data-fn="allDoSupport(\''+bizType+'\',' + tmp.SHARE_ID + ')"></span></div></div>';
	
					_html += '<div class="mui-table-view-cell-bt">';
					_html += '<div class="supDiv">';
					_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>';
					_html += '<b id="allSupName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>';
					_html += '<b class="allMoreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>';
					_html += '</div>';
					_html += '</div>';
					_html += '<div id="allLessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
					_html += '<div id="allMoreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
					_html += '</div><div id="allBottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="allMoreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
					_html += '<div class="bottomBtn" id="allPackUp_' + tmp.SHARE_ID + '" style="display:none">收起</div></div>';
					_html += '</div>';
				}else if(tmp.BIZ_TYPE=='GG'){
					//内容分享
					_html += '<div class="mui-table-view-cell-top">'
					_html += '<div class="mtvcLeft mtvcLeft1">'
					_html += '<span class="mlUserPic"><img src="photo1.png" style="width: 38px;" /></span>'
					_html += '<span class="mlUserInfo"><b>' + tmp.SHARE_NAME + '</b><i>' + tmp.SHARE_TIME + '</i></span>'
					_html += '</div>'
					_html += '</div>'
					_html += '<div class="mui-table-view-cell find-plan">'
					_html += '<p style="font-size: 20px;color: #333;line-height: 24px;">' + tmp.OTHER3 + '</p>'
					_html +='<p style="float: left;padding-right: 15px;">'+tmp.OTHER1+'</p>';
					_html +='<p>'+tmp.TMPDATE+'</p>'
					_html += '<p class="contentInfo" id="GGCont_' + tmp.SHARE_ID + '" style="text-indent: 2em">' + bizCont + ''
					_html += '</p>'
					_html += '<div class="bottomBtn moreContent" data-fn="GGCont_' + tmp.SHARE_ID + '" GgCont="' + tmp.BIZ_CONTENT + '" GgSmallCont="' + bizCont + '" style="display:' + disp + ';">显示更多</div>'
	
					_html += '<div class="find-button find-bt">'
					_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')"  style="display:' + deleteStyle + '"></span>'
					_html += '<span class="icon-line-82" id="allComm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\'GG\',' + tmp.SHARE_ID + ')"></span>';
					_html += '<span class="' + _zIcon + '" id="allSup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '" shareName="' + tmp.SHARE_NAME + '" shareId="' + tmp.SHARE_ID + '" data-fn="allDoSupport(\'GG\',' + tmp.SHARE_ID + ')" sign="sup"></span>' //点赞
					_html += '</div>'
					_html += '</div>'
					_html += '<div class="mui-table-view-cell-bt">'
					_html += '<div class="supDiv">'
					_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>'
					_html += '<b id="allSupName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>'
					_html += '<b class="moreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>'
					_html += '</div>';
					_html += '</div>';
					_html += '<div id="allLessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
					_html += '<div id="allMoreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
					_html += '</div><div id="allBottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="allMoreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
					_html += '<div class="bottomBtn comPack" id="allpPackUp_' + tmp.SHARE_ID + '" style="display:none">收起</div></div>';
					_html += '</div>';
				}else if(tmp.BIZ_TYPE=='LOG'){
					_html += '<div class="mui-table-view-cell-top">'
					_html += '<div class="mtvcLeft mtvcLeft1">'
					_html += '<span class="mlUserPic"><img src="photo1.png" style="width: 38px;" /></span>'
					_html += '<span class="mlUserInfo"><b>' + tmp.SHARE_NAME + '</b><b>已点评</b><i>' + tmp.SHARE_TIME + '</i></span>'
					_html += '</div>'
					_html += '</div>'
					_html += '<div class="mui-table-view-cell find-plan">'
						//			_html += '<p>' + tmp.BIZ_NAME + '</p>'
					_html += '<div class="contentInfo" id="GGCont_' + tmp.SHARE_ID + '">' + bizCont + ''
					_html += '</div>'
					_html += '<div class="bottomBtn moreContent" data-fn="GGCont_' + tmp.SHARE_ID + '" GgCont="' + tmp.BIZ_CONTENT + '" GgSmallCont="' + bizCont + '" style="display:' + disp + ';">显示更多</div>'
	
					_html += '<div class="find-button find-bt">'
					_html += '<span class="icon-line-101"  data-fn="delShare(' + tmp.SHARE_ID + ')"  style="display:' + deleteStyle + '"></span>'
					_html += '<span class="icon-line-82" id="allComm_' + tmp.SHARE_ID + '" data-count="' + tmp.COMCOUNT + '"  data-fn="openComment(\'LOG\',' + tmp.SHARE_ID + ')"></span>';
					_html += '<span class="' + _zIcon + '" id="allSup_' + tmp.SHARE_ID + '" data-issup="' + is_sup + '" shareName="' + tmp.SHARE_NAME + '" shareId="' + tmp.SHARE_ID + '" data-fn="allDoSupport(\'LOG\',' + tmp.SHARE_ID + ')" sign="sup"></span>' //点赞
					_html += '</div>'
					_html += '</div>'
					_html += '<div class="mui-table-view-cell-bt">'
					_html += '<div class="supDiv">'
					_html += '<span class="icon-line-132" style="display:' + moreContIcon + ';"></span>'
					_html += '<b id="allSupName_' + tmp.SHARE_ID + '">' + supName[i] + '</b>'
					_html += '<b class="moreIcon" shareId=' + tmp.SHARE_ID + ' bizType=' + tmp.BIZ_TYPE + ' supNameId="supName_' + tmp.SHARE_ID + '" style="display:' + moreCont + ';">更多</b>'
					_html += '</div>';
					_html += '</div>';
					_html += '<div id="allLessCom_' + tmp.SHARE_ID + '" class="comDiv"></div>';
					_html += '<div id="allMoreCom_' + tmp.SHARE_ID + '"" class="comDiv"></div>';
					_html += '</div><div id="allBottomDiv_' + tmp.SHARE_ID + '" class="bottomDiv"><div class="moreBtn bottomBtn" id="allMoreBtn_' + tmp.SHARE_ID + '" style="display:none">显示更多</div>';
					_html += '<div class="bottomBtn comPack" id="allPackUp_' + tmp.SHARE_ID + '" style="display:none">收起1</div></div>';
					_html += '</div>';
				}
				 

				li.innerHTML = _html;
				_div.appendChild(li);
			}
			//调用查找点赞人 
			getComms(shareIdList,this); 
			loadListener(this);
			loadBottom(this);
   
		} else {
			loadPl(this);
		}
	},
	error: function() { //失败回调方法
		//			alert('error!');
	}
}

//全部的点赞
function allDoSupport(biz_type, biz_id, flag) {
	var sup = document.getElementById('allSup_' + biz_id);
	var flag = sup.getAttribute('data-issup');
	if(flag == 0) {
		//当前用户还没有点赞
		doSuppport(biz_type, biz_id);
	} else {
		//当前用户已经点赞
		cancleSupport(biz_type, biz_id);
	}
}

