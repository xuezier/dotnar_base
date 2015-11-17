//
;
(function() {
	// alert("获取登陆者信息……" + location.pathname)

	//获取登陆用户的信息
	/*
	 * 管理员相关的页面无需登录
	 */
	var no_user_login_pages = {
		// "/cart.html": 1,
		// "/pay.html": 1
	};
	if (no_user_login_pages[location.pathname]) {
		return;
	};

	/*
	 * 获取登录者信息
	 */
	var _is_success, _is_ready, _is_send_coAjax;
	console.log("获取登陆者信息……", location.pathname);

	function _login_sucess(data) {
		_is_ready = true;
		_is_success = true;
		// alert("success","用户登录成功");
		console.log("登录者信息：", data.result);
		userInfo = data.result;
		App.set("loginer", userInfo);
		//触发相关事件
		eventManager.fire("getLoginer");
	};

	function _login_err(errorCode) {
		_is_ready = true;
		_is_success = false;
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

	var succ_cb_list = []
	var err_cb_list = []

	function _wx_login_success() {
		alert("success", "微信授权登录成功");
		_login_sucess.apply(this, arguments);
	}
	window._wx_openid_login = function _wx_openid_login(openid) {

		// if (location.host.indexOf(".dotnar.com") == -1) {
		// 	//先判断是否是登录状态，如果已经登录说明是二级域名登录过的，否则跳到二级域名那里登录
		// 	coAjax.get(appConfig.user.loginer, _wx_login_success, function() {
		// 		//顶级域名，需要跳转到二级域名进行登录确保Cookie的写入
		// 		var cb_url = encodeURIComponent(location.href);
		// 		myConfirm("您的微信账户已绑定过本站点，是否自动登陆？", function() {
		// 			Path.jump("http://" + busInfo._id + ".dotnar.com/weixin_login.html?cb_url=" + cb_url)
		// 		});
		// 	});
		// } else {
			//自动登录
			coAjax.get(appConfig.user.loginer, {
				openid: openid
			}, _wx_login_success, function(errorMsg) {
				if (errorMsg === "refresh_token time out") {
					Path.wxJump(location.href)
				}
			});
		// }
	};

	(window.coAjaxLoginUser = function(succ_cb, err_cb, _force_send) {
		if (succ_cb instanceof Function) {
			succ_cb_list.push(succ_cb);
		}
		if (err_cb instanceof Function) {
			err_cb_list.push(err_cb);
		}
		if (_is_ready) {
			var cb_list = _is_success ? succ_cb_list : err_cb_list;
			for (var i = 0, len = cb_list.length; i < len; i += 1) {
				var foo = cb_list[i];
				foo();
			}
			cb_list.length = 0;
			return;
		}
		if (_is_send_coAjax && !_force_send) {
			return
		}
		_is_send_coAjax = true;


		if (_isWX) {
			//微信必须使用OPENID登录，而且不同站点必须独立授权，确保OPENID的独立性
			globalGet("WEIXIN_OPENID:" + busInfo._id, function(openid) {
				if (openid) {
					_wx_openid_login(openid);
				};
			});
		} else {
			_cookie_login();
		};
	})();
}());