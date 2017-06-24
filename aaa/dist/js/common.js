function sideMenu()｛
	$("#sideMenu li").click(function() {
	
		$(this).siblings('li').removeClass('active');
	
		$(this).addClass('active');
	
	})
｝