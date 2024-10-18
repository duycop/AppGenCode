'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api.aspx';

export const setting = {
	item_per_row: 3,
	buttons: {
		user: {
			name: '<i class="fa-solid fa-user"></i> Users',
			title: 'Quản lý user',
			class: 'btn btn-primary cmd-man-user',
			action: function (dialog, item) {
				if (lib.user.setting.user_info.role <= 1) {
					lib.user.bao_loi("Bạn không có quyền");
					return;
				}
				//dialog.close();
				lib.user.manager();
			}
		},
		setting: {
			name: '<i class="fa-solid fa-gear"></i> Setting',
			title: 'Quản lý cấu hình',
			class: 'btn btn-info cmd-man-setting',
			action: function (dialog, item) {
				if (lib.user.setting.user_info.role <= 1) {
					lib.user.bao_loi("Bạn không có quyền");
					return;
				}
				//dialog.close();
				lib.load('setting', function () {
					lib.setting.manager();
				});
			}
		},

		log: {
			name: '<i class="fa-solid fa-clock-rotate-left"></i> Log',
			title: 'Xem log hệ thống',
			class: 'btn btn-warning cmd-man-log',
			action: function (dialog, item) {
				if (lib.user.setting.user_info.role <= 1) {
					lib.user.bao_loi("Bạn không có quyền");
					return;
				}
				//dialog.close();
				lib.load('log', function () {
					lib.log.show_log();
				});
			}
		},
		excel: {
			name: '<i class="fa-solid fa-file-arrow-down"></i> Export Excel',
			title: 'Xuất dữ liệu excel',
			class: 'btn btn-primary cmd-export-excel',
			action: function (dialog, item) {
				if (lib.user.setting.user_info.role <= 1) {
					lib.user.bao_loi("Bạn không có quyền");
					return;
				}
				dialog.close();
				lib.load('excel', function () {
					lib.excel.show_dialog_export();
				});
			}
		},
		dieukhien: {
			name: '<i class="fa-solid fa-gamepad"></i> Control',
			title: 'Điều khiển',
			class: 'btn btn-danger cmd-control-coil',
			action: function (dialog, item) {
				//dialog.close();
				if (lib.user.setting.user_info.role <= 1) {
					lib.user.bao_loi("Bạn không có quyền");
					return;
				}
				lib.load('dieukhien', function () {
					lib.dieukhien.show_dialog_dieukhien();
				});
				return false;
			}
		}
	}
};

function show_control_panel() {
	function get_content() {
		function gen_button(key) {
			var item = setting.buttons[key];
			var title = item.title || '';
			return `<td align="center" class="space"><div class="d-grid"><button class="${item.class}" title="${title}" data-key="${key}">${item.name}</button></div></td>`;
		}
		var content = '<div class="table-responsive-sm"><table width="100%" class="table table-sm table-borderless table-control-panel"><tbody><tr>';
		var stt = 0;
		for (var key in setting.buttons) {
			content += gen_button(key);
			stt++;
			if (stt % setting.item_per_row == 0) {
				content += '</tr><tr>';
			}
		}
		content += '</tr><tbody></table></div>';
		content = content.replace('<tr></tr>', '');
		return content;
	}
	var dialog_control = $.confirm({
		title: 'CONTROL PANEL',
		icon: 'fa-solid fa-gear',
		type: 'blue',
		content: get_content(),
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		typeAnimated: false,
		closeIcon: true,
		columnClass: 'm',
		buttons: {
			ok: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc', 'enter'],
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			for (var key in setting.buttons) {
				var item = setting.buttons[key];
				var selector = 'button.' + item.class.replaceAll(' ', '.');
				$(selector).unbind('click');
				$(selector).click(function () {
					var key = $(this).data('key')
					var item = setting.buttons[key];
					item.action(dialog_control, item);
				});
			}
		},
	});
}
function show_control_button(ok) {
	if (ok) {
		$('.cmd-control-panel').removeClass('no-display').unbind('click').click(function () {
			if (lib.user.setting.user_info.role <= 1) {
				lib.user.bao_loi("Bạn không có quyền");
				return;
			}
			show_control_panel();
		})
	} else {
		$('.cmd-control-panel').addClass('no-display');
	}
}
export function main() {
	show_control_button(lib.user.setting.logined);
}