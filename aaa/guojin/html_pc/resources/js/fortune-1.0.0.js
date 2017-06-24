function ajax(ajaxParam){
	//alert(ajaxParam.data);
	$.ajax({
		type: ajaxParam.type,
		url: ajaxParam.url,
	    data: ajaxParam.data,
	    cache: "false",
	    dataType: "json",
	    success: function(data){
	    	if(data.status == "session_timeout"){
	    		location.href = "/invest/session_error.jsp";
	    	}else if(data.status == "success"){
	    		ajaxParam.success(data);
	    	}else{
	    		if(ajaxParam.error == null || ajaxParam.error == undefined){
	    			alert(data.errorCode + "\n" + data.errorMsg);
	    		}else{
	    			ajaxParam.error(data);
	    		}
	    	}
	    },
	    error: function(jqXHR,textStatus,errorThrown){
	    	if(ajaxParam.error == null || ajaxParam.error == undefined){
	    		alert(textStatus);
	    	}else{
	    		if(textStatus == "error"){
	    			textStatus = "无法连接服务器";
	    		}
	    		var data = {"errorCode":"999999","errorMsg":textStatus};
	    		ajaxParam.error(data);
	    	}
	    }
	});
}

function popShow(div){
	var cover = $("#cover");
	if(cover == null || cover == undefined || cover.length <= 0){
		cover = document.createElement("div");
		cover.id = "cover";
		document.body.appendChild(cover);
		cover = $(cover);
	}
	cover.width($(document).width());
	cover.height($(document).height());
	cover.css('left',0);
	cover.css('top',0);
	cover.show();

	$(div).fadeIn(500);
}

function closePop(div){
	$(div).fadeOut(10,function(){
		$("#cover").hide();
	});
}

function show(div){
	$(div).fadeIn(10);
}

function hide(div){
	$(div).fadeOut(10);
}
