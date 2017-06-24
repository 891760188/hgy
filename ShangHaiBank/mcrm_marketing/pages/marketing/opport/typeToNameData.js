function typeToName(typeId) {
	var name = "";
	if(1 * typeId == 1)
		name = "我的商机";
	else if(1 * typeId == 2)
		name = "我参与的商机";
	else if(1 * typeId == 3)
		name = "@给我的商机";
	else if(1 * typeId == 4)
		name = "重点商机";
	else if(1 * typeId == 5)
		name = "其他同事的商机";
	else if(1 * typeId == 6)
		name = "已落地商机";
	else if(1 * typeId == 7)
		name = "已放弃商机";
	else if(1 * typeId == 8)
		name = "@我的消息";
	return name;
}