/*
 * 全局配置变量
 */
//<?js
var imports = [
	"js/lib/Cookies.js",
	"js/lib/QueryString.js",
	"js/lib/eventManager.js",
	"js/lib/dataFormat_coAjax_serverNotify.js",
	"js/lib/alert_confirm_loader.js",
	"js/lib/jSouperHandle/documentTitle.js",
	"js/lib/jSouperHandle/number.js",
	"js/lib/jSouperHandle/time.js",
	"js/lib/jSouperHandle/useCss.js",
	"js/lib/Path.js",
	"js/lib/WX.js"
];
return "\r\n" + IMPORT(imports); ?>
;
/*
 * 加载核心依赖
 * 应用程序启动
 */
require(["r_css!/template/xmp.css"]);
require(["r_text!/template/xmp.html", "/template/xmp.js"], function(xmp_html) {
	jSouper.parse(xmp_html);
	jSouper.ready(function() {
		//初始化应用程序
		jSouper.app({
			Id: "jSouperApp",
			Data: {
				bus_info: busInfo,
				config: appConfig
			}
		});

		var appNode = document.getElementById("jSouperApp");
		appNode.style.display = "block"; //显示App
		if (_can_history_pushState) {
			window.addEventListener("popstate", Path.emitDefaultOnload);
		}

		//初始化路由
		Path.emitDefaultOnload();
		eventManager.emit("!AppReady");

		//<?js
		var imports = [
			"js/init/handle_query.js",
			"js/init/handle_history.js",
			"js/init/handle_collect.js",
			"js/init/handle_loginer.js",
			"js/init/wx_share.js",
			"js/init/record_visitor.js"
		];
		return "\r\n" + IMPORT(imports); ?>
	});
});