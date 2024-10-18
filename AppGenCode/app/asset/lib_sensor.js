'use strict';
let lib = {};
export function set_lib(L) { lib = L; }
export const setting = {
	timer_quick: null
}
const api = '/api.aspx';
Date.prototype.vn = function () {
	this.setHours(this.getHours() + 7);
	return this;
}
export function main() {
}
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
function load_cache() {
	return localStorage.getItem('sensor.get_sensor_full');
}
function save_cache(json) {
	localStorage.setItem('sensor.get_sensor_full', JSON.stringify(json));
}
function change_name_by_tag(info) {
	if (info.tag && info.tag == 'MC') {
		info.name = 'Máy Cắt';
		info.value = info.value ? '🔴Đóng' : '🟢Cắt';
	}
}
function json2html_get_sensor_full(json, callback) {
	//từ json => html => callback(html)
	var html;
	if (json.ok == 0) {
		html = "Lỗi rồi: " + json.msg;
	} else {
		setting.sensor = {}
		for (var sensor of json.data) {
			setting.sensor[sensor.sid] = sensor;
		}
		setting.tram = {};
		for (var tram of json.tu) {
			setting.tram[tram.id] = tram;
		}
		function gen_html_1_tram(tram) {
			//làm thế nào để khi user click vào 1 dòng => view lịch sử cảm biến tại dòng đó
			var html = '<div class="col-md-3"><div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover table-bordered table-view-sensor"><thead>' +
				`<cation class="ten-tu-dien"><div class='kihieu'>${tram.kihieu} (tủ ${tram.id})</div><div>${tram.name}</div></caption>` +
				'<tr class="table-info">' +
				//'<th class="text-center">STT</th>' +
				'<th width="50%">Tên</th>' +
				'<th width="20%" style="text-align:right">Giá trị</th>' +
				'<th width="20%" class="text-center">Time</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				var stt = 0;
				for (var row of json.data)
					if (row.tram == tram.id) {
						var info = {
							sid: row.sid,
							name: row.name,
							value: row.value,
							time: (row.time ? row.time : ''),
							loai: row.loai,
							tag: row.tag
						}
						change_name_by_tag(info);
						html += `<tr class="row-sensor row-sensor-${info.sid}" data-sid="${info.sid}">` +
							//`<td class="text-center">${++stt}</td>` +
							`<td width="50%" class="nowarp">${info.name}</td>` +
							`<td width="25%" class="nowarp" nowarp align="right"><span class="value-${info.sid}">${format_number_display(info.value)}</span>&nbsp;${row.unit}</td>` +
							`<td width="25%" class="nowarp text-center time-${info.sid}"></td>` +
							//`<td width="25%" class="nowarp text-center time-${info.sid}">${format_ss(info.time)}</td>` +
							'</tr>';
					}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan="3" class="nowarp">KHÔNG CÓ DỮ LIỆU LỊCH SỬ</td>` +
					'</tr>';
			}
			html += '</tbody></table></div></div>';
			return html;
		}

		html = '';
		for (var tram of json.tu) {
			html += gen_html_1_tram(tram);
		}
	}
	callback(html);
}
function get_sensor_full(callback) {
	//kiểm tra cache : nếu có dùng luôn, nếu ko có thì mới lấy mới
	var json_str = load_cache();
	if (json_str != null) {
		var json = JSON.parse(json_str);
		console.log('load cache get_sensor_full ok');
		json2html_get_sensor_full(json, function (html) {
			callback(html);
		});
		return; //ko chạy bên dưới
	}
	//gọi api => json => json_get_sensor_full(json, callback)
	$.post(api,
		{
			action: 'get_sensor_full'
		},
		function (json) {
			if (json.ok) {
				console.log('save cache get_sensor_full ok');
				save_cache(json);
			}
			json2html_get_sensor_full(json, function (html) {
				callback(html);
			});
		}, 'json');
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
function cap_nhat_gia_tri(json) {
	//cập nhật các ô có class dạng: value-$sid => theo value mới
	if (json.ok) {
		for (var ss of json.data) {
			var sensor = setting.sensor[ss.s];
			if (sensor == null) {
				continue;
			}
			var info = {
				sid: ss.s,
				name: sensor.name,
				unit: sensor.unit,
				value: ss.v,
				time: (ss.t ? ss.t : ''),
				loai: sensor.loai,
				tag: sensor.tag
			}
			change_name_by_tag(info);
			$('.value-' + ss.s).html(format_number_display(info.value));
			if (ss.dt) {
				var dt = format_ss(ss.dt);
				var dc = format_ss(ss.dc);
				$('.time-' + ss.s).html(dt);
				var title = '' + info.name + ' = ' + ss.v + ' ' + info.unit +
					'\nTime update: ' + dt +
					'\nLast change: ' + dc;
				$('.row-sensor-' + ss.s).attr('title', title);
			}
		}

		var json_str = load_cache();
		if (json_str != null) {
			var json_full = JSON.parse(json_str);
			for (var ss of json.data) {
				var sensor = setting.sensor[ss.s];
				sensor.value = ss.v;
				sensor.time = ss.dt;
				for (var item of json_full.data) {
					if (item.sid == ss.s) {
						item.value = ss.v;
						item.time = format_ss(ss.dt);
					}
				}
			}
			save_cache(json_full);
		}
	} else {
		//làm gì đó tuỳ khi có lỗi
		console.log(json.msg);
	}
}
export function format_number_display(value, n = 2, sep = '′') {
	if (isNaN(value)) {
		return value;
	}
	if (value != null) {
		value = value.toFixed(n);
	}
	if (value != null) {
		value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
	}
	if ((value == '0.0') || (value == '0.00')) value = '0';
	if ((value == '1.0') || (value == '1.00')) value = '1';
	return value;
}
function cap_nhat_gia_tri2(json) {
	if (json.ok) {
		var data_quick2 = [];
		for (var item of json.data) {
			var a = item.name.split('_');
			var tram = parseInt(a[1]);
			var offset = 0;
			if (a[0] == 'di') offset = 50;
			if (a[0] == 'do') offset = 70;

			for (var i = 0; i < item.value.length; i++) {
				var ss = {
					s: tram * 100 + offset + i,
					v: item.value[i],
					t: item.dt,
					dt: item.dt,
					dc: item.dt
				}
				data_quick2.push(ss);
			}
		}
		for (var ss of data_quick2) {
			var sensor = setting.sensor[ss.s];
			if (sensor == null) {
				continue;
			}
			var info = {
				sid: ss.s,
				name: sensor.name,
				unit: sensor.unit,
				value: ss.v,
				time: (ss.t ? ss.t : ''),
				loai: sensor.loai,
				tag: sensor.tag
			}
			change_name_by_tag(info);
			var n = 2;
			if (['input', 'output'].includes(info.loai)) n = 0;

			$('.value-' + ss.s).html(format_number_display(info.value, n));
			if (ss.dt) {
				var dt = format_ss(ss.dt);
				var dc = format_ss(ss.dc);
				$('.time-' + ss.s).html(dt);
				var title = '' + info.name + ' = ' + ss.v + ' ' + info.unit +
					'\nTime update: ' + dt +
					'\nLast change: ' + dc;
				$('.row-sensor-' + ss.s).attr('title', title);
			}
		}

		var json_str = load_cache();
		if (json_str != null) {
			var json_full = JSON.parse(json_str);
			for (var ss of data_quick2) {
				var sensor = setting.sensor[ss.s];
				if (sensor == null) continue;
				//console.log(ss);
				sensor.value = ss.v;
				sensor.time = ss.dt;
				for (var item of json_full.data) {
					if (item.sid == ss.s) {
						item.value = ss.v;
						item.time = format_ss(ss.dt);
					}
				}
			}
			save_cache(json_full);
		}
	} else {
		//làm gì đó tuỳ khi có lỗi
		console.log('Error monitor:', json.msg);
		lib.toastr.tip('error', 'Error monitor', json.msg);
	}
}
function get_sensor_quick() {
	if (!lib.user.setting.logined) return;
	//gửi tới api action=get_sensor_quick để lấy json ít thông tin:
	//json quick: có sid, value, time
	$.post(api,
		{
			action: 'get_sensor_quick2'
		},
		function (json) {
			//cap_nhat_gia_tri(json);
			cap_nhat_gia_tri2(json);
		}, 'json');
}
function noi_dung_time_line(dialog, info) {
	var t1 = $('#ngay1').val();
	var t2 = $('#ngay2').val();
	$.post(api,
		{
			action: 'get_sensor_history',
			sid: info.sid,
			t1: t1,
			t2: t2,
		},
		function (json) {
			dialog.setContent('<div id="chartdiv" style="width: 100%; height: 200px;"></div><div id="du-lieu-chart"></div>');
			var option = {
				name: info.name,
				RUN: { value: 1, color: 0xDC3545, text: "ON" },
				STOP: { value: 0, color: 0x0DCAF0, text: "OFF" },
				chartdiv: 'chartdiv',
				table: 'du-lieu-chart',
			};
			if (json.ok && json.data && json.data.length > 0) {
				if (info.tag == 'MC') {
					option.RUN.text = '🔴Đóng';
					option.STOP.text = '🟢Cắt';
				}
				if (info.loai == 'input' || info.loai == 'output') {
					$('#' + option.chartdiv).css({ "height": "200px" });
					$('#' + option.chartdiv).html('');
					$('#' + option.table).html('');
					DrawTimelineChart(json, option);
				} else {
					$('#' + option.chartdiv).css({ "height": "450px" });
					$('#' + option.chartdiv).html('Vẽ biểu đồ loại khác');
				}
				ShowTableChart(json, option);
			} else {
				var d1 = t1.replace('T', ' ');
				var d2 = t2.replace('T', ' ');
				$('#' + option.chartdiv).html(`Không có dữ liệu trong khoảng thời gian từ ${d1} đến ${d2}`);
				$('#' + option.table).html('');
			}
		},
		'json');
}
function show_dialog_time_line(info) {
	$.confirm({
		title: 'Lịch sử dữ liệu: ' + info.name,
		icon: 'fa-solid fa-clock-rotate-left',
		type: 'blue',
		content: '<div id="chartdiv" style="width: 100%; height: 200px;">Loading...</div><div id="du-lieu-chart"></div>',
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
					noi_dung_time_line(this, info);
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
			auto_add_time_range(info);
		},
		onContentReady: function () {
			noi_dung_time_line(this, info);
			fix_dialog();
		},
	});
}
export function auto_add_time_range(info) {

	if (info.time) {
		//trước khi hiển thị hộp thoại thì điền thời gian vào
		function time2str(ss) {
			var today = new Date().vn();
			var t = new Date(today.setHours(today.getHours() + ss / 3600));
			return t.toISOString().substr(0, 16);
		}
		var t1 = time2str(-info.time - 9 * 3600);
		var t2 = time2str(-info.time + 3600);
		add_range_day(info, t1, t2);
	} else {
		add_range_day(info);
	}
}
function show_history(sensor) {
	var info = {
		sid: sensor.sid,
		name: sensor.name,
		value: sensor.value,
		time: sensor.time,
		tag: sensor.tag,
		loai: sensor.loai
	}
	change_name_by_tag(info);


	//tự động add 2 time vào chân biểu đồ


	if (['u_pha', 'u_day', 'i_pha', 'i_thu'].includes(info.tag)) {
		function combo(id, arr, title) {
			var n = id % 100;
			var kq = [];
			var tram = (id - n) / 100;
			for (var item of arr) {
				kq.push(tram * 100 + item);
			}
			return { title: lib.sensor.setting.tram[tram].kihieu + ' - ' + title + ' L1 L2 L3', sid: kq }
		}
		var kq;
		if (info.loai == 'selec') {
			switch (info.tag) {
				case 'u_pha': kq = combo(info.sid, [0, 1, 2], 'U Pha'); break;
				case 'u_day': kq = combo(info.sid, [4, 5, 6], 'U Dây'); break;
				case 'i_pha': kq = combo(info.sid, [8, 9, 10], 'I Pha'); break;
			}
			show_dialog_bieu_do_3e(kq);
		} else if (info.loai == 'khac') {
			switch (info.tag) {
				case 'u_pha': kq = combo(info.sid, [0, 1, 2], 'U Pha'); break;
				case 'u_day': kq = combo(info.sid, [6, 7, 8], 'U Dây'); break;
				case 'i_pha': kq = combo(info.sid, [9, 10, 11], 'I Pha'); break;
				case 'i_thu': kq = combo(info.sid, [14, 15, 16], 'I xxx'); break;
			}
			show_dialog_bieu_do_3e(kq);
			console.log('draw chart 3pha khác: ' + info.sid + '...');
		}
	}
	else {
		if (['input', 'output'].includes(info.loai) || info.tag == 'MC') {
			show_dialog_time_line(info);
		} else if (['cos', 'ts', '?', 'sum'].includes(info.tag)) {
			var tram = (info.sid - info.sid % 100) / 100;
			var item = get_chart_info(info.sid);
			var param = { title: lib.sensor.setting.tram[tram].kihieu + ' - ' + info.name };
			show_dialog_1e(item, param);
		} else if (info.tag == 'sum') {
			console.log('chart tách total thành 3 cột 1 ngày')
			var tram = (info.sid - info.sid % 100) / 100;
			var item = get_chart_info(info.sid);
			var param = { title: lib.sensor.setting.tram[tram].kihieu + ' - ' + info.name };
			show_dialog_1e(item, param);
		}
	}
}
function get_today() {
	let today = new Date().vn();
	//return today.toISOString().split('T')[0];
	return today.toISOString().substr(0, 16);
}
function get_yesterday() {
	var today = new Date().vn();
	var offset = -8;
	var yesterday = new Date(today.setHours(today.getHours() + offset));
	//return yesterday.toISOString().split('T')[0];
	return yesterday.toISOString().substr(0, 16);
}
function isMobile() {
	// Kiểm tra kích thước màn hình và userAgent để phát hiện thiết bị
	var isMobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	return isMobileCheck;
}
function add_range_day_spec(time1, time2) {
	var spec = localStorage.getItem('spec');
	if (spec == null || spec == undefined) spec = 0.9;
	var html = '<div class="div-ngay" style="display:inline !important;">From:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay1" style="display:inline !important;">&nbsp;To:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay2" style="display:inline !important;">&nbsp;Spec:&nbsp;<input type="number" class="form-control" id="spec" style="display:inline !important; width:80px;" step="0.01" value="' + spec + '">&nbsp;Time&nbsp;below:&nbsp;<label id="time_below_spec" style="color:red"></label>&nbsp;</div>';
	var mobile = '<div class="table-responsive"><table class="table table-borderless table-sm" width="100%"><tr><td>From:</td><td><input type="datetime-local" class="chon-ngay form-control" id="ngay1"></td></tr><tr><td>To:</td><td><input type="datetime-local" class="chon-ngay form-control" id="ngay2"></td></tr><tr><td>Spec:</td><td><input type="number" class="form-control" id="spec" step="0.01" value="' + spec + '" style="width: 80px"></td></tr><tr><td>Time below:</td><td id="time_below_spec" style="color:red"></td></tr></table></div>';
	if (isMobile()) {
		$('.jconfirm-buttons').prepend(mobile);
	} else {
		$('.jconfirm-buttons').prepend(html);
	}
	if (time1 && time2) {
		$('#ngay1').val(time1);
		$('#ngay2').val(time2);
	} else {
		$('#ngay1').val(get_yesterday());
		$('#ngay2').val(get_today());
	}
}
function add_range_day(info, time1, time2) {
	if (info.tag == 'cos') {
		add_range_day_spec(time1, time2);
		return;
	}
	var html = '<div class="div-ngay" style="display:inline !important;">From:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay1" style="display:inline !important;">&nbsp;To:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay2" style="display:inline !important;"></div>';
	var mobile = '<div class="table-responsive"><table class="table table-borderless table-sm" width="100%"><tr><td>From:</td><td><input type="datetime-local" class="chon-ngay form-control" id="ngay1"></td></tr><tr><td>To:</td><td><input type="datetime-local" class="chon-ngay form-control" id="ngay2"></td></tr></table></div>';
	if (isMobile()) {
		$('.jconfirm-buttons').prepend(mobile);
	} else {
		$('.jconfirm-buttons').prepend(html);
	}
	if (time1 && time2) {
		$('#ngay1').val(time1);
		$('#ngay2').val(time2);
	} else {
		$('#ngay1').val(get_yesterday());
		$('#ngay2').val(get_today());
	}
}
function add_range_ngay() {
	var html = '<div class="div-ngay" style="display:inline !important;">From:&nbsp;<input type="date" class="chon-date form-control" id="ngay1" style="display:inline !important;">To:&nbsp;<input type="date" class="chon-date form-control" id="ngay2" style="display:inline !important;"></div>';
	var mobile = '<div class="table-responsive"><table class="table table-borderless table-sm" width="100%"><tr><td>From:</td><td><input type="date" class="chon-ngay form-control" id="ngay1"></td></tr><tr><td>To:</td><td><input type="date" class="chon-ngay form-control" id="ngay2"></td></tr></table></div>';
	if (isMobile()) {
		$('.jconfirm-buttons').prepend(mobile);
	} else {
		$('.jconfirm-buttons').prepend(html);
	}

	var today = new Date().vn();
	today = today.toISOString().substr(0, 10);
	$('#ngay2').val(today);

	today = new Date().vn();
	var previousDate = new Date(today);
	previousDate.setMonth(today.getMonth() - 1);// Trừ đi 1 tháng
	var formattedPreviousDate = previousDate.toISOString().slice(0, 10);
	$('#ngay1').val(formattedPreviousDate);
}
function add_range_day1() {
	var html = '<div class="div-ngay" style="display:inline !important;">Từ:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay1" style="display:inline !important;">&nbsp;Đến:&nbsp;<input type="datetime-local" class="chon-ngay form-control" id="ngay2" style="display:inline !important;"></div>';
	$('.jconfirm-buttons').prepend(html);
	$('#ngay1').val(get_yesterday());
	$('#ngay2').val(get_today());
}
function add_range_ngay1() {
	var html = '<div class="div-ngay" style="display:inline !important;">Từ&nbsp;ngày:&nbsp;<input type="date" class="chon-date form-control" id="ngay1" style="display:inline !important;">&nbsp;Đến&nbsp;ngày:&nbsp;<input type="date" class="chon-date form-control" id="ngay2" style="display:inline !important;"></div>';
	$('.jconfirm-buttons').prepend(html);
	var today = new Date().vn();
	today = today.toISOString().substr(0, 10);
	$('#ngay2').val(today);

	today = new Date().vn();
	var previousDate = new Date(today);
	previousDate.setMonth(today.getMonth() - 1);// Trừ đi 1 tháng
	var formattedPreviousDate = previousDate.toISOString().slice(0, 10);
	$('#ngay1').val(formattedPreviousDate);
}
function ShowTableChart(json, option) {
	//du-lieu-chart
	var html = '<div class="table-responsive" style="height-max:100px">' +
		'<table class="table table-hover" id="table-view-chart"><thead>' +
		'<tr class="table-info">' +
		'<th class="text-center">STT</th>' +
		'<th>Trạng thái</th>' +
		'<th class="text-center">Từ</th>' +
		'<th class="text-center">Đến</th>' +
		'<th class="text-center">Thời lượng</th>' +
		'</tr>' +
		'</thead><tbody>';
	//show html ra 1 dialog
	if (json.data) {
		var stt = 0;
		for (var row of json.data) {
			html += '<tr>' +
				`<td class="text-center nowarp">${++stt}</td>` +
				`<td>${((row.v == 0) ? option.STOP.text : option.RUN.text)}</td>` +
				`<td class="text-center nowarp">${row.tb}</td>` +
				`<td class="text-center nowarp">${row.te}</td>` +
				`<td class="text-center nowarp">${row.duration}</td>` +
				'</tr>';
		}
	} else {
		html += '<tr class="table-warning">' +
			`<td colspan="5" class="nowarp">KHÔNG CÓ DỮ LIỆU LỊCH SỬ</td>` +
			'</tr>';
	}
	html += '</tbody></table></div>';
	$('#' + option.table).html(html);
	lib.table.sort_table('#table-view-chart', 'Data of ' + option.name, 10);
}
function DrawTimelineChart(jsonData, option) {
	// Tạo root của amCharts
	var root = am5.Root.new(option.chartdiv);

	// Áp dụng theme Animated
	root.setThemes([am5themes_Animated.new(root)]);

	// Tạo biểu đồ XY chart
	var chart = root.container.children.push(
		am5xy.XYChart.new(root, {
			panX: true,
			panY: true,
			wheelX: "panX",
			wheelY: "zoomX",
			pinchZoomX: true
		})
	);

	// Tạo trục X (trục thời gian)
	var xAxis = chart.xAxes.push(
		am5xy.DateAxis.new(root, {
			maxDeviation: 0.2,
			baseInterval: { timeUnit: "second", count: 1 },
			renderer: am5xy.AxisRendererX.new(root, {}),
			tooltip: am5.Tooltip.new(root, {})
		})
	);

	// Tạo trục Y (chỉ có 1 hàng máy)
	var yAxis = chart.yAxes.push(
		am5xy.CategoryAxis.new(root, {
			renderer: am5xy.AxisRendererY.new(root, {}),
			categoryField: "machine"
		})
	);

	// Gán giá trị danh mục (CategoryAxis)
	yAxis.data.setAll([{ machine: option.name }]);

	// Dữ liệu biểu đồ
	var chartData = jsonData.data.map(function (item) {
		var startTime = new Date(item.tb).getTime();
		var endTime = new Date(item.te).getTime();
		var duration = (endTime - startTime) / 1000; // Thời gian tính bằng giây
		duration = format_ss(duration);
		duration = duration.replace('ago', '').replace('now', '')
		item.duration = duration;
		return {
			machine: option.name,
			start: startTime,
			end: endTime,
			status: item.v,
			duration: duration, // Khoảng thời gian giữa start và end
			statusText: item.v === option.RUN.value ? option.RUN.text : option.STOP.text
		};
	});
	var tiptext = "[bold]" + option.name + ": {statusText}[/]\n[bold]Bắt đầu:[/] {openValueX.formatDate('yyyy-MM-dd HH:mm:ss')}\n[bold]Kết thúc:[/] {valueX.formatDate('yyyy-MM-dd HH:mm:ss')}\n[bold]Thời lượng:[/] {duration}";
	// Tạo Series để hiển thị trạng thái
	var series = chart.series.push(
		am5xy.ColumnSeries.new(root, {
			xAxis: xAxis,
			yAxis: yAxis,
			openValueXField: "start",  // Thời gian bắt đầu
			valueXField: "end",        // Thời gian kết thúc
			categoryYField: "machine", // Hàng hiển thị
			sequencedInterpolation: true,
			tooltip: am5.Tooltip.new(root, {
				labelText: tiptext
			})
		})
	);

	// Kích hoạt tooltip trên các cột
	series.columns.template.setAll({
		tooltipText: tiptext,
		tooltipX: am5.percent(50),
		tooltipY: am5.percent(0),
		strokeOpacity: 0,
		height: am5.percent(50),
		templateField: "columnSettings"
	});

	// Thiết lập màu sắc cho từng trạng thái dựa trên cấu hình của option
	series.columns.template.adapters.add("fill", function (fill, target) {
		if (target.dataItem) {
			if (target.dataItem.dataContext.status === option.RUN.value) {
				return am5.color(option.RUN.color); // Màu cho trạng thái RUN
			} else {
				return am5.color(option.STOP.color); // Màu cho trạng thái STOP
			}
		}
		return fill;
	});

	// Gán dữ liệu cho series
	series.data.setAll(chartData);

	// Làm xuất hiện biểu đồ
	series.appear(1000);
	chart.appear(1000, 100);
}
function get_chart_info(sid) {
	var item = lib.sensor.setting.sensor[sid];
	return item;
}
var json_l1, json_l2, json_l3;
const COLOR_CHART = ['#FFCC00', '#3DB54B', '#F80120'];
function get_e_data_chart(item, action, timer, callback) {
	var t1 = $('#ngay1').val();
	var t2 = $('#ngay2').val();
	var data = { action: action, sid: item.sid, t1: t1, t2: t2 };
	$.post(api, data, function (json) {
		var table_data = [];
		if (json.ok && json.data && json.data.length > 0) {
			for (var i = 0; i < json.data.length; i++) {
				var item = json.data[i];
				var date = new Date(item.t);
				var node = {
					date: date.getTime(),
					value: item.v
				}
				table_data.push(node);
			}

			json.table_data = table_data;
			//callback(json);
			setTimeout(function () { callback(json); }, timer);
		} else {
			//thong_bao_loi(json);
			json.table_data = [];
			json.data = [];
			//callback(json);
			setTimeout(function () { callback(json); }, timer);
		}
	}, 'json'); //end ajax
}
function same_time(json) {
	var t1 = new Date($('#ngay1').val());
	var t2 = new Date($('#ngay2').val());
	var tj1 = new Date(json.t1);
	var tj2 = new Date(json.t2);
	return (tj1 - t1 == 0 && tj2 - t2 == 0);
}
function load_data_e_chart(item, title, json, callback) {
	if (same_time(json)) {
		draw_e_chart(item, title, json);  //load_data_e_chart cache
	} else {
		const action = 'get_sensor_history';
		const timer = 1;
		get_e_data_chart(item, action, timer, function (json) {
			callback(json);
			draw_e_chart(item, title, json);  //load_data_e_chart new (no cache)
		});
	}
}
function show_dialog_bieu_do_3e(param) {
	var item1 = get_chart_info(param.sid[0]);
	var item2 = get_chart_info(param.sid[1]);
	var item3 = get_chart_info(param.sid[2]);
	if (item1 == null || item2 == null || item3 == null) return;
	var content = `<div class="sensor-popup"><div id="sensor-chart">Loading data history...</div></div>`;

	var dialog3e = $.confirm({
		icon: 'fa fa-ok',
		title: param.title,
		content: content,
		type: 'green',
		closeIcon: true,
		closeIconClass: 'fa fa-close',
		columnClass: 'xl',
		escapeKey: 'cancel',
		buttons: {
			update: {
				text: '<i class="fa fa-check"></i> All',
				btnClass: 'btn btn-primary',
				action: function () {
					dialog3e.setTitle(param.title);
					var use_cache = 1;
					load_data_3e_chart(item1, item2, item3, use_cache);
					return false;
				}
			},
			update_L1: {
				text: 'L1',
				btnClass: 'btn btn-primary',
				action: function () {
					var title = param.title.replace('L1 L2 L3', 'L1');
					dialog3e.setTitle(title);
					load_data_e_chart(item1, title, json_l1, function (json) { json_l1 = json; }); //L1
					return false;
				}
			},
			update_L2: {
				text: 'L2',
				btnClass: 'btn btn-primary',
				action: function () {
					var title = param.title.replace('L1 L2 L3', 'L2');
					dialog3e.setTitle(title);
					load_data_e_chart(item2, title, json_l2, function (json) { json_l2 = json; }); //L2
					return false;
				}
			},
			update_L3: {
				text: 'L3',
				btnClass: 'btn btn-primary',
				action: function () {
					var title = param.title.replace('L1 L2 L3', 'L3')
					dialog3e.setTitle(title);
					load_data_e_chart(item3, title, json_l3, function (json) { json_l3 = json; }); //L3
					return false;
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc'],
				btnClass: 'btn-red',
				action: function () {

				}
			}
		},
		onOpenBefore: function () {
			auto_add_time_range(item1);
		},
		onContentReady: function () {
			load_data_3e_chart(item1, item2, item3);
			fix_dialog();
		}
	});
}
function show_dialog_1e(item, param) {
	var content = '<div class="sensor-popup"><div id="sensor-chart">Loading data history...</div></div>';
	var dialog1e = $.confirm({
		icon: 'fa fa-ok',
		title: param.title,
		content: content,
		type: 'green',
		closeIcon: true,
		closeIconClass: 'fa fa-close',
		columnClass: 'xl',
		escapeKey: 'cancel',
		buttons: {

			update: {
				text: 'Update',
				btnClass: 'btn btn-primary',
				action: function () {
					var use_cache = 1;
					load_data_1e_chart(item, use_cache);
					return false;
				}
			},
			cancel: {
				text: '<i class="fa fa-circle-xmark"></i> Close',
				keys: ['esc'],
				btnClass: 'btn-red',
				action: function () {
				}
			}
		},
		onOpenBefore: function () {
			auto_add_time_range(item);
		},
		onContentReady: function () {
			load_data_1e_chart(item);
			fix_dialog();
		}
	});
}
var json_1e;
function load_data_1e_chart(item, use_cache = 0) {
	function get_new_json() {
		const action = 'get_sensor_history';
		const timer = 1;
		get_e_data_chart(item, action, timer, function (json) {
			json_1e = json;
			if (item.tag == 'cos') {
				draw_e_chart_spec(item, item.name, json); //load_data_1e_chart new cos phi
			} else {
				draw_e_chart(item, item.name, json); //load_data_1e_chart new
			}
		});
	}
	function use_cache_json() {
		if (item.tag == 'cos') {
			draw_e_chart_spec(item, item.name, json_1e); //1e cos cache
		} else {
			draw_e_chart(item, item.name, json_1e);  //1e cache
		}
	}
	if (use_cache && json_1e && same_time(json_1e)) {
		use_cache_json();
	} else {
		get_new_json();
	}
}
function load_data_3e_chart(item1, item2, item3, use_cache = 0) {

	function get_new_json() {
		const action = 'get_sensor_history';
		const timer = 1;
		$('#sensor-chart').html('<div class="progress" role="progressbar" aria-label="Loading..." aria-valuenow="5" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar progress-bar-striped" style="width: 10%" id="progress">Loading...</div></div><div id="load-done"></div>');
		$('#load-done').append('Loading [' + item1.name + ']...')
		get_e_data_chart(item1, action, timer, function (json1) { //load_data_3e_chart sid1
			json_l1 = json1;
			$('#progress').html("33%");
			$('#progress').css({ "width": "33%" });
			$('#load-done').append(' OK<br>Loading [' + item2.name + ']...')
			get_e_data_chart(item2, action, timer, function (json2) {//load_data_3e_chart sid2
				json_l2 = json2;
				$('#progress').html("66%");
				$('#progress').css({ "width": "66%" });
				$('#load-done').append(' OK<br>Loading [' + item3.name + ']...')
				get_e_data_chart(item3, action, timer, function (json3) {//load_data_3e_chart sid3
					json_l3 = json3;
					$('#progress').html("100%");
					$('#progress').css({ "width": "100%" });
					$('#load-done').append(' OK');
					setTimeout(function () {
						draw_3e_chart(item1, item2, item3, json1, json2, json3);
					}, (timer < 100) ? (100 + timer) : timer);
				});
			});
		});
	}

	function use_cache_json() {
		$('#sensor-chart').html('<div style="height:350px" id="chartdiv"></div>');
		draw_3e_chart(item1, item2, item3, json_l1, json_l2, json_l3);
	}

	if (use_cache && same_time(json_l1) && same_time(json_l2) && same_time(json_l3)) {
		use_cache_json();
	}
	else {
		get_new_json();
	}

}
function draw_3e_chart(item1, item2, item3, json1, json2, json3) {
	$('#sensor-chart').html('<div style="height:350px" id="chartdiv"></div>');
	var donvi1 = item1.unit;
	var donvi2 = item2.unit;
	var donvi3 = item3.unit;
	var ten1 = item1.name;
	var ten2 = item2.name;
	var ten3 = item3.name;

	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	//<div style="height:500px" id="chartdiv">Loading...</div>
	var root = am5.Root.new("chartdiv");

	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
		am5themes_Animated.new(root)
	]);

	// Create chart
	// https://www.amcharts.com/docs/v5/charts/xy-chart/
	var chart = root.container.children.push(am5xy.XYChart.new(root, {
		panX: true,
		panY: true,
		wheelX: "panX",
		wheelY: "zoomX",
		pinchZoomX: true,
		paddingLeft: 0
	}));

	// Add cursor
	// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
	var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "" }));
	cursor.lineY.set("visible", false);

	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		maxDeviation: 0.2,
		baseInterval: {
			timeUnit: "minute",
			count: 1
		},
		renderer: am5xy.AxisRendererX.new(root, {
			minorGridEnabled: true
		}),
		tooltip: am5.Tooltip.new(root, {})
	}));

	var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		renderer: am5xy.AxisRendererY.new(root, {
			pan: "zoom"
		})
	}));

	// Add series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	var series1 = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: ten1,
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value1",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: ten1 + "\n{valueY} " + donvi1
		})
	}));

	var series2 = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: ten2,
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value2",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: ten2 + "\n{valueY} " + donvi2
		})
	}));
	var series3 = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: ten3,
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value3",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: ten3 + "\n{valueY} " + donvi3
		})
	}));

	series1.strokes.template.setAll({
		strokeWidth: 2
	});
	series2.strokes.template.setAll({
		strokeWidth: 2
	});
	series3.strokes.template.setAll({
		strokeWidth: 2
	});

	var rangeDataItem1 = yAxis.makeDataItem({
		value: -1e9,
		endValue: 1e9
	});
	var rangeDataItem2 = yAxis.makeDataItem({
		value: -1e9,
		endValue: 1e9
	});
	var rangeDataItem3 = yAxis.makeDataItem({
		value: -1e9,
		endValue: 1e9
	});

	var range1 = series1.createAxisRange(rangeDataItem1);
	var range2 = series2.createAxisRange(rangeDataItem2);
	var range3 = series3.createAxisRange(rangeDataItem3);

	range1.strokes.template.setAll({
		stroke: am5.color(COLOR_CHART[0]),
		strokeWidth: 2
	});
	range2.strokes.template.setAll({
		stroke: am5.color(COLOR_CHART[1]),
		strokeWidth: 2
	});
	range3.strokes.template.setAll({
		stroke: am5.color(COLOR_CHART[2]),
		strokeWidth: 2
	});



	// Add scrollbar
	var total_phut = json1.data.length;
	var start = 0;
	if (total_phut > 60 * 8) {
		start = (total_phut - 60 * 8) * 1.0 / total_phut;
	}
	// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
	chart.set("scrollbarX", am5.Scrollbar.new(root, {
		orientation: "horizontal",
		start: start,
		end: 1.0
	}));

	// Set data
	var data1 = json1.table_data;
	var data2 = json2.table_data;
	var data3 = json3.table_data;
	var data = [];

	var i1 = 0, i2 = 0, i3 = 0, item1, item2, item3;
	function chon(min, item) {
		if (item == null) return null;
		return (min == item.date) ? item.value : null;
	}
	function tang(min, item) {
		if (item == null) return 0;
		return (min == item.date) ? 1 : 0;
	}
	function get_min(min, item) {
		if (item != null) { if (min == null || item.date < min) min = item.date; }
		return min;
	}
	while (i1 < data1.length || i2 < data2.length || i3 < data3.length) {
		if (i1 < data1.length) item1 = data1[i1]; else item1 = null;
		if (i2 < data2.length) item2 = data2[i2]; else item2 = null;
		if (i3 < data3.length) item3 = data3[i3]; else item3 = null;

		var min = null;
		min = get_min(min, item1);
		min = get_min(min, item2);
		min = get_min(min, item3);
		data.push({ date: min, value1: chon(min, item1), value2: chon(min, item2), value3: chon(min, item3) });
		i1 += tang(min, item1);
		i2 += tang(min, item2);
		i3 += tang(min, item3);
	}
	series1.data.setAll(data);
	series2.data.setAll(data);
	series3.data.setAll(data);

	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
	series1.appear(1000);
	series2.appear(1000);
	series3.appear(1000);
	chart.appear(1000, 100);
}
function draw_e_chart(item, title, json) {
	$('#sensor-chart').html('<div style="height:350px" id="chartdiv"></div>');
	var donvi = item.unit;
	var ten = item.name;
	var color = "#59A80F";
	switch (title.slice(-2)) {
		case "L1": color = COLOR_CHART[0]; break;
		case "L2": color = COLOR_CHART[1]; break;
		case "L3": color = COLOR_CHART[2]; break;
	}

	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	//<div style="height:500px" id="chartdiv">Loading...</div>
	var root = am5.Root.new("chartdiv");

	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
		am5themes_Animated.new(root)
	]);

	// Create chart
	// https://www.amcharts.com/docs/v5/charts/xy-chart/
	var chart = root.container.children.push(am5xy.XYChart.new(root, {
		panX: true,
		panY: true,
		wheelX: "panX",
		wheelY: "zoomX",
		pinchZoomX: true,
		paddingLeft: 0
	}));

	// Add cursor
	// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
	var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "" }));
	cursor.lineY.set("visible", false);

	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		maxDeviation: 0.2,
		baseInterval: {
			timeUnit: "minute",
			count: 1
		},
		renderer: am5xy.AxisRendererX.new(root, {
			minorGridEnabled: true
		}),
		tooltip: am5.Tooltip.new(root, {})
	}));

	var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		renderer: am5xy.AxisRendererY.new(root, {
			pan: "zoom"
		})
	}));

	// Add series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: "Series",
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: ten + "\n{valueY} " + donvi
		})
	}));

	series.strokes.template.setAll({
		strokeWidth: 2
	});

	var rangeDataItem = yAxis.makeDataItem({
		value: 0,
		endValue: 9e6
	});

	var range = series.createAxisRange(rangeDataItem);

	range.strokes.template.setAll({
		stroke: am5.color(color),
		strokeWidth: 2
	});

	var rangeDataItem_am = yAxis.makeDataItem({
		value: -9e6,
		endValue: -0.01
	});

	var range_am = series.createAxisRange(rangeDataItem_am);

	range_am.strokes.template.setAll({
		stroke: am5.color("#FF0000"),
		strokeWidth: 2
	});


	var total_phut = 60;
	if (json.history) total_phut = json.history.length;
	var start = 0;
	if (total_phut > 60 * 8) {
		start = (total_phut - 60 * 8) * 1.0 / total_phut;
	}

	// Add scrollbar
	// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
	chart.set("scrollbarX", am5.Scrollbar.new(root, {
		orientation: "horizontal",
		start: start,
		end: 1.0
	}));


	// Set data
	var data = json.table_data;

	series.data.setAll(data);


	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
	series.appear(1000);
	chart.appear(1000, 100);
}
function draw_e_chart_spec(item, title, json) {
	$('#sensor-chart').html('<div style="height:350px" id="chartdiv"></div>');
	var t = $('#spec').val();
	if (t == undefined) t = localStorage.getItem('spec');
	var spec = parseFloat(t);
	if (isNaN(spec)) spec = 0.9;
	localStorage.setItem('spec', spec);
	var donvi = item.unit;
	var ten = item.name;

	// Create root element
	// https://www.amcharts.com/docs/v5/getting-started/#Root_element
	//<div style="height:500px" id="chartdiv">Loading...</div>
	var root = am5.Root.new("chartdiv");

	// Set themes
	// https://www.amcharts.com/docs/v5/concepts/themes/
	root.setThemes([
		am5themes_Animated.new(root)
	]);

	// Create chart
	// https://www.amcharts.com/docs/v5/charts/xy-chart/
	var chart = root.container.children.push(am5xy.XYChart.new(root, {
		panX: true,
		panY: true,
		wheelX: "panX",
		wheelY: "zoomX",
		pinchZoomX: true,
		paddingLeft: 0
	}));

	// Add cursor
	// https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
	var cursor = chart.set("cursor", am5xy.XYCursor.new(root, { behavior: "" }));
	cursor.lineY.set("visible", false);

	// Create axes
	// https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
	var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		maxDeviation: 0.2,
		baseInterval: {
			timeUnit: "minute",
			count: 1
		},
		renderer: am5xy.AxisRendererX.new(root, {
			minorGridEnabled: true
		}),
		tooltip: am5.Tooltip.new(root, {})
	}));

	var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		renderer: am5xy.AxisRendererY.new(root, {
			pan: "zoom"
		})
	}));

	// Add series
	// https://www.amcharts.com/docs/v5/charts/xy-chart/series/
	var series = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: "Series",
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: ten + "\n{valueY} " + donvi
		})
	}));

	var series2 = chart.series.push(am5xy.SmoothedXLineSeries.new(root, {
		name: "Series",
		xAxis: xAxis,
		yAxis: yAxis,
		valueYField: "value2",
		valueXField: "date",
		tensionX: 0.77,
		strokeWidth: 2,
		smoothing: "monotoneX",
		tooltip: am5.Tooltip.new(root, {
			labelText: "Spec: \n{valueY} " + donvi
		})
	}));

	series.strokes.template.setAll({
		strokeWidth: 2
	});

	series2.strokes.template.setAll({
		strokeWidth: 2
	});

	var rangeDataItem = yAxis.makeDataItem({
		value: 0,
		endValue: spec
	});

	var rangeDataItem2 = yAxis.makeDataItem({
		value: spec,
		endValue: 1
	});

	var range = series.createAxisRange(rangeDataItem);

	var range2 = series.createAxisRange(rangeDataItem2);

	range.strokes.template.setAll({
		stroke: am5.color("#ff0000"),
		strokeWidth: 2
	});

	range2.strokes.template.setAll({
		stroke: am5.color("#59A80F"),
		strokeWidth: 2
	});

	var rangeDataItem_am = yAxis.makeDataItem({
		value: spec,
		endValue: 1
	});

	var range_am = series.createAxisRange(rangeDataItem_am);

	range_am.strokes.template.setAll({
		stroke: am5.color("#59A80F"),
		strokeWidth: 2
	});


	var total_phut = 60;
	if (json.history) total_phut = json.history.length;
	var start = 0;
	if (total_phut > 60 * 8) {
		start = (total_phut - 60 * 8) * 1.0 / total_phut;
	}

	// Add scrollbar
	// https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
	chart.set("scrollbarX", am5.Scrollbar.new(root, {
		orientation: "horizontal",
		start: start,
		end: 1.0
	}));


	// Set data
	var data = [];

	var dem = 0, total = 0;
	for (var item of json.table_data) {
		data.push({ date: item.date, value: item.value, value2: spec });
		if (item.value < spec) dem++;
		total++;
	}
	$('#time_below_spec').html(dem + 'm=' + Math.round(dem * 100.0 / total, 0) + '%')
	series.data.setAll(data);
	series2.data.setAll(data);


	// Make stuff animate on load
	// https://www.amcharts.com/docs/v5/concepts/animations/
	series.appear(1000);
	series2.appear(1000);
	chart.appear(1000, 100);
}
export function show_sensor() {
	//hàm này đc gọi khi login ok, ko cần check quyền: done
	//lấy json từ  get_sensor_full => tạo html => hiển thị
	$('#noi-dung-chi-tiet').html('<div class="col-md-12">Loading sensor ...</div>');
	get_sensor_full(function (html) {
		$('#noi-dung-chi-tiet').html(html);
		//nạp full info 1 lần thôi, từ giờ 6s nạp quick 1 lần
		//vì nodered 6s lấy mẫu 1 lần.

		$('.row-sensor').click(function () {
			var sid = $(this).data('sid');
			var sensor = setting.sensor[sid];
			show_history(sensor);
		});
		get_sensor_quick();
		setting.timer_quick = setInterval(function () {
			get_sensor_quick();
		}, 2400);
	});
}