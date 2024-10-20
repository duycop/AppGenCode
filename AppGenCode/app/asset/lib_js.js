/* file: lib___TABLE_NAME__.js */
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
var js___TABLE_NAME__;
function get___TABLE_NAME___content(dialog) {
	let tieu_de = 'Danh sách __TABLE_TITLE__';
	$.post(api, { action: '__TABLE_NAME___get_all' }, function (json) {
		var html = '';
		if (json.ok) {
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-view-log"><thead>' +
				'<tr class="table-info">' +
				'<th class="text-center">STT</th>' +
__LIST_FIELDS_TH__
			'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				js___TABLE_NAME__ = json;
				js___TABLE_NAME__['map'] = {};
				var stt = 0;
				for (var item of json.data) {
					js___TABLE_NAME__.map[item.__primaryKey__] = item;
					var action = '<div class="dropdown">' +
						'<button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown">' +
						'Action ...' +
						'</button>' +
						'<ul class="dropdown-menu">' +
						`<li><a href="#" class="dropdown-item cmd-action-__TABLE_NAME__" data-action="edit" data-__primaryKey__='${item.__primaryKey__}'>Edit __TABLE_NAME__</a></li>` +
						`<li><a href="#" class="dropdown-item cmd-action-__TABLE_NAME__" data-action="delete" data-__primaryKey__='${item.__primaryKey__}'>Delete __TABLE_NAME__</a></li>` +
						'</ul>' +
						'</div>';
					html += '<tr>' +
						`<td class="text-center nowarp">${++stt}</td>` +
__LIST_FIELDS_TD__
							`<td class="text-center nowarp">${action}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="__COUNT_FIELDS__">KHÔNG CÓ DỮ LIỆU __TABLE_TITLE__</td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';

		} else html = json.msg;
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Thông báo', 'Tải dữ liệu __TABLE_TITLE__ thành công');
			lib.table.sort_table('#table-view-__TABLE_NAME__', tieu_de, 10);
			$('.cmd-action-__TABLE_NAME__').click(function () {
				var action = $(this).data('action');
				var __primaryKey__ = $(this).data('__primaryKey__');
				if (action == 'edit') action_edit___TABLE_NAME__(dialog, __primaryKey__);
				if (action == 'delete') action_delete___TABLE_NAME__(dialog, __primaryKey__);
			});
		}
	}, 'json')
}
export function show___TABLE_NAME__() {
	var tieu_de = 'DANH SÁCH __TABLE_NAME__';
	var dialog_log = $.confirm({
		title: tieu_de,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: 'Loading danh sách __TABLE_NAME__...',
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
					get___TABLE_NAME___content(this);
					return false;
				}
			},
			add: {
				text: '<i class="fa-solid fa-file-circle-plus"></i> Add new',
				btnClass: 'btn-info',
				action: function () {
					action_addnew___TABLE_NAME__(this);
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
			get___TABLE_NAME___content(this);
			fix_dialog();
		},
	});
}
function action_addnew___TABLE_NAME__(dialog_pp) {
	function form_add___TABLE_NAME__() {
		var html = `
__HTML_FORM_ADD__`;
		return html;
	}
	function submit_add___TABLE_NAME__() {
		var data = {
			action: '__TABLE_NAME___insert',
			__DATA_FORM_VAL__
		}
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-__TABLE_NAME__-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-__TABLE_NAME__-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã thêm __TABLE_TITLE__ ${data.__primaryKey__} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get___TABLE_NAME___content(dialog_pp); //tải lại ds
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post add
	}
	var dialog_add = $.confirm({
		title: 'Add __TABLE_TITLE__',
		icon: 'fa-solid fa-file-circle-plus',
		type: 'blue',
		content: form_add___TABLE_NAME__(),
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
					submit_add___TABLE_NAME__();
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
function action_edit___TABLE_NAME__(dialog_pp, __primaryKey__) {
	function form_edit___TABLE_NAME__(__primaryKey__) {
		var item = js___TABLE_NAME__.map[__primaryKey__];
		var html = `
__HTML_FORM_EDIT_VALUE__`;
		return html;
	}
	function submit_edit___TABLE_NAME__(dialog_edit) {
		var data = {
			action: '__TABLE_NAME___update',
__DATA_FORM_VAL__
		}
		data.__primaryKey__ = __primaryKey__;
		for (var item in data) {
			if (data[item] == '') {
				var label = $('#label-__TABLE_NAME__-' + item).html();
				bao_loi('Chưa nhập ' + label, function () { $('#input-__TABLE_NAME__-' + item).focus(); });
				return;
			}
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã cập nhật __TABLE_TITLE__ ${data.__primaryKey__} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get___TABLE_NAME___content(dialog_pp); //tải lại ds
					dialog_edit.close(); //đóng thằng dialog_edit lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Edit __TABLE_TITLE__',
		icon: 'fa-solid fa-file-pen',
		type: 'blue',
		content: form_edit___TABLE_NAME__(__primaryKey__),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-file-pen"></i> Edit',
				btnClass: 'btn-primary',
				action: function () {
					submit_edit___TABLE_NAME__(this);
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
function action_delete___TABLE_NAME__(dialog_pp, __primaryKey__) {
	function form_delete___TABLE_NAME__(__primaryKey__) {
		var item = js___TABLE_NAME__.map[__primaryKey__];
		var html = `Xác nhận xoá __TABLE_TITLE__: ${item.__primaryKey__} ?`;
		return html;
	}
	function submit_delete___TABLE_NAME__(dialog_delete) {
		var data = {
			action: '__TABLE_NAME___delete',
			__primaryKey__: __primaryKey__
		}
		$.post(api, data,
			function (json) {
				if (json.ok) {
					var msg = `Đã xoá __TABLE_TITLE__ ${data.__primaryKey__} thành công`;
					lib.toastr.tip('info', 'Thông báo', msg);
					thong_bao('Thông báo', msg);
					get___TABLE_NAME___content(dialog_pp); //tải lại ds
					dialog_delete.close(); //đóng thằng dialog_delete lại
				} else {
					bao_loi(json.msg);//báo lỗi 
				}
			}, 'json'
		);//end $.post
	}
	$.confirm({
		title: 'Delete __TABLE_TITLE__',
		icon: 'fa-solid fa-trash',
		type: 'blue',
		content: form_delete___TABLE_NAME__(__primaryKey__),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		columnClass: 'm',
		closeIcon: true,
		buttons: {
			add: {
				text: '<i class="fa-solid fa-trash"></i> Delete',
				btnClass: 'btn-primary',
				action: function () {
					submit_delete___TABLE_NAME__(this);
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
/* kết thúc file: lib___TABLE_NAME__.js */