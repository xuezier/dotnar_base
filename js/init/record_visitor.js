//
/*
 * 记录访客
 * 等一个页面中的所有东西都加载完成了，就进行一次触发
 */
eventManager.once("finish-all-coAjax", function() {
	coAjax.post(appConfig.recordVisitorInfo, {
		bus_id: busInfo._id
	}, function(result) {
		console.log("访客信息已经记录：", result.result);
	});
});