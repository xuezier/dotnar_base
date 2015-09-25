//
;
(window.coAjaxLoginUser = function(succ_cb) {
	// alert("获取登陆者信息……"+location.pathname)

	//获取登陆用户的信息
	/*
	 * 管理员相关的页面无需登录
	 */
	var no_user_login_pages = {
		"/cart.html": 1,
		"/pay.html": 1
	};
	if (no_user_login_pages[location.pathname]) {
		return;
	};
	// alert("开始获取"+appConfig.user.loginer)
	console.log("获取登陆者信息……", location.pathname);
	/*
	 * 获取登录者信息
	 */
	function _login_sucess(data) {
		// alert("success","用户登录成功");
		console.log("登录者信息：", data.result);
		userInfo = data.result;
		App.set("loginer", userInfo);
		//触发相关事件
		eventManager.fire("getLoginer");
		succ_cb && succ_cb();
	};

	function _login_err(errorCode) {
		// alert("用户未登录");
		var must_login_pages = {
			"/user/cart": 1,
			"/user/pay": 1
		};
		//未登录，不可进入个人页，强制跳转到登录页
		if (must_login_pages[Path._current_page]) {
			Path.jump("/sign_in.html");
		};
	};

	function _cookie_login() {
		coAjax.get(appConfig.user.loginer, {
			_: Math.random()
		}, _login_sucess, _login_err);
	};

	window._wx_openid_login = function _wx_openid_login(openid) {
		//自动登录
		coAjax.get(appConfig.user.loginer, {
			openid: openid
		}, function() {
			alert("success", "微信授权账号自动登录成功");
			_login_sucess.apply(this, arguments);
		});
	};

	if (_isWX) {
		//微信必须使用OPENID登录，而且不同站点必须独立授权，确保OPENID的独立性
		globalGet("WEIXIN_OPENID:" + busInfo._id, function(openid) {
			if (openid && !App.get("loginer")) {
				var cb_url = encodeURIComponent(location.href);
				location.href = "http://jewel.dotnar.com/weixin_login.html?cb_url=" + cb_url;
				// _wx_openid_login(openid);
			}
		});
	} else {
		_cookie_login();
	};
})();