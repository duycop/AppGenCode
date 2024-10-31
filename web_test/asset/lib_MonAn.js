/* file: lib_MonAn.js */
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
	$.post(api, { action: 'MonAn_get_all' }, function (json) {
		var html = '';
		if (json.ok) {
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-view-log"><thead>' +
				'<tr class="table-info">' +
				'<th class="text-center">STT</th>' +
				'<th class="nowarp">Mã món ăn</th>' +
				'<th class="nowarp">Tên món</th>' +
				'<th class="nowarp">Đinh lượng (g)</th>' +
				'<th class="nowarp">Đơn giá bán</th>' +
				'<th class="nowarp">Loại món</th>' +
				'<th class="nowarp">Dinh dưỡng (calo)</th>' +
				'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				setting.data = json;
				setting.data['map'] = {};
				var stt = 0;
				for (var item of json.data) {
					setting.data.map[item.id] = item;
					var action = '<div class="dropdown">' +
						'<button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">' +
						'Action ...' +
						'</button>' +
						'<ul class="dropdown-menu">' +
						`<li><a href="#" class="dropdown-item cmd-action-MonAn" data-action="edit" data-id='${item.id}'>Edit MonAn</a></li>` +
						`<li><a href="#" class="dropdown-item cmd-action-MonAn" data-action="delete" data-id='${item.id}'>Delete MonAn</a></li>` +
						'</ul>' +
						'</div>';
					html += '<tr>' +
						`<td class="text-center nowarp">${++stt}</td>` +
						`<td class="nowarp">${item.id}</td>` +
						`<td class="nowarp">${item.tenMon}</td>` +
						`<td class="nowarp">${item.dinhLuong}</td>` +
						`<td class="nowarp">${item.DonGia}</td>` +
						`<td class="nowarp">${item.LoaiMon}</td>` +
						`<td class="nowarp">${item.DinhDuong}</td>` +
						`<td class="text-center nowarp">${action}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="8">KHÔNG CÓ DỮ LIỆU Món ăn</td>` +
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
function get_MonAn_content(dialog, cache = 0) {
	let tieu_de = 'Danh sách Món ăn';
	get_content(function (json, html) {
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Thông báo', 'Tải dữ liệu Món ăn thành công');
			lib.table.sort_table('#table-view-MonAn', tieu_de, 10);
			$('.cmd-action-MonAn').click(function () {
				var action = $(this).data('action');
				var id = $(this).data('id');
				if (action == 'edit') action_edit_MonAn(dialog, id);
				if (action == 'delete') action_delete_MonAn(dialog, id);
			});
		}
	}, cache);
}
export function show_MonAn() {
	var tieu_de = 'DANH SÁCH Món ăn';
	var dialog_log = $.confirm({
		title: tieu_de,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: 'Loading danh sách Món ăn...',
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
					get_MonAn_content(this);
					return false;
				}
			},
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add new',
				btnClass: 'btn-info',
				action: function () {
					action_addnew_MonAn(this);
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
			get_MonAn_content(this, 1);
		},
		onContentReady: function () {
			fix_dialog();
		},
	});
}
function action_addnew_MonAn(dialog_pp) {
	function form_add_MonAn() {
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-MonAn-id" for="input-MonAn-id" class="form-label">Mã món ăn</label>:
				<input type="text" class="form-control" id="input-MonAn-id" placeholder="Enter Mã món ăn" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-tenMon" for="input-MonAn-tenMon" class="form-label">Tên món</label>:
				<input type="text" class="form-control" id="input-MonAn-tenMon" placeholder="Enter Tên món" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-dinhLuong" for="input-MonAn-dinhLuong" class="form-label">Đinh lượng (g)</label>:
				<input type="text" class="form-control" id="input-MonAn-dinhLuong" placeholder="Enter Đinh lượng (g)" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-DonGia" for="input-MonAn-DonGia" class="form-label">Đơn giá bán</label>:
				<input type="text" class="form-control" id="input-MonAn-DonGia" placeholder="Enter Đơn giá bán" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-LoaiMon" for="input-MonAn-LoaiMon" class="form-label">Loại món</label>:
				<input type="text" class="form-control" id="input-MonAn-LoaiMon" placeholder="Enter Loại món" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-DinhDuong" for="input-MonAn-DinhDuong" class="form-label">Dinh dưỡng (calo)</label>:
				<input type="text" class="form-control" id="input-MonAn-DinhDuong" placeholder="Enter Dinh dưỡng (calo)" />
			</div>`;
		return html;
	}
	function submit_add_MonAn() {
		var data = {
			action: 'MonAn_insert',
			id: $('#input-MonAn-id').val(),
			tenMon: $('#input-MonAn-tenMon').val(),
			dinhLuong: $('#input-MonAn-dinhLuong').val(),
			DonGia: $('#input-MonAn-DonGia').val(),
			LoaiMon: $('#input-MonAn-LoaiMon').val(),
			DinhDuong: $('#input-MonAn-DinhDuong').val(),
		}
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-MonAn-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-MonAn-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã thêm Món ăn ${data.id} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_MonAn_content(dialog_pp); //tải lại ds
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post add
	}
	var dialog_add = $.confirm({
		title: 'Add Món ăn',
		icon: 'fa-solid fa-file-circle-plus',
		type: 'blue',
		content: form_add_MonAn(),
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
					submit_add_MonAn();
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
function action_edit_MonAn(dialog_pp, id) {
	function form_edit_MonAn(id) {
		var item = setting.data.map[id];
		var html = `
			<div class="mb-3 mt-3">
				<label id="label-MonAn-id" for="input-MonAn-id" class="form-label">Mã món ăn</label>:
				<input type="text" class="form-control" id="input-MonAn-id" placeholder="Enter Mã món ăn" value="${item.id}" readonly disabled />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-tenMon" for="input-MonAn-tenMon" class="form-label">Tên món</label>:
				<input type="text" class="form-control" id="input-MonAn-tenMon" placeholder="Enter Tên món" value="${item.tenMon}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-dinhLuong" for="input-MonAn-dinhLuong" class="form-label">Đinh lượng (g)</label>:
				<input type="text" class="form-control" id="input-MonAn-dinhLuong" placeholder="Enter Đinh lượng (g)" value="${item.dinhLuong}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-DonGia" for="input-MonAn-DonGia" class="form-label">Đơn giá bán</label>:
				<input type="text" class="form-control" id="input-MonAn-DonGia" placeholder="Enter Đơn giá bán" value="${item.DonGia}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-LoaiMon" for="input-MonAn-LoaiMon" class="form-label">Loại món</label>:
				<input type="text" class="form-control" id="input-MonAn-LoaiMon" placeholder="Enter Loại món" value="${item.LoaiMon}" />
			</div>
			<div class="mb-3 mt-3">
				<label id="label-MonAn-DinhDuong" for="input-MonAn-DinhDuong" class="form-label">Dinh dưỡng (calo)</label>:
				<input type="text" class="form-control" id="input-MonAn-DinhDuong" placeholder="Enter Dinh dưỡng (calo)" value="${item.DinhDuong}" />
			</div>`;
		return html;
	}
	function submit_edit_MonAn(dialog_edit) {
		var data = {
			action: 'MonAn_update',
			id: $('#input-MonAn-id').val(),
			tenMon: $('#input-MonAn-tenMon').val(),
			dinhLuong: $('#input-MonAn-dinhLuong').val(),
			DonGia: $('#input-MonAn-DonGia').val(),
			LoaiMon: $('#input-MonAn-LoaiMon').val(),
			DinhDuong: $('#input-MonAn-DinhDuong').val(),
		}
		data.id = id;
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-MonAn-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-MonAn-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã cập nhật Món ăn ${data.id} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_MonAn_content(dialog_pp); //tải lại ds
					dialog_edit.close(); //đóng thằng dialog_edit lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Edit Món ăn',
		icon: 'fa-solid fa-file-pen',
		type: 'blue',
		content: form_edit_MonAn(id),
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
					submit_edit_MonAn(this);
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
function action_delete_MonAn(dialog_pp, id) {
	function form_delete_MonAn(id) {
		var item = setting.data.map[id];
		var html = `Xác nhận xoá Món ăn: ${item.id} ?`;
		return html;
	}
	function submit_delete_MonAn(dialog_delete) {
		var data = {
			action: 'MonAn_delete',
			id: id
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã xoá Món ăn ${data.id} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get_MonAn_content(dialog_pp); //tải lại ds
					dialog_delete.close(); //đóng thằng dialog_delete lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Delete Món ăn',
		icon: 'fa-solid fa-trash',
		type: 'blue',
		content: form_delete_MonAn(id),
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
					submit_delete_MonAn(this);
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
/* kết thúc file: lib_MonAn.js */
