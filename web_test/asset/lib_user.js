'use strict';
let lib = {};
export function set_lib(L) { lib = L; }
const api = '/api.aspx';
export const setting = {
	logined: false,
	fp: '',
	base64: null,
	user_info: {},
	my_salt: '',
	role: {}
}
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
//--begin ck---
function setCookie(name, value, days) {
	var expires = "";
	if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}
function eraseCookie(name) {
	document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
function getLocal(name) {
	return window.localStorage.getItem(name);
}
function setLocal(name, value) {
	window.localStorage.setItem(name, value);
}
function delLocal(name) {
	localStorage.removeItem(name);
}
function save_store(key, value) {
	setCookie(key, value, 365);
	setLocal(key, value);
}
function get_store(key) {
	var value = getCookie(key);
	if (value == null || value == '' || value == undefined) {
		value = getLocal(key);
	}
	return value;
}
function del_store(key) {
	delLocal(key);
	eraseCookie(key);
}
//--end ck---
function show_user(json) {
	setting.logined = true;
	setting.user_info = json;
	//show info login thành công
	$('#user-info').html('Welcome ' + json.name)
	//hiện nút logout
	$('.cmd-logout').removeClass('no-display');
	//ẩn nút login
	$('.cmd-login').addClass('no-display');
	lib.control.main();
	if (json.ok)//đăng nhập ok
	{
		if (json.ck) save_store("ck", json.ck)
		if (json.uid) save_store("uid", json.uid);
		//lib.sensor.show_sensor();
	}
}
function show_captcha(json) {
	if (json.captcha) {
		setting.base64 = json.captcha;
		if ($('#img-captcha')) {
			$('#captcha-zone').removeClass("no-display");
			$('#img-captcha').attr("src", "data:image/png;base64," + setting.base64);
			$('#img-captcha').unbind('click').click(function () {
				GenerateSalt();
			});
		}
	} else {
		setting.base64 = null;
	}
}
function GenerateSalt() {
	$.post(api, { action: 'GenerateSalt' }, function (json) {
		if (json.salt) {
			setting.my_salt = json.salt;
			console.log('Lấy được muối: ' + setting.my_salt);
		}
		show_captcha(json);
	}, 'json');
}
// Hàm tính toán SHA1
export function sha1(input) {
	return CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex);
}
// Hàm mã hóa mật khẩu
export function hashPassword(uid, password, salt) {
	// Mã hóa: SHA1(SHA1(uid + pw) + muối))
	var data = sha1(uid + password) + salt;
	return sha1(data);
}
function format_ss(ss) {
	var days = Math.floor(ss / (24 * 3600));
	var hours = Math.floor((ss % (24 * 3600)) / 3600);
	var minutes = Math.floor((ss % 3600) / 60);
	var seconds = ss % 60;

	var kq = '', done = 0;
	if (days > 0) kq += days + 'd';
	if (kq != '' || hours > 0) {
		kq += hours + 'h';
		if (days > 0) {
			kq + ' ago';
			done = 1;
		}
	}
	if ((done == 0) && (kq != '' || minutes > 0)) {
		kq += minutes + 'm';
		if (hours > 0) {
			kq + ' ago';
			done = 1;
		}
	}
	if (done == 0 && (kq != '' || seconds > 0)) kq += seconds + 's';
	if (done == 0 && kq != '') kq += ' ago';
	if (ss == 0) kq = 'now';
	return kq;
}
var login_dialog = null;
export function do_login() {
	//lấy tí muối
	GenerateSalt();
	//html có chứa login form
	var html_login_form = `<form class="was-validated">
  <div class="mb-3 mt-3">
    <input type="text" class="form-control uid" id="uid" placeholder="Enter username" name="uname" required>
    <span class="invalid-feedback">Chưa nhập username</span>
  </div>
  <div class="mb-3">
    <input type="password" class="form-control pwd" id="pwd" placeholder="Enter password" name="pswd" required>
    <span class="invalid-feedback">Chưa nhập password</span>
  </div>
  <div class="no-display" id="captcha-zone">
	<img src="" id="img-captcha" class="pb-1" title="Click vào ảnh để tải nội dung mới" />
    <input type="text" class="form-control txt-captcha" id="txt-captcha" placeholder="Enter text in image" name="txt-captcha" required>
    <span class="valid-feedback">Captcha nhập giống ảnh nhé, click vào ảnh để tải nội dung mới</span>
    <span class="invalid-feedback">Hãy nhập chữ trong ảnh vào đi, click vào ảnh để tải nội dung mới</span>
  </div>
</form>`;
	if (login_dialog != null) login_dialog.close();
	login_dialog = $.confirm({
		title: 'Đăng nhập',
		icon: 'fa fa-key',
		type: 'blue',
		content: html_login_form,
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 's',
		closeIcon: true,
		onContentReady: function () {
			if (setting.base64 != null) {
				show_captcha({ captcha: setting.base64 })
			}

			$('.jconfirm-holder').width($('.jconfirm-open').width());
			let self = this;
			var uidck = self.$content.find('.uid').val();
			if (uidck == '')
				self.$content.find('.uid').focus();
			else
				self.$content.find('.pwd').focus();
			self.$content.find('.uid').keyup(function (event) {
				if (event.keyCode === 13) {
					if (self.$content.find('.uid').val() == '')
						self.$content.find('.uid').focus();
					else
						self.$content.find('.pwd').focus();
				}
			});
			self.$content.find('.pwd').keyup(function (event) {
				if (event.keyCode === 13) {
					if (self.$content.find('.uid').val() == '')
						this.$content.find('.uid').focus();
					else if (self.$content.find('.pwd').val() == '')
						this.$content.find('.pwd').focus();
					else {
						let x = $.find('.cmd-submit');
						x[0].click();
					}
				}
			});
			self.$content.find('.txt-captcha').keyup(function (event) {
				if (event.keyCode === 13) {
					let x = $.find('.cmd-submit');
					x[0].click();
				}
			});
		},
		buttons: {

			yes: {
				text: '<i class="fa fa-circle-check"></i> Login',
				btnClass: 'btn-primary cmd-submit',
				action: function () {
					var uid = $('#uid').val();
					uid = uid.trim().toLowerCase();
					var login_data = {
						action: 'login',
						uid: uid,
						pwd: $('#pwd').val(),
						captcha: $('#txt-captcha').val(),
						fp: setting.fp
					};
					if (login_data.uid == '') {
						bao_loi('Chưa nhập username', function () { $('#uid').focus(); });
						return false;
					}
					if (login_data.pwd == '') {
						bao_loi('Chưa nhập password', function () { $('#pwd').focus(); });
						return false;
					}
					if (setting.base64 && login_data.captcha == '') {
						bao_loi('Chưa nhập captcha', function () { $('#txt-captcha').focus(); });
						return false;
					}
					//trước khi gửi đi thì mã hoá nó, ko bao giờ gửi pw rõ
					login_data.pwd = hashPassword(uid, login_data.pwd, setting.my_salt);
					$.post(api, login_data, function (json) {
						if (json.salt) {
							setting.my_salt = json.salt;
							console.log("Lấy đc muối mới: " + json.salt)
						}
						show_captcha(json);
						if (json.ok) {
							show_user(json);
							//đóng hộp thoại login lại
							login_dialog.close();
							var content = 'Chào mừng ' + json.name +
								'<hr>Lần đăng nhập trước: ' + format_ss(json.diff) + '<br><i class="fa-regular fa-clock"></i> ' + json.lastLogin;
							var title = 'Đăng nhập thành công!';
							lib.toastr.tip('info', title, content);
							thong_bao(title, content, 'fa-solid fa-lock-open');
						} else {
							//GenerateSalt(); //sinh muối mới, ko cần nữa vì đã cho muối vào phản hồi login sai
							setting.my_salt = json.salt; //lấy muối mới dùng cho lần sumit sau
							bao_loi(json.msg, function () {
								var msg = json.msg.toLowerCase();
								if (msg.indexOf('captcha') >= 0) {
									$('#txt-captcha').focus();
								} else if (msg.indexOf('password') >= 0) {
									$('#pwd').focus();
								} else if (msg.indexOf('user') >= 0) {
									$('#uid').focus();
								}
							});
							setting.logined = false;
							//ko đc đóng login
						}
					}, 'json');
					return false; //ko đóng hộp thoại login lại
				}
			},
			close: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				btnClass: 'btn-danger',
				action: function () {
				}
			},
		},
		onContentReady: function () {
			fix_dialog();
		}
	})
}
export function bao_loi(msg, callback = null) {
	$.confirm({
		title: 'Báo lỗi',
		content: msg,
		icon: 'fa-solid fa-triangle-exclamation',
		type: 'red',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		autoClose: 'ok|3000',
		buttons: {
			ok: {
				text: '<i class="fa fa-circle-xmark"></i> OK',
				btnClass: 'btn-danger',
				keys: ['esc', 'enter'],
			}
		},
		onDestroy: function () {
			if (callback != null) callback()
		},
		onContentReady: function () {
			fix_dialog();
		}
	});
}
export function thong_bao(title, content, icon='fa-solid fa-lock-open') {
	$.confirm({
		title: title,
		content: content,
		icon: icon,
		columnClass: 's',
		type: 'blue',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		closeIcon: true,
		autoClose: 'ok|5000',
		buttons: {
			ok: {
				text: 'OK',
				keys: ['esc', 'enter'],
				btnClass: 'btn-info',
				action: function () {
					this.close();
				}
			}
		},
		onContentReady: function () {
			fix_dialog();
		}
	});
}
function logout_ok() {
	setting.logined = false;
	//clearInterval(lib.sensor.setting.timer_quick);
	//ẩn thông tin
	$('#user-info').html('');
	//ẩn nút logout
	$('.cmd-logout').addClass('no-display');
	$('.cmd-login').removeClass('no-display');
	localStorage.clear();
	lib.control.main();
	$('#noi-dung-chi-tiet').html('');
	do_login();
}
function do_logout() {

	$.confirm({
		title: 'Xác nhận ?',
		content: 'Xác nhận đăng xuất khỏi hệ thống?',
		icon: 'fa-solid fa-circle-question',
		type: 'red',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		autoClose: 'cancel|5000',
		buttons: {
			yes: {
				text: 'Yes',
				text: '<i class="fa-regular fa-circle-check"></i> Yes',
				btnClass: 'btn-danger',
				action: function () {
					$.post(api, { action: 'logout' }, function (json) {
						if (json.ok) {
							del_store("ck");
							logout_ok();
						}
					}, 'json');
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-primary',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			fix_dialog();
		}
	})

}
function check_logined() {
	$.post(api, {
		action: 'check_logined',
		fp: setting.fp
	}, function (json) {
		if (json.ok) {
			//đây chính là thông tin user hợp lệ
			show_user(json);
		} else {
			do_login();
		}
	}, 'json');
}
function load_fp(callback) {
	// Tải FingerprintJS
	FingerprintJS.load().then(fpm => {
		// Lấy fingerprint của trình duyệt
		fpm.get().then(json => {
			setting.fp = json.visitorId;
			setting.base64 = json.captcha ? json.captcha : null;
			callback();
		});
	});
}
function get_list_role() {
	var ok = false;
	var json_str = localStorage.getItem('get_list_role');
	if (json_str != null) {
		try {
			var json = JSON.parse(json_str);
			if (json.ok == 1) {
				setting.role = json.data;
				ok = true;
				console.log('load cache get_list_role');
			}
		} catch {
			ok = false;
		}
	}
	if (ok) return;//có rồi thì ko cần load
	$.post(api, { action: 'get_list_role' }, function (json) {
		if (json.ok) {
			localStorage.setItem('get_list_role', JSON.stringify(json));
			setting.role = json.data;
			console.log('load api get_list_role');
		}
	}, 'json');
}
function form_add_user(u = { uid: '', name: '', role: 1 }, option = { lock_uid: 0, hide_pw: 0, lock_name: 0, lock_role: 0 }) {
	var all_option_roles = '';
	for (var item of setting.role) {
		if (item.id < setting.user_info.role)
			if (item.id == u.role)
				all_option_roles += '<option value="' + item.id + '" selected>' + item.roleName + ' - ' + item.note + '</option>'
			else
				all_option_roles += '<option value="' + item.id + '">' + item.roleName + ' - ' + item.note + '</option>'
	}
	var html = `
			<div class="mb-3 mt-3">
			  <label for="nhap-uid" class="form-label">uid:</label>
			  <input type="text" class="form-control" id="nhap-uid" placeholder="Enter uid" value="${u.uid}" ${(option.lock_uid ? 'disabled' : '')}>
			</div>
			<div class="mb-3 mt-3 ${(option.hide_pw ? 'no-display' : '')}">
			  <label for="nhap-pwd" class="form-label">Password:</label>
			  <input type="password" class="form-control" id="nhap-pwd" placeholder="Enter Password">
			</div>
			<div class="mb-3 mt-3">
			  <label for="nhap-fullname" class="form-label">Fullname:</label>
			  <input type="text" class="form-control" id="nhap-fullname" placeholder="Enter Fullname" ${(option.lock_name ? 'disabled' : '')} value="${u.name}">
			</div>
			<div class="mb-3 mt-3">
			  <label for="nhap-role" class="form-label">Role:</label>
			  <select class="form-select" id="nhap-role" ${(option.lock_role ? 'disabled' : '')}>${all_option_roles}</select>
			</div>
			`;
	return html;
}
function add_user(dialog_papa) {
	function do_add_user() {
		var data = {
			action: 'add_user',
			uid: $('#nhap-uid').val(),
			pwd: $('#nhap-pwd').val(),
			name: $('#nhap-fullname').val(),
			role: $('#nhap-role').val()
		}
		data.uid = data.uid.trim().toLowerCase();
		if (data.uid == '') {
			bao_loi('Chưa nhập uid', function () { $('#nhap-uid').focus(); });
			return;
		}
		if (data.pwd == '') {
			bao_loi('Chưa nhập pwd', function () { $('#nhap-pwd').focus(); });
			return;
		}
		if (data.name == '') {
			bao_loi('Chưa nhập name', function () { $('#nhap-name').focus(); });
			return;
		}
		data.pwd = sha1(data.uid + data.pwd); //ko có muối
		$.post(api, data,
			function (json) {
				if (json.ok) {
					lib.toastr.tip('info', 'Thông báo', 'Đã add user thành công');
					get_list_user(dialog_papa); //tải lại ds user
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi khi add_user
				}
			}, 'json'
		);//end $.post
	}
	var dialog_add = $.confirm({
		title: 'Add user',
		icon: 'fa-solid fa-user-plus',
		type: 'blue',
		content: form_add_user(),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 's',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-user-plus"></i> Add',
				btnClass: 'btn-primary',
				action: function () {
					do_add_user();
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			fix_dialog();
		}
	});
}
function gen_html_list_user(json) {
	var html = '<div class="table-responsive-sm">' +
		'<table width="100%" class="table table-hover">' +
		'<thead><tr class="table-info">' +
		'<th class="text-center">STT</th>' +
		'<th>Username</th>' +
		'<th class="nowarp">Full name</th>' +
		'<th>Role</th>' +
		'<th class="nowarp">Last Login</th>' +
		'<th class="text-center">Relative</th>' +
		'<th class="text-begin">Action</th>' +
		'</tr></thead>' +
		'</thead><tbody>';
	if (json.ok) {
		if (json.data && json.data.length) {
			var stt = 0;
			for (var item of json.data) {
				var action = `
					<div class="dropdown">
					  <button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">
						Action ...
					  </button>
					  <ul class="dropdown-menu">
						<li><a href="#" class="dropdown-item cmd-action-user" data-action="edit" data-uid='${item.uid}'>Edit</a></li>
						<li><a href="#" class="dropdown-item cmd-action-user" data-action="set_pw" data-uid='${item.uid}'>Set Password</a></li>
						<li><a href="#" class="dropdown-item cmd-action-user" data-action="delete" data-uid='${item.uid}'>Delete User</a></li>
					  </ul>
					</div>
				`;
				html += '<tr>' +
					`<td  class="text-center" nowarp>${++stt}</td>` +
					`<td nowarp class="nowarp">${item.uid}</td>` +
					`<td nowarp class="nowarp">${item.name}</td>` +
					`<td nowarp class="nowarp">${item.roleName}</td>` +
					`<td nowarp class="nowarp">${item.lastLogin}</td>` +
					`<td class="nowarp" align="center" nowarp title="Last Login: ${item.lastLogin}">${format_ss(item.diff)}</td>` +
					`<td class="nowarp" nowarp>${action}</td>` +
					'</tr>';
			}
		}
	} else {
		html += '<tr class="table-warning"><td colspan="5">Không có dữ liệu</td></tr>';
	}
	html += '</tbody></table></div>';
	return html;
}
function edit_user(uid) {
	var u = setting.list_user.map[uid];
	if (u.role > setting.user_info.role) {
		bao_loi('Bạn không có quyền');
		return;
	}
	var dialog_edit_user = $.confirm({
		title: 'Edit User',
		icon: 'fa-solid fa-user-tag',
		type: 'blue',
		content: form_add_user(u, { lock_uid: 1, hide_pw: 1, lock_name: 0, lock_role: u.uid == setting.user_info.uid }),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 's',
		closeIcon: true,
		buttons: {
			update: {
				text: '<i class="fa-solid fa-user-tag"></i> Update',
				btnClass: 'btn-primary',
				action: function () {
					var data = {
						action: 'edit_user',
						uid: uid,
						name: $('#nhap-fullname').val(),
						role: $('#nhap-role').val()
					}
					if (data.name == '') {
						bao_loi('Chưa nhập name', function () { $('#nhap-name').focus(); });
						return false;
					}
					$.post(api, data, function (json) {
						if (json.ok) {
							lib.toastr.tip('info', 'Thông báo', json.msg + ': ' + uid);
							get_list_user(dialog_list_user);
							dialog_edit_user.close();
						} else bao_loi(json.msg);
					}, 'json');
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			$('#nhap-fullname').focus();
			fix_dialog();
		}
	});
}
function set_pw_user(uid) {
	var u = setting.list_user.map[uid];
	if (u.role > setting.user_info.role) {
		bao_loi('Bạn không có quyền');
		return;
	}
	var dialog_edit_user = $.confirm({
		title: 'Set password User',
		icon: 'fa-solid fa-user-tag',
		type: 'blue',
		content: form_add_user(u, { lock_uid: 1, hide_pw: 0, lock_name: 1, lock_role: 1 }),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 's',
		closeIcon: true,
		buttons: {
			set_pw: {
				text: '<i class="fa-solid fa-user-tag"></i> Update Password',
				btnClass: 'btn-primary',
				action: function () {
					var data = {
						action: 'edit_pwd_user',
						uid: uid,
						pwd: $('#nhap-pwd').val(),
					}
					data.uid = data.uid.trim().toLowerCase();

					if (data.pwd == '') {
						bao_loi('Chưa nhập pwd', function () { $('#nhap-pwd').focus(); });
						return;
					}

					data.pwd = sha1(data.uid + data.pwd); //ko có muối

					$.post(api, data, function (json) {
						if (json.ok) {
							lib.toastr.tip('info', 'Thông báo', json.msg + ': ' + uid);
							get_list_user(dialog_list_user);
							dialog_edit_user.close();
						} else bao_loi(json.msg);
					}, 'json');
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			$('#nhap-pwd').focus();
			fix_dialog();
		}
	});
}
function delete_user(uid) {
	var u = setting.list_user.map[uid];
	if (u.role > setting.user_info.role) {
		bao_loi('Bạn không có quyền');
		return;
	}
	if (u.uid == setting.user_info.uid) {
		bao_loi('Không được tự xoá!');
		return;
	}
	var dialog_delete_user = $.confirm({
		title: 'Xác nhận xoá user',
		icon: 'fa-solid fa-user-tag',
		type: 'red',
		content: `Xác nhận xoá user: <b>${u.uid}: ${u.name}</b> ?`,
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 's',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-user-tag"></i> Delete User',
				btnClass: 'btn-danger',
				action: function () {
					var data = { action: 'delete_user', uid: uid };
					$.post(api, data, function (json) {
						if (json.ok) {
							lib.toastr.tip('info', 'Thông báo', json.msg + ': ' + uid);
							get_list_user(dialog_list_user);
							dialog_delete_user.close();
						} else bao_loi(json.msg);
					}, 'json');
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-warning',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			$('#nhap-pwd').focus();
			fix_dialog();
		}
	});
}
function get_list_user(dialog) {
	$.post(api, { action: 'get_list_user', fp: setting.fp }, function (json) {
		if (json.ok) {
			setting.list_user = json
			setting.list_user.map = {}
			for (var u of json.data) setting.list_user.map[u.uid] = u;
			var content = gen_html_list_user(json);
			dialog.setContent(content);
			$('.cmd-action-user').click(function () {
				var action = $(this).data('action');
				var uid = $(this).data('uid');
				if (action == 'edit') edit_user(uid);
				if (action == 'set_pw') set_pw_user(uid);
				if (action == 'delete') delete_user(uid);
			});
		} else {
			dialog.setContent(json.msg);
		}
	}, 'json');
}
var dialog_list_user;
function show_list_user() {
	var content = 'Loading...'
	dialog_list_user = $.confirm({
		title: 'User Manager',
		icon: 'fa-solid fa-users',
		type: 'blue',
		animation: 'rotateXR',
		closeAnimation: 'rotateXR',
		animationBounce: 1.5,
		animateFromElement: false,
		content: function () {
			get_list_user(this);
		},
		closeIcon: true,
		columnClass: 'xl',
		buttons: {
			add: {
				text: '<i class="fa-solid fa-user-plus"></i> Add user',
				btnClass: 'btn-primary',
				action: function () {
					add_user(dialog_list_user);
					return false; //ko đóng
				}
			},
			close: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc'],
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			fix_dialog();
		},
	});
}
export function manager() {
	show_list_user();
}
export function main() {
	$('.cmd-login').click(function () { do_login(); });
	$('.cmd-logout').click(function () { do_logout(); });
	$('.logo').click(function () { logout_ok(); });

	load_fp(check_logined);
	get_list_role();
}