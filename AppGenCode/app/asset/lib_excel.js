'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api.aspx';
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
function get_export_form(dialog) {
	var tram = '<select id="cbo-tram" class="form-select">';
	tram += `<option value="0">Chọn tủ</option>`;
	for (var index in lib.sensor.setting.tram) {
		var item = lib.sensor.setting.tram[index];
		tram += `<option value="${item.id}">${item.kihieu} - ${item.name}</option>`;
	}
	tram += '</select>';
	var html = '<div class="table-responsive mb-3" style="height-max:100px">' +
		'<table width="100%"><thead>' +
		'<tr>' +
		'<th width="49%">Tủ:</th>' +
		'<th width="2%"></th>' +
		'<th width="49%">Thông số:</th>' +
		'</tr>' +
		'</thead><tbody>' +
		'<tr>' +
		`<td width="49%">${tram}</td>` +
		`<td width="2%">➡️</td>` +
		'<td width="49%"><select class="form-select" id="cbo-sensor" disabled><option value="0">Chọn tủ trước</option></select></td>' +
		'</tr>' +
		'</tbody></table></div>' +
		'<div class="table-responsive" style="height-max:100px" id="data-export">' +
		'</div>';
	dialog.setContent(html);
	$('#cbo-tram').on("change", function () {
		var id_tram = $(this).val();
		if (id_tram == 0) {
			$('#cbo-sensor').html('<option>Chọn tủ trước</option>');
			$('#cbo-sensor').attr('disabled', true);
		} else {
			var list_sensor = '';
			for (var index in lib.sensor.setting.sensor) {
				var item = lib.sensor.setting.sensor[index];
				if (item.tram == id_tram) {
					list_sensor += `<option value="${item.sid}">${item.name}${(item.unit ? (' (' + item.unit + ')') : '')}${('input' == item.loai ? ' - input' : '')}${('output' == item.loai ? ' - output' : '')}</option>`;
				}
			}
			$('#cbo-sensor').html(list_sensor);
			$('#cbo-sensor').attr('disabled', false);
		}
	})
}
function get_data_export(dialog, data) {
	var sensor = lib.sensor.setting.sensor[data.sid];
	$('#data-export').html('Loading data of ' + sensor.name + ' ...');
	$.post(api, data, function (json) {
		var them_cot = '';
		if (['input','output'].includes(sensor.loai)) them_cot = '<th>Time End</th>';
		var html = '<table class="table table-hover" id="table-data-export">';
		var ok = 0;
		if (json.ok && json.data && json.data.length > 0) {

			html += `<thead><tr class="table-info"><th>STT</th><th>Value</th><th>Time From</th>${them_cot}</tr></thead><tbody>`;
			for (var i = 0; i < json.data.length; i++) {
				var item = json.data[i];
				if (['input', 'output'].includes(sensor.loai)) {
					html += `<tr><td>${i + 1}</td><td>${lib.sensor.format_number_display(item.v, 2, ',')}</td><td>${item.tb}</td><td>${item.te}</td></tr>`;
				} else {
					html += `<tr><td>${i + 1}</td><td>${lib.sensor.format_number_display(item.v, 2, ',')}</td><td>${item.t.replace('T', ' ')}</td></tr>`;
				}
			}
			ok = 1;
			html += '</tbody>';
		} else {
			html += '<tr class="table-danger"><td>Không có dữ liệu trong khoảng thời gian này</td></tr>';
		}
		html += '</table>';
		$('#data-export').html(html);
		if (ok) {
			var tram = lib.sensor.setting.tram[sensor.tram];
			lib.table.sort_table('#table-data-export', 'Data of ' + tram.kihieu + '_' + sensor.name, 10);
			dialog.buttons.download.show();
		} else {
			dialog.buttons.download.hide();
		}
	}, 'json');
}
export function show_dialog_export() {
	$.confirm({
		title: 'Export Excel',
		icon: 'fa-solid fa-file-arrow-down',
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
			Export: {
				text: '<i class="fa-solid fa-file-export"></i> Get Data',
				btnClass: 'btn-primary',
				action: function () {
					var data = {
						action: 'get_sensor_history',
						sid: $('#cbo-sensor').val(),
						t1: $('#ngay1').val(),
						t2: $('#ngay2').val(),
					};
					if (data.sid == 0) {
						lib.user.bao_loi("Chưa chọn sensor");
						return false;
					}
					get_data_export(this, data);
					return false;
				}
			},
			download: {
				text: '<i class="fa-solid fa-file-arrow-down"></i> Download',
				btnClass: 'btn-warning',
				isHidden: true,
				action: function () {
					$('.buttons-excel').click();
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
		onOpenBefore: function () {
		},
		onContentReady: function () {
			lib.sensor.auto_add_time_range({ time: null, tag: null });
			get_export_form(this);
			fix_dialog();
		},
	});
}
export function main() {
}
