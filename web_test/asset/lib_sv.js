'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api/';
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
export function main() {
	//init
}
function bao_loi(msg, callback = null) {
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
				action: function () {
					this.close();
				}
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
function thong_bao(title, content) {
	$.confirm({
		title: title,
		content: content,
		icon: 'fa-regular fa-circle-check',
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
var js_sv;
function get_sv_content(dialog) {
	let tieu_de = 'Danh sách sv';
	$.post(api, { action: 'sv_get_all' }, function (json) {
		var html = '';
		if (json.ok) {
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-view-log"><thead>' +
				'<tr class="table-info">' +
				'<th class="text-center">STT</th>' +
				'<th class="nowarp">Mã sinh viên</th>' +
				'<th class="nowarp">Họ và tên</th>' +
				'<th class="nowarp">Quê Quán</th>' +
				'<th class="nowarp">Tiền Lương</th>' +
				'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				js_sv = json;
				js_sv['map'] = {};
				var stt = 0;
				for (var item of json.data) {
					js_sv.map[item.masv] = item;
					var action = '<div class="dropdown">' +
						'<button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">' +
						'Action ...' +
						'</button>' +
						'<ul class="dropdown-menu">' +
						`<li><a href="#" class="dropdown-item cmd-action-sv" data-action="edit" data-masv='${item.masv}'>Edit sv</a></li>` +
						`<li><a href="#" class="dropdown-item cmd-action-sv" data-action="delete" data-masv='${item.masv}'>Delete sv</a></li>` +
						'</ul>' +
						'</div>';
					html += '<tr>' +
						`<td class="text-center nowarp">${++stt}</td>` +
						`<td class="nowarp">${item.masv}</td>` +
						`<td class="nowarp">${item.hoten}</td>` +
						`<td class="nowarp">${item.qq}</td>` +
						`<td class="nowarp">${item.tien}</td>` +
						`<td class="text-center nowarp">${action}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="6">KHÔNG CÓ DỮ LIỆU sv</td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';

		} else html = json.msg;
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Thông báo', 'Tải dữ liệu sv thành công');
			lib.table.sort_table('#table-view-sv', tieu_de, 10);
			$('.cmd-action-sv').click(function () {
				var action = $(this).data('action');
				var masv = $(this).data('masv');
				if (action == 'edit') action_edit_sv(dialog, masv);
				if (action == 'delete') action_delete_sv(dialog, masv);
			});
		}
	}, 'json')
}
export function show_sv() {
	var tieu_de = 'DANH SÁCH sv';
	var dialog_log = $.confirm({
		title: tieu_de,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: 'Loading danh sách sv...',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		typeAnimated: false,
		closeIcon: true,
		columnClass: 'xl',
		buttons: {
			reload: {
				text: '<i class="fa fa-clock-rotate-left"></i> Reload',
				btnClass: 'btn-info',
				action: function () {
					get_sv_content(this);
					return false;
				}
			},
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add new',
				btnClass: 'btn-info',
				action: function () {
					action_addnew_sv(this);
					return false;
				}
			},
			close: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc'],
				btnClass: 'btn-danger',
				action: function () {
					this.close();
				}
			}
		},
		onContentReady: function () {
			get_sv_content(this);
			fix_dialog();
		},
	});
}
function action_addnew_sv(dialog_pp) {
	function form_add_sv() {
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-sv-masv" for="input-sv-masv" class="form-label">Mã sinh viên</label>:
				<input type="text" class="form-control" id="input-sv-masv" placeholder="Enter Mã sinh viên" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-hoten" for="input-sv-hoten" class="form-label">Họ và tên</label>:
				<input type="text" class="form-control" id="input-sv-hoten" placeholder="Enter Họ và tên" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-qq" for="input-sv-qq" class="form-label">Quê Quán</label>:
				<input type="text" class="form-control" id="input-sv-qq" placeholder="Enter Quê Quán" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-tien" for="input-sv-tien" class="form-label">Tiền Lương</label>:
				<input type="text" class="form-control" id="input-sv-tien" placeholder="Enter Tiền Lương" />
			</div>`;
		return html;
	}
	function submit_add_sv() {
		var data = {
			action: 'sv_insert',
			masv: $('#input-sv-masv').val(),
			hoten: $('#input-sv-hoten').val(),
			qq: $('#input-sv-qq').val(),
			tien: $('#input-sv-tien').val(),
		}
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-sv-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-sv-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã thêm sv ${data.masv} - ${data.hoten} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_sv_content(dialog_pp); //tải lại ds
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post add
	}
	var dialog_add = $.confirm({
		title: 'Add sv',
		icon: 'fa-solid fa-file-circle-plus',
		type: 'blue',
		content: form_add_sv(),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add',
				btnClass: 'btn-primary',
				action: function () {
					submit_add_sv();
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
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
function action_edit_sv(dialog_pp, masv) {
	function form_edit_sv(masv) {
		var item = js_sv.map[masv];
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-sv-masv" for="input-sv-masv" class="form-label">Mã sinh viên</label>:
				<input type="text" class="form-control" id="input-sv-masv" placeholder="Enter Mã sinh viên" value="${item.masv}" readonly disabled />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-hoten" for="input-sv-hoten" class="form-label">Họ và tên</label>:
				<input type="text" class="form-control" id="input-sv-hoten" placeholder="Enter Họ và tên" value="${item.hoten}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-qq" for="input-sv-qq" class="form-label">Quê Quán</label>:
				<input type="text" class="form-control" id="input-sv-qq" placeholder="Enter Quê Quán" value="${item.qq}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-sv-tien" for="input-sv-tien" class="form-label">Tiền Lương</label>:
				<input type="text" class="form-control" id="input-sv-tien" placeholder="Enter Tiền Lương" value="${item.tien}" />
			</div>`;
		return html;
	}
	function submit_edit_sv(dialog_edit) {
		var data = {
			action: 'sv_update',
			masv: $('#input-sv-masv').val(),
			hoten: $('#input-sv-hoten').val(),
			qq: $('#input-sv-qq').val(),
			tien: $('#input-sv-tien').val(),
		}
		data.masv = masv;
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-sv-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-sv-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã cập nhật sv ${data.masv} - ${data.hoten} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_sv_content(dialog_pp); //tải lại ds
					dialog_edit.close(); //đóng thằng dialog_edit lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Edit sv',
		icon: 'fa-solid fa-file-pen',
		type: 'blue',
		content: form_edit_sv(masv),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-file-pen"></i> Edit sv',
				btnClass: 'btn-primary',
				action: function () {
					submit_edit_sv(this);
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
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
function action_delete_sv(dialog_pp, masv) {
	function form_delete_sv(masv) {
		var item = js_sv.map[masv];
		var html = `Xác nhận xoá sv: ${item.masv} ?`;
		return html;
	}
	function submit_delete_sv(dialog_delete) {
		var item = js_sv.map[masv];
		var data = {
			action: 'sv_delete',
			masv: masv
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã xoá sv ${data.masv} - ${item.hoten} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_sv_content(dialog_pp); //tải lại ds
					dialog_delete.close(); //đóng thằng dialog_delete lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Delete sv',
		icon: 'fa-solid fa-trash',
		type: 'blue',
		content: form_delete_sv(masv),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-trash"></i> Delete sv',
				btnClass: 'btn-primary',
				action: function () {
					submit_delete_sv(this);
					return false; //ko đóng
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Cancel',
				btnClass: 'btn-danger',
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

// Kết thúc lib_sv.js
