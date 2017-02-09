/**
 * Created by wangwei01 on 2017/1/17.
 */
;(function () {


	var type = zhx.getSearchName("type");
	var list = [{key:"pageTitle",title:"店铺主页"}];
	switch (type){
		case "storeMain":
			list.push({key:"banner",bgColor:"#DE3A53"});
			list.push({key:"textTitle",title:"新品上架"});
			list.push({key:"goodsList",pattern:"small",showName:0,type:"card"});
			//list.push({key:"notice"})
			break;
		case "custom":
			break;
	}

	//zhx.init();
	zhx.init(list);
	//zhx.init([{key:"pageTitle",title:"店铺主页"},{key:"editor",html:"<p>3333333333333333333</p>"}]);

	 
})();