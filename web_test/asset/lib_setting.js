'use strict';
let lib = {};
export function set_lib(L) { lib = L; }
export const setting = {};

const api = '/api.aspx';
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
var dialog_setting;
function get_setting_content(dialog) {
	$.post(api, { action: 'get_setting' }, function (json) {
		var html = '';
		if (json.ok) {
			setting.data = json.data;
			setting.map = {};
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover"><thead>' +
				'<tr class="table-info">' +
					'<th class="text-center">STT</th>' +
					//'<th class="text-center">ID</th>' +
					'<th>Name</th>' +
					'<th>Type</th>' +
					'<th>Value</th>' +
					'<th class="text-center">Last&nbsp;change</th>' +
					'<th class="text-center">Action</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				var stt = 0;
				for (var item of json.data) {
					setting.map[item.id] = item;
					var button = `<button class='btn btn-sm btn-warning cmd-change-setting' data-sid="${item.id}">Change</button>`;
					html += '<tr>' +
						`<td class="text-center">${++stt}</td>` +
						//`<td class="text-center">${item.id}</td>` +
						`<td class="nowarp">${item.name}</td>` +
						`<td class="nowarp">${item.type}</td>` +
						`<td class="nowarp">${item.value}</td>` +
						`<td class="text-center nowarp">${item.time}</td>` +
						`<td class="text-center nowarp">${button}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="6" class="nowarp">KHÔNG CÓ DỮ LIỆU</td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';
		} else html = json.msg;
		dialog.setContent(html);
		lib.toastr.tip('info', 'Tải setting thành công', '^_^');
		$('.cmd-change-setting').click(function () {
			var sid = $(this).data('sid');
			var item = setting.map[sid]
			change_setting(item, dialog)
		});
	}, 'json')
}
function change_setting(item, dialog_pp) {
	function get_input() {
		switch (item.type) {
			case 'bit':
				return `<input type="hidden" id="new_value" value="${item.value}"><div class="form-check form-check-inline"><label class="form-check-label" for="inlineRadio1"><input onchange="$('#new_value').val(this.value)" class="form-check-input" type="radio" name="new_value" id="inlineRadio1" value="1" ${(item.value == 1 ? 'checked' : '')}>ON</label></div><div class="form-check form-check-inline"><label class="form-check-label" for="inlineRadio2"><input onchange="$('#new_value').val(this.value)" class="form-check-input" type="radio" name="new_value" id="inlineRadio2" value="0" ${(item.value == 0 ? 'checked' : '')}>OFF</label></div>`;
			default:
				return `<input type="text" class="form-control" id="new_value" value="${item.value}" />`;
		}
	}
	var content = `<table width="100%" class="table table-borderless">
		<tr>
			<td width="10%" valign="middle" align="right">Name:</td>
			<td><input type="text" class="form-control" value="${item.name}" disabled></td>
		</tr>
		<tr>
			<td width="10%" valign="middle" align="right">Type:</td>
			<td><input type="text" class="form-control" value="${item.type}" disabled></td>
		</tr>
		<tr>
			<td width="10%" valign="middle" align="right">Old&nbsp;value:</td>
			<td><input type="text" class="form-control" value="${item.value}" disabled></td>
		</tr>
        <tr>
			<td valign="middle" align="right">New&nbsp;value:</td>
			<td>${get_input()}</td>
		</tr>
    </table>`;

	function do_change_content(dialog_cs) {
		//gửi lên api để cập nhật setting
		var data = {
			action: 'change_setting',
			name: item.name,
			value: $('#new_value').val()
		}
		$.post(api, data, function (json) {
			if (json.ok) {
				dialog_cs.close();
				get_setting_content(dialog_setting);
			} else {
				lib.user.bao_loi(json.msg);
			}
		}, 'json');
	}
	$.confirm({
		title: 'Change Setting',
		icon: 'fa-solid fa-gear',
		type: 'blue',
		content: content,
		animation: 'rotateXR',
		closeAnimation: 'rotateXR',
		animationBounce: 1.5,
		animateFromElement: false,
		typeAnimated: false,
		closeIcon: true,
		columnClass: 'm',
		buttons: {
			save: {
				text: '<i class="fa-regular fa-circle-check"></i> Save change',
				btnClass: 'btn-info',
				action: function () {
					do_change_content(this);
					return false;
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
export function get_setting() {
	dialog_setting = $.confirm({
		title: 'System Setting',
		icon: 'fa-solid fa-gear',
		type: 'blue',
		content: 'Loading...',
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
					get_setting_content(this);
					return false;
				}
			},
			ok: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc'],
				btnClass: 'btn-danger',
				action: function () {
				}
			}
		},
		onContentReady: function () {
			get_setting_content(this);
			fix_dialog();
		},
	});
}

export function main() {

}

export function manager() {
	get_setting();
}