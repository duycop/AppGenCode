'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api.aspx';
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
export function main() {
	//init
}
function get___TABLE_NAME___content(dialog) {
	let tieu_de = 'Danh sách __TABLE_NAME__';
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
				var stt = 0;
				for (var item of json.data) {
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
					`<td colspan="__COUNT_FIELDS__">KHÔNG CÓ DỮ LIỆU __TABLE_NAME__</td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';
		} else html = json.msg;
		dialog.setContent(html);
		if (json.ok) {
			lib.toastr.tip('info', 'Tải dữ liệu __TABLE_NAME__ thành công', '^_^');
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
__HTML_FORM_INPUT__`;
		return html;
	}
	function submit_add___TABLE_NAME__() {
		var data = {
			action: '__TABLE_NAME___insert',
__DATA_FORM_VAL__
		}
		for (var item in data) {
			//if (data.uid == '') {
			//	bao_loi('Chưa nhập uid', function () { $('#nhap-uid').focus(); });
			//	return;
			//}
			console.log(item);
		}
		return;
		$.post(api, data,
			function (json) {
				if (json.ok) {
					lib.toastr.tip('info', 'Thông báo', 'Đã add __TABLE_NAME__ thành công');
					get___TABLE_NAME___content(dialog_pp); //tải lại ds __TABLE_NAME__
					dialog_add.close(); //đóng thằng dialog_add lại
				} else {
					bao_loi(json.msg);//báo lỗi khi add_user
				}
			}, 'json'
		);//end $.post

	}
	var dialog_add = $.confirm({
		title: 'Add __TABLE_NAME__',
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
	alert('edit code here for edit '+__primaryKey__)
}
function action_delete___TABLE_NAME__(dialog_pp, __primaryKey__) {
	alert('edit code here for delete ' + __primaryKey__)
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