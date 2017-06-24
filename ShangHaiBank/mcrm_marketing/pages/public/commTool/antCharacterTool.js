/**
 * @字符替换处理
 */
function antCharachterFun(target,repc){
	var _finish = "";//最终字符串
	if(target){
		var len = target.length;
		var prev = target.substr(0,1);//记录前一个字符，初始化第一个字符
		var prevI = 0;
		for(var i = 0; i < len; i++){
			var a = target.substr(i,1);//每次取一个字符
			if(i > 0){
				prev = target.substr((i-1),1);
			}
			if(a == "@" && prev != "["){//满足替换条件，替换
				_finish += repc;
			}else
				_finish += ""+a;
		}
	}
//	console.log("@字符处理>>>>"+_finish);
	return _finish;
}
/**
 * 根据字符串，判断是否是@需要跳转到人员选择界面
 * @param {Object} target
 */
function isGo2AntChoose(target){
	var flag = false;
	if(target){
		var len = target.length;
		var prev = target.substr(0,1);//记录前一个字符，初始化第一个字符
		var prevI = 0;
		for(var i = 0; i < len; i++){
			var a = target.substr(i,1);//每次取一个字符
			if(i > 0){
				prev = target.substr((i-1),1);
			}
			if(a == "@" && prev != "["){//满足替换条件
				flag = true;
				break;
			}
		}
	}
	return flag;
}
/**
 * @后没有选择任何值，那么需要删除掉该@符号
 */
function delAntBackNull(target){
	var _finish = "";//最终字符串
	if(target){
		var len = target.length;
		var prev = target.substr(0,1);//记录前一个字符，初始化第一个字符
		var prevI = 0;
		for(var i = 0; i < len; i++){
			var a = target.substr(i,1);//每次取一个字符
			if(i > 0){
				prev = target.substr((i-1),1);
			}
			if(a == "@" && prev != "["){//满足替换条件，清除掉
				_finish += "";
			}else
				_finish += ""+a;
		}
	}
//	console.log("删除@字符>>>>"+_finish);
	return _finish;
}
/**
 * @删除处理 -- 没用了
 */
function antDelFun(antStorageList,target){
	var rlist = [];//最终的@数据
	//比对不相同的[@xxx]，不相同直接干掉
	for(var l = 0; l < antStorageList.length; l++){
		var m_ = antStorageList[l];
		var chooseName = "[@"+m_.chooseName+"]";
		var st = m_.start;
		var ed = m_.end;
		//直接根据起止位置，从target中截取比对
		var temp = target.substring(st,ed);
		if(chooseName != temp){//删除掉
			//1.先判断[]是否存在
			var ts = temp.indexOf("[");
			var te = temp.indexOf("]");
			var tp = "";
			if(ts != -1 && te != -1){//都存在
				tp = temp.substring(ts,te+1);
			}else if(ts != -1 && te == -1){//]不存在，由于删除就触发事件，所以只需要chooseName-1
				tp = temp.substr(ts,chooseName.length-1);
			}else if(ts == -1 && te != -1){//[不存在，由于删除就触发事件，
				ts = te-(chooseName.length-1);
				tp = temp.substring(ts,te+1);
			}else{//[]都不存在，这情况应该不会出现；暂时这样考虑
				tp = "@"+m_.chooseName;
			}
			target = target.replace(tp,"");
		}else{
			rlist.push(m_);
		}
	}
	
	//放入返回map
	var map_ = {
		content:target,
		list:rlist
	};
	return map_;
}
/**
 * 由于输入的文字可能改变[@xxx]存放位置，所以随时监测重置
 */
function reloadStorage(antStorageList,target,cunStorage,oldAntValue){
//	console.log("现在值target>>"+target+"<<前面值oldAntValue>>"+oldAntValue);
	var rlist = [];
	var oldTarget = "";//如果oldTarget=""，那么返回后不能替换oldAntValue；否则替换
	//改变的字符长度
	var changeLength = target.length - oldAntValue.length;//正数，负数，0--不需要考虑
//	alert("改变的字符长度=="+changeLength);
//	console.log("这里的长度为:>>"+antStorageList.length);
	for(var l = 0; l < antStorageList.length; l++){
		var m_ = antStorageList[l];
		var chooseName = "[@"+m_.chooseName+"]";
		var st = m_.start;
		var ed = m_.end;
//		console.log("chooseName>>"+chooseName+"<<开始>>"+st+"<<结束>>"+ed);
		var index_ = target.indexOf(chooseName);
		//因为保证了chooseName的唯一性
		if(index_ == -1){//删除操作
			var temp = target.substring(st,ed);
			
			var ts = temp.indexOf("[");
			var te = temp.indexOf("]");
			
//			console.log("ts>>"+ts+"<<te>>"+te);
			var tp = "";
			if(ts != -1 && te != -1){//都存在
				tp = temp.substring(ts,te+1);//说明在[@xxx]里面删除操作
				oldTarget = "";
			}else{
				var cst = 0,ced = 0;
				if(changeLength > 0){//判断在[@xxx]里面增的情况
					ced = ed+changeLength;
				}
				if(ced > 0){
					var ctemp = target.substring(st,ced);
//					console.log("改变后：ctemp>>"+ctemp+"<<开始>>"+st+"<<结束>>"+ced);
					var cts = ctemp.indexOf("[");
					var cte = ctemp.indexOf("]");
					if(cts != -1 && cte != -1){
						tp = "";
						mui.toast("不能在[@xxx]输入值！");
						target = oldAntValue;
						oldTarget = oldAntValue;
						rlist.push(m_);
					}
				}else{
					oldTarget = "";
					if(ts != -1 && te == -1){//]不存在，由于删除就触发事件，所以只需要chooseName-1
						tp = temp.substr(ts,chooseName.length-1);
					}else if(ts == -1 && te != -1){//[不存在，由于删除就触发事件，
						ts = te-(chooseName.length-1);
						tp = temp.substring(ts,te+1);
					}else{//[]都不存在，说明输入的字符在[@xxx]特殊字段中间，那么提示不能输入，返回上一次的结果
						tp = "@"+m_.chooseName;
					}
				}
			}
			//console.log("需删除的字符串为>>>>"+tp);
			if(tp.length > 0){
				target = target.replace(tp,"");
				oldTarget = target;
				//删除存储的用户名字符串
				var rp = ","+m_.chooseName+",";
				cunStorage = cunStorage.replace(rp,",");
			}
		}else{
			//判断跳转该m_的起止位置
			var st_ = index_;
			var ed_ = st_+chooseName.length;
			//重置起止位置
			m_.start = st_;
			m_.end = ed_;
			rlist.push(m_);
		}
	}
	
	//放入返回map
	var map_ = {
		content:target,
		oldContent:oldTarget,
		list:rlist,
		cunStorage:cunStorage
	};
	return map_;
}
