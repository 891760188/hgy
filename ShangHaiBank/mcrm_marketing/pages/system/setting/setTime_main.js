var becheck = 'icon-checkbox-checked';
var uncheck = 'icon-checkbox-unchecked';
mui.plusReady(function() {
	mui('.mui-table-view-cell').on('tap', 'a', function() {
		var spanClass = this.querySelector('span').classList;
		if(spanClass.contains(becheck)) {
			spanClass.remove(becheck);
			spanClass.add(uncheck);
		} else if(spanClass.contains(uncheck)) {
			spanClass.remove(uncheck);
			spanClass.add(becheck);
		}
	});

	mui('.mui-table-view-cell').on('tap', '.pencil', function() {
		var id = this.getAttribute('data-id');
		var url = "setTime_sub.html?type=one"
		_App.util.goPage(url, {
			pageId: 'setTime_sub_id',
			refresh: true
		});
		return false;
	});

	document.querySelector('.allset').addEventListener('tap', function() {
		var url = "setTime_sub.html?type=all"
		_App.util.goPage(url, {
			pageId: 'setTime_sub_id',
			refresh: true
		});
	})
});

function doSure(){
	mui.back();
}
