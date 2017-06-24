var selectType = 0;//默认为选中
var curWebViewId;
var backPage;
var cwebview = decodeURIComponent(_App.util.getUrlParamByName("cwebview"));

var appConfig = {
	//是否启用右滑关闭功能
	swipeBack: false,
	//ui加载完成调用
	uiReady: function() {
	},
	//设备资源加载完成调用
	deviceReady: function() {
		curWebViewId = plus.webview.currentWebview().id;
		curWebViewId = encodeURIComponent(curWebViewId);//便面中午在iOS上报错
		backPage = plus.webview.getWebviewById(cwebview);
	}
};

_App.init(appConfig);

function selectProduct(){
	_App.util.goPage('../../product/productChoose.html?cwebviewId='+curWebViewId, {
		pageId:"productChooseId",
		refresh:true
	});
	return false;
}

function toCall(obj){
    plus.device.dial('13487678574', false);
}

function changeStatus(){
	var con = document.getElementById('contentDivId');
	var isActive = document.getElementById("switchBtnId").classList.contains("mui-active");
	if(isActive){
	  selectType = 0;
	 
	  con.innerHTML =htmlAdvTmp;
	  //console.log("打开状态");//默认是产品经理介入
	}else{
	  selectType = 1;
	  con.innerHTML =htmlPlanTmp;
	}
}	
		
function selectData(){
	if(selectType == 0){//产品经理选择
		chooseAdviser();
	}else if(selectType == 1){//方案选择
		chooseMarket();
	}
}

function chooseAdviser(){
	var url = 'financialAdviser.html?cwebviewId='+curWebViewId+'&pageType=mplan';
	_App.util.goPage(url, {
		pageId:"financialAdviserId",
		refresh:true
	});
	
}
function chooseMarket(){
	_App.util.goPage('marketChoose.html', "none");
	
}

//产品选择自定义事件监听
window.addEventListener('chooseProdEvent__',function(event){
	//获得事件参数
	var name = event.detail.name;
	document.getElementById("productName").value = name;
});

function cancel(){
	mui.back();
}

function save(){
	var map_ = plus.storage.getItem("flowOppDMap_");
	map_ = JSON.parse(map_);
	var newAddOpportunity = plus.storage.getItem("newAddOpportunity");
	if(!newAddOpportunity){
		newAddOpportunity = [];
	}else{
		newAddOpportunity = JSON.parse(newAddOpportunity);
	}
	//删除并替换原来的元素
	var pos = map_.pos;
	var step = map_.oppStep;
	step = 1*step+1;
	map_.oppStep = ""+step;
	newAddOpportunity.splice(pos,1);
	//添加元素
	newAddOpportunity.unshift(map_);
	//重设数组数据
	plus.storage.removeItem("newAddOpportunity");
	plus.storage.setItem("newAddOpportunity",JSON.stringify(newAddOpportunity));
	mui.fire(backPage,'newAddOppBackEvent__',{
	});
	mui.back();
};

function toChat(toName){ 
	_App.util.goPage("../../public/chat/im-chat.html?toUserName="+encodeURIComponent(toName),"none"); 
}

var htmlAdvTmp="请选择数据！";
var htmlPlanTmp="请选择数据！";
//添加产品经理介入定自定义事件监听
window.addEventListener('paramBackEvent__',function(event){
  //获得事件参数
  var name = event.detail.name;
  
  var con = document.getElementById('contentDivId');//var con = mui("#marketChooseId")[0];document.querySelector('input[name="color"]:checked');

  var html = "";
  html = html + '<div class="imgDiv">'
  html = html + '   <img src="../../../themes/default/images/temp/temp_06.gif" />'
  html = html + '</div>'
  html = html + '<div>'
  html = html + '  <b>'+name+'<div class="mui-icon mui-icon-chat" onClick="toChat(\''+name+'\')" style="float:right;"></div><div class="mui-icon mui-icon-phone" onClick="toCall(\'telId\')" style="float:right;margin-right:5px;"></div></b>'
  html = html + '<span >电话：13800138000  <a href="tel:13800138000" id="telId"></a></span>'
  html = html + '<span>邮箱：litch@xxx.com</span>'
  html = html + '</div>'
  html = html + '<span>简介：1-6个月超短期理财 15%年化收益，拉长中、长期理财融资产品，拥有数百位大客户成功营销经验。</span>'
  
  con.innerHTML =html;
  htmlAdvTmp = html;
 
});
		
//添加营销方案制定自定义事件监听
window.addEventListener('paramBackEventProd__',function(event){
  //获得事件参数
  var name = event.detail.name;
  
  var con = document.getElementById('contentDivId');//var con = mui("#marketChooseId")[0];document.querySelector('input[name="color"]:checked');

  var html = "";
  
//		  html = html + '<div>'
//		  html = html + '  <b>'+name+'</b>'
//		  html = html + '</div>'
//		  html = html + '<span>简介：1-6个月超短期理财 15%年化收益，拉长中、长期理财融资产品，拥有数百位大客户成功营销经验。</span>'

    html = html + '<div id="mcc-custView" class="mui-control-content mui-active mui-scroll">'
	html = html + '				<div class="ys-custTitle">'+name+'</div>'
	html = html + '				<h5 class="mui-content-padded">基本信息</h5>'
	html = html + '				<div class="ys-custInfo mui-card">'
	html = html + '					<p><b>客户名称：</b><span>平安科技有限公司</span></p>'
	html = html + '					<p><b>联系人：</b><span>李成方</span></p>'
	html = html + '					<p><b>联系地址：</b><span>北京市中关村流顺路176号安山大厦4F</span></p>'
	html = html + '					<p><b>联系电话：</b><span>010-99999999</span><span class="mui-icon mui-icon-phone"></span></p>'
	html = html + '					'
	html = html + '				</div>'
	html = html + '				<h5 class="mui-content-padded">产品营销流程</h5>'
	html = html + '				<div class="ys-custInfo ys-bothNeat mui-card">'
	html = html + '					<span class="mui-badge mui-badge-primary" onClick="marketDetail();">锁定客户</span>'
	html = html + '					-->'
	html = html + '					<span class="mui-badge mui-badge-primary" onClick="marketDetail();">接触推销</span>'
	html = html + '					-->'
	html = html + '					<span class="mui-badge mui-badge-primary" onClick="marketDetail();">反馈</span>'
	html = html + '					-->'
	html = html + '					<span class="mui-badge mui-badge-primary" onClick="marketDetail();">铺垫下次营销</span>'
	html = html + '				</div>'
	html = html + '				<h5 class="mui-content-padded">产品定价描述</h5>'
	html = html + '				<div class="ys-custInfo mui-card">'
	html = html + '					<p><b>1基准利率：</b><span>10%</span></p>'
	html = html + '					<p><b>2上下浮动：</b><span>1%</span></p>'
	html = html + '					<p><b>3手续费率：</b><span>0.5%</span></p>'
	html = html + '					<p><b>4其他：</b><span>1000万以上手续费可减免</span></p>'
	html = html + '			        '
	html = html + '				</div>'
	html = html + '				<h5 class="mui-content-padded">产品营销注意事项</h5>'
	html = html + '				<div class="ys-custInfo mui-card">'
	html = html + '					<p><b>1：</b><span>点击某条商机可以看到客户具体信息</span></p>'
	html = html + '					<p><b>2：</b><span>产品定价准确性</span></p>'
	html = html + ''
	html = html + '				</div>'
	html = html + '				<h5 class="mui-content-padded">营销话术</h5>'
	html = html + '				<div class="ys-custInfo mui-card">'
	html = html + '					<p><b>1：</b><span>融资需求必须使用某产品</span></p>'
	html = html + '					<p><b>2：</b><span>产品定价准确性</span></p>'
	html = html + '				'
	html = html + '				</div>'
	html = html + '			</div>'

  con.innerHTML =html;
  
  htmlPlanTmp = html;
 
});