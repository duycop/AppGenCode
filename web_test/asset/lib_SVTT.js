/* file: lib_SVTT.js */
'use strict';
let lib = {};
export function set_lib(L) { lib = L; }
export const setting = { data: null }
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
export function get_content(callback = null, cache = 0) {
	if (cache && setting.data && callback) {
		callback(setting.data, setting.html_get_all)
	}
	$.post(api, { action: 'SVTT_get_all' }, function (json) {
		var html = '';
		if (json.ok) {
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-view-log"><thead>' +
				'<tr class="table-info">' +
				'<th class="text-center">STT</th>' +
				'<th class="nowarp">Mã Sinh Viên</th>' +
				'<th class="nowarp">Họ tên sv</th>' +
				'<th class="nowarp">Lớp</th>' +
				'<th class="nowarp">Quê quán</th>' +
				'<th class="nowarp">Điểm Trung Bình</th>' +
				'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				setting.data = json;
				setting.data['map'] = {};
				var stt = 0;
				for (var item of json.data) {
					setting.data.map[item.masv] = item;
					var action = '<div class="dropdown">' +
						'<button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">' +
						'Action ...' +
						'</button>' +
						'<ul class="dropdown-menu">' +
						`<li><a href="#" class="dropdown-item cmd-action-SVTT" data-action="edit" data-masv='${item.masv}'>Edit SVTT</a></li>` +
						`<li><a href="#" class="dropdown-item cmd-action-SVTT" data-action="delete" data-masv='${item.masv}'>Delete SVTT</a></li>` +
						'</ul>' +
						'</div>';
					html += '<tr>' +
						`<td class="text-center nowarp">${++stt}</td>` +
						`<td class="nowarp">${item.masv}</td>` +
						`<td class="nowarp">${item.hoten}</td>` +
						`<td class="nowarp">${item.lop}</td>` +
						`<td class="nowarp">${item.qq}</td>` +
						`<td class="nowarp">${item.diem}</td>` +
						`<td class="text-center nowarp">${action}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="7">KHÔNG CÓ DỮ LIỆU  </td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';

		} else html = json.msg;

		setting.html_get_all = html;
		if (callback != null) {
			callback(json, html);
		}
	}, 'json');
}
function get_SVTT_content(dialog, cache = 0) {
	let tieu_de = 'Danh sách  ';
	get_content(function (json, html) {
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Thông báo', 'Tải dữ liệu   thành công');
			lib.table.sort_table('#table-view-SVTT', tieu_de, 10);
			$('.cmd-action-SVTT').click(function () {
				var action = $(this).data('action');
				var masv = $(this).data('masv');
				if (action == 'edit') action_edit_SVTT(dialog, masv);
				if (action == 'delete') action_delete_SVTT(dialog, masv);
			});
		}
	}, cache);
}
export function show_SVTT() {
	var tieu_de = 'DANH SÁCH  ';
	var dialog_log = $.confirm({
		title: tieu_de,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: 'Loading danh sách  ...',
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
					get_SVTT_content(this);
					return false;
				}
			},
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add new',
				btnClass: 'btn-info',
				action: function () {
					action_addnew_SVTT(this);
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
		onOpenBefore: function () {
			get_SVTT_content(this, 1);
		},
		onContentReady: function () {
			fix_dialog();
		},
	});
}
function action_addnew_SVTT(dialog_pp) {
	function form_add_SVTT() {
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-SVTT-masv" for="input-SVTT-masv" class="form-label">Mã Sinh Viên</label>:
				<input type="text" class="form-control" id="input-SVTT-masv" placeholder="Enter Mã Sinh Viên" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-hoten" for="input-SVTT-hoten" class="form-label">Họ tên sv</label>:
				<input type="text" class="form-control" id="input-SVTT-hoten" placeholder="Enter Họ tên sv" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-lop" for="input-SVTT-lop" class="form-label">Lớp</label>:
				<input type="text" class="form-control" id="input-SVTT-lop" placeholder="Enter Lớp" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-qq" for="input-SVTT-qq" class="form-label">Quê quán</label>:
				<input type="text" class="form-control" id="input-SVTT-qq" placeholder="Enter Quê quán" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-diem" for="input-SVTT-diem" class="form-label">Điểm Trung Bình</label>:
				<input type="text" class="form-control" id="input-SVTT-diem" placeholder="Enter Điểm Trung Bình" />
			</div>`;
		return html;
	}
	function submit_add_SVTT() {
		var data = {
			action: 'SVTT_insert',
			masv: $('#input-SVTT-masv').val(),
			hoten: $('#input-SVTT-hoten').val(),
			lop: $('#input-SVTT-lop').val(),
			qq: $('#input-SVTT-qq').val(),
			diem: $('#input-SVTT-diem').val(),
		}
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-SVTT-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-SVTT-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã thêm   ${data.masv} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_SVTT_content(dialog_pp); //tải lại ds
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post add
	}
	var dialog_add = $.confirm({
		title: 'Add  ',
		icon: 'fa-solid fa-file-circle-plus',
		type: 'blue',
		content: form_add_SVTT(),
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
					submit_add_SVTT();
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
function action_edit_SVTT(dialog_pp, masv) {
	function form_edit_SVTT(masv) {
		var item = setting.data.map[masv];
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-SVTT-masv" for="input-SVTT-masv" class="form-label">Mã Sinh Viên</label>:
				<input type="text" class="form-control" id="input-SVTT-masv" placeholder="Enter Mã Sinh Viên" value="${item.masv}" readonly disabled />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-hoten" for="input-SVTT-hoten" class="form-label">Họ tên sv</label>:
				<input type="text" class="form-control" id="input-SVTT-hoten" placeholder="Enter Họ tên sv" value="${item.hoten}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-lop" for="input-SVTT-lop" class="form-label">Lớp</label>:
				<input type="text" class="form-control" id="input-SVTT-lop" placeholder="Enter Lớp" value="${item.lop}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-qq" for="input-SVTT-qq" class="form-label">Quê quán</label>:
				<input type="text" class="form-control" id="input-SVTT-qq" placeholder="Enter Quê quán" value="${item.qq}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-SVTT-diem" for="input-SVTT-diem" class="form-label">Điểm Trung Bình</label>:
				<input type="text" class="form-control" id="input-SVTT-diem" placeholder="Enter Điểm Trung Bình" value="${item.diem}" />
			</div>`;
		return html;
	}
	function submit_edit_SVTT(dialog_edit) {
		var data = {
			action: 'SVTT_update',
			masv: $('#input-SVTT-masv').val(),
			hoten: $('#input-SVTT-hoten').val(),
			lop: $('#input-SVTT-lop').val(),
			qq: $('#input-SVTT-qq').val(),
			diem: $('#input-SVTT-diem').val(),
		}
		data.masv = masv;
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-SVTT-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-SVTT-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã cập nhật   ${data.masv} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_SVTT_content(dialog_pp); //tải lại ds
					dialog_edit.close(); //đóng thằng dialog_edit lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Edit  ',
		icon: 'fa-solid fa-file-pen',
		type: 'blue',
		content: form_edit_SVTT(masv),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			edit: {
				text: '<i class="fa-solid fa-file-pen"></i> Edit',
				btnClass: 'btn-primary',
				action: function () {
					submit_edit_SVTT(this);
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
function action_delete_SVTT(dialog_pp, masv) {
	function form_delete_SVTT(masv) {
		var item = setting.data.map[masv];
		var html = `Xác nhận xoá  : ${item.masv} ?`;
		return html;
	}
	function submit_delete_SVTT(dialog_delete) {
		var data = {
			action: 'SVTT_delete',
			masv: masv
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã xoá   ${data.masv} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_SVTT_content(dialog_pp); //tải lại ds
					dialog_delete.close(); //đóng thằng dialog_delete lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Delete  ',
		icon: 'fa-solid fa-trash',
		type: 'blue',
		content: form_delete_SVTT(masv),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			delete: {
				text: '<i class="fa-solid fa-trash"></i> Delete',
				btnClass: 'btn-primary',
				action: function () {
					submit_delete_SVTT(this);
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
/* kết thúc file: lib_SVTT.js */
