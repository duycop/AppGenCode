﻿/* file: lib_Phong.js */
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
		scrollToPreviousElement: false,
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
		scrollToPreviousElement: false,
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
	$.post(api, { action: 'Phong_get_all' }, function (json) {
		var html = '';
		if (json.ok) {
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-view-Phong"><thead>' +
				'<tr class="table-info">' +
				'<th class="text-center">STT</th>' +
				'<th class="nowarp">Số phòng</th>' +
				'<th class="nowarp">Tên Phòng</th>' +
				'<th class="nowarp">Số giường</th>' +
				'<th class="nowarp">Giá tiền</th>' +
				'<th class="nowarp">Dãy nhà</th>' +
				'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				setting.data = json;
				setting.data['map'] = {};
				var stt = 0;
				for (var item of json.data) {
					setting.data.map[item.maPhong] = item;
					var action = '<div class="dropdown">' +
						'<button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">' +
						'Action ...' +
						'</button>' +
						'<ul class="dropdown-menu">' +
						`<li><a href="#" class="dropdown-item cmd-action-Phong" data-action="edit" data-maPhong='${item.maPhong}'>Edit Phong</a></li>` +
						`<li><a href="#" class="dropdown-item cmd-action-Phong" data-action="delete" data-maPhong='${item.maPhong}'>Delete Phong</a></li>` +
						'</ul>' +
						'</div>';
					html += '<tr>' +
						`<td class="text-center nowarp">${++stt}</td>` +
						`<td class="nowarp">${item.maPhong}</td>` +
						`<td class="nowarp">${item.TenPhong}</td>` +
						`<td class="nowarp">${item.SoGiuong}</td>` +
						`<td class="nowarp">${item.GiaTien}</td>` +
						`<td class="nowarp">${item.DayNha}</td>` +
						`<td class="text-center nowarp">${action}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="7">KHÔNG CÓ DỮ LIỆU Phòng KTX</td>` +
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
function get_Phong_content(dialog, cache = 0) {
	let tieu_de = 'Danh sách Phòng KTX';
	get_content(function (json, html) {
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Thông báo', 'Tải dữ liệu Phòng KTX thành công');
			lib.table.sort_table('#table-view-Phong', tieu_de, 10);

			$('#table-view-Phong tbody').on('click', '.cmd-action-Phong', function () {
				var action = $(this).data('action');
				var maPhong = $(this).data('maphong');
				if (action == 'edit') action_edit_Phong(dialog, maPhong);
				if (action == 'delete') action_delete_Phong(dialog, maPhong);
			});
		}
	}, cache);
}
export function show_Phong() {
	var tieu_de = 'DANH SÁCH Phòng KTX';
	var dialog_log = $.confirm({
		title: tieu_de,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: 'Loading danh sách Phòng KTX...',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		typeAnimated: false,
		closeIcon: true,
		columnClass: 'xl',
		scrollToPreviousElement: false,
		buttons: {
			reload: {
				text: '<i class="fa fa-clock-rotate-left"></i> Reload',
				btnClass: 'btn-info',
				action: function () {
					get_Phong_content(this);
					return false;
				}
			},
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add new',
				btnClass: 'btn-info',
				action: function () {
					action_addnew_Phong(this);
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
			get_Phong_content(this, 1);
		},
		onContentReady: function () {
			fix_dialog();
		},
	});
}
function action_addnew_Phong(dialog_pp) {
	function form_add_Phong() {
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-Phong-maPhong" for="input-Phong-maPhong" class="form-label">Số phòng</label>:
				<input type="text" class="form-control" id="input-Phong-maPhong" placeholder="Enter Số phòng" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-TenPhong" for="input-Phong-TenPhong" class="form-label">Tên Phòng</label>:
				<input type="text" class="form-control" id="input-Phong-TenPhong" placeholder="Enter Tên Phòng" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-SoGiuong" for="input-Phong-SoGiuong" class="form-label">Số giường</label>:
				<input type="text" class="form-control" id="input-Phong-SoGiuong" placeholder="Enter Số giường" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-GiaTien" for="input-Phong-GiaTien" class="form-label">Giá tiền</label>:
				<input type="text" class="form-control" id="input-Phong-GiaTien" placeholder="Enter Giá tiền" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-DayNha" for="input-Phong-DayNha" class="form-label">Dãy nhà</label>:
				<input type="text" class="form-control" id="input-Phong-DayNha" placeholder="Enter Dãy nhà" />
			</div>`;
		return html;
	}
	function submit_add_Phong() {
		var data = {
			action: 'Phong_insert',
			maPhong: $('#input-Phong-maPhong').val(),
			TenPhong: $('#input-Phong-TenPhong').val(),
			SoGiuong: $('#input-Phong-SoGiuong').val(),
			GiaTien: $('#input-Phong-GiaTien').val(),
			DayNha: $('#input-Phong-DayNha').val(),
		}
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-Phong-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-Phong-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã thêm Phòng KTX ${data.maPhong} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_Phong_content(dialog_pp); //tải lại ds
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post add
	}
	var dialog_add = $.confirm({
		title: 'Add Phòng KTX',
		icon: 'fa-solid fa-file-circle-plus',
		type: 'blue',
		content: form_add_Phong(),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		scrollToPreviousElement: false,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add',
				btnClass: 'btn-primary',
				action: function () {
					submit_add_Phong();
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
function action_edit_Phong(dialog_pp, maPhong) {
	function form_edit_Phong(maPhong) {
		var item = setting.data.map[maPhong];
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-Phong-maPhong" for="input-Phong-maPhong" class="form-label">Số phòng</label>:
				<input type="text" class="form-control" id="input-Phong-maPhong" placeholder="Enter Số phòng" value="${item.maPhong}" readonly disabled />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-TenPhong" for="input-Phong-TenPhong" class="form-label">Tên Phòng</label>:
				<input type="text" class="form-control" id="input-Phong-TenPhong" placeholder="Enter Tên Phòng" value="${item.TenPhong}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-SoGiuong" for="input-Phong-SoGiuong" class="form-label">Số giường</label>:
				<input type="text" class="form-control" id="input-Phong-SoGiuong" placeholder="Enter Số giường" value="${item.SoGiuong}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-GiaTien" for="input-Phong-GiaTien" class="form-label">Giá tiền</label>:
				<input type="text" class="form-control" id="input-Phong-GiaTien" placeholder="Enter Giá tiền" value="${item.GiaTien}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-Phong-DayNha" for="input-Phong-DayNha" class="form-label">Dãy nhà</label>:
				<input type="text" class="form-control" id="input-Phong-DayNha" placeholder="Enter Dãy nhà" value="${item.DayNha}" />
			</div>`;
		return html;
	}
	function submit_edit_Phong(dialog_edit) {
		var data = {
			action: 'Phong_update',
			maPhong: $('#input-Phong-maPhong').val(),
			TenPhong: $('#input-Phong-TenPhong').val(),
			SoGiuong: $('#input-Phong-SoGiuong').val(),
			GiaTien: $('#input-Phong-GiaTien').val(),
			DayNha: $('#input-Phong-DayNha').val(),
		}
		data.maPhong = maPhong;
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-Phong-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-Phong-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã cập nhật Phòng KTX ${data.maPhong} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_Phong_content(dialog_pp); //tải lại ds
					dialog_edit.close(); //đóng thằng dialog_edit lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Edit Phòng KTX',
		icon: 'fa-solid fa-file-pen',
		type: 'blue',
		content: form_edit_Phong(maPhong),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		scrollToPreviousElement: false,
		buttons: {
			edit: {
				text: '<i class="fa-solid fa-file-pen"></i> Edit',
				btnClass: 'btn-primary',
				action: function () {
					submit_edit_Phong(this);
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
function action_delete_Phong(dialog_pp, maPhong) {
	function form_delete_Phong(maPhong) {
		var item = setting.data.map[maPhong];
		var html = `Xác nhận xoá Phòng KTX: ${item.maPhong} ?`;
		return html;
	}
	function submit_delete_Phong(dialog_delete) {
		var data = {
			action: 'Phong_delete',
			maPhong: maPhong
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã xoá Phòng KTX ${data.maPhong} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_Phong_content(dialog_pp); //tải lại ds
					dialog_delete.close(); //đóng thằng dialog_delete lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Delete Phòng KTX',
		icon: 'fa-solid fa-trash',
		type: 'blue',
		content: form_delete_Phong(maPhong),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		scrollToPreviousElement: false,
		buttons: {
			delete: {
				text: '<i class="fa-solid fa-trash"></i> Delete',
				btnClass: 'btn-primary',
				action: function () {
					submit_delete_Phong(this);
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
/* kết thúc file: lib_Phong.js */
