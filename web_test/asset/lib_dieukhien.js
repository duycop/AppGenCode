'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api.aspx';
function fix_dialog() {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}
function get_export_form(dialog) {
	var tram = '<select id="cbo-tram" class="form-select">';
	tram += `<option value="0">Chọn tủ điều khiển</option>`;
	for (var index in lib.sensor.setting.tram) {
		var item = lib.sensor.setting.tram[index];
		tram += `<option value="${item.id}">${item.kihieu} - ${item.name}</option>`;
	}
	tram += '</select>';
	var html = '<div class="pt-2 pe-2 mt-2 me-2"><div class="row mt-2">' +
		'<div class="col-md-5">Tủ điều khiển:</div>' +
		`<div class="col-md-7">${tram}</div>` +
		'</div>' +
		'<div class="row mt-2">' +
		'<div class="col-md-5">Thông số cần điều khiển:</div>' +
		`<div class="col-md-7"><select class="form-select" id="cbo-sensor" disabled><option value="0">Chọn tủ trước</option></select></div>` +
		'</div>' +
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
				if (item.tram == id_tram && item.loai == 'output') {
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
		if (['input', 'output'].includes(sensor.loai)) them_cot = '<th>Time End</th>';
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
export function show_dialog_dieukhien() {
	if (lib.user.setting.user_info.role <= 1) {
		lib.user.bao_loi("Bạn không có quyền");
		return;
	}
	$.confirm({
		title: 'Điều khiển từ xa',
		icon: 'fa-solid fa-gamepad',
		type: 'blue',
		content: 'Loading...',
		animation: 'rotateYR',
		closeAnimation: 'rotateYR',
		animationBounce: 1.5,
		animateFromElement: false,
		typeAnimated: false,
		closeIcon: true,
		columnClass: 'm',
		buttons: {
			control: {
				text: '<i class="fa-solid fa-gamepad"></i> Submit',
				btnClass: 'btn-primary',
				action: function () {
					if (lib.user.role <= 1) {
						lib.user.bao_loi("Bạn không đủ quyền điều khiển.");
						return false;
					}
					var data = {
						action: 'control_coil',
						tram: $('#cbo-tram').val(),
						sid: $('#cbo-sensor').val(),
						value: 1
					};
					if (data.sid == 0) {
						lib.user.bao_loi("Chưa chọn thông số cần điều khiển");
						return false;
					}
					if (data.value === '') {
						lib.user.bao_loi("Chưa chọn lệnh điều khiển ON or OFF");
						return false;
					}
					var ss = lib.sensor.setting.sensor[data.sid];
					var tr = lib.sensor.setting.tram[data.tram];
					var content = '<div class="table-view-sensor">' +
						'<p>Điều khiển tủ điện: <b>' + tr.kihieu + ' - ' + tr.name + '</b><br>' +
						'Bật nút bấm từ xa cho: <b>' + ss.name + '</b></p>' +
						'<hr>Hãy xác nhận (bằng cách đọc hiểu và đánh dấu vào các ô sau):' +
						'<ol>' +
						'<li id="antoan-0" style="color:red"><label><input type="checkbox" class="an-toan" data-at="0"> Đã được học về AN TOÀN LAO ĐỘNG</label></li>' +
						'<li id="antoan-1" style="color:red"><label><input type="checkbox" class="an-toan" data-at="1"> HIỂU BIẾT VỀ NGUY HIỂM của <b>' + ss.name + '</b></label></li>' +
						'<li id="antoan-2" style="color:red"><label><input type="checkbox" class="an-toan" data-at="2"> AN TOÀN điện được tuân thủ</label></li>' +
						'<li id="antoan-3" style="color:red"><label><input type="checkbox" class="an-toan" data-at="3"> THÔNG BÁO đến các bên liên quan</label></li>' +
						'<li id="antoan-4" style="color:red"><label><input type="checkbox" class="an-toan" data-at="4"> TÍNH MẠNG con người được an toàn</label></li>' +
						'<li id="antoan-5" style="color:red"><label><input type="checkbox" class="an-toan" data-at="5"> LƯU VẾT người điều khiển từ xa</label></li>' +
						'</ol>' +
						`<div class="mb-3 mt-3">` +
						`<label for="txt-xac-nhan" class="form-label">Nhập chữ AN TOAN 100%:</label>` +
						`<input type="text" class="form-control" id="txt-xac-nhan" placeholder="Gõ chữ AN TOAN 100%" value="" autocomplete="off" disabled>` +
						`</div></div>`;
					function xac_nhan(dialog) {
						$('#txt-xac-nhan').val('');
						dialog.buttons.ok.disable();
						$.post(api, data, function (json) {
							if (json.ok) {
								var title = "Điều khiển thành công";
								var content = json.msg;
								lib.toastr.tip('info', title, content);
								lib.user.thong_bao(title, content, 'fa-solid fa-circle-check');
								dialog.close();
							} else {
								lib.user.bao_loi(json.msg);
							}
						}, 'json');
					}
					$.confirm({
						title: 'Xác nhận AN TOÀN 100%',
						content: content,
						icon: 'fa-solid fa-skull-crossbones',
						columnClass: 'm',
						type: 'blue',
						animation: 'rotateYR',
						closeAnimation: 'rotateYR',
						animationBounce: 1.5,
						animateFromElement: false,
						closeIcon: true,
						autoClose: 'cancel|60000',
						buttons: {
							ok: {
								text: '<i class="fa-solid fa-skull-crossbones"></i> AN TOÀN',
								btnClass: 'btn-danger',
								isDisabled: true,
								action: function () {
									var dialog = this;
									$('#txt-xac-nhan').val('');
									dialog.buttons.ok.disable();
									$.confirm({
										title: 'Xác nhận AN TOÀN 100%',
										content: "NẾU CÒN NGHI NGỜ KHÔNG AN TOÀN!<br>BÂY GIỜ THAY ĐỔI VẪN CÒN KỊP!<p>Bạn có 15 giây để cân nhắc!</p>",
										icon: 'fa-solid fa-skull-crossbones',
										columnClass: 's',
										type: 'blue',
										animation: 'rotateYR',
										closeAnimation: 'rotateYR',
										animationBounce: 1.5,
										animateFromElement: false,
										closeIcon: true,
										autoClose: 'cancel|60000',
										buttons: {
											ok: {
												text: '<i class="fa-solid fa-skull-crossbones"></i> <span class="dem-lui-gui">VẪN GỬI</span>',
												btnClass: 'btn-danger nut-gui-lenh',
												isDisabled: true,
												action: function () {
													xac_nhan(dialog);
													this.close();
												}
											},
											cancel: {
												text: 'KHÔNG GỬI LỆNH NỮA',
												keys: ['esc', 'enter'],
												btnClass: 'btn-primary',
												action: function () {
													dialog.close();
													this.close();
												}
											}
										},
										onContentReady: function () {
											var wait_dialog = this;
											var dem_lui = 15;
											function dem_lui_so() {
												$('.dem-lui-gui').html(`Đợi ${dem_lui}s`);
												dem_lui--;
												if (dem_lui >= 0) {
													setTimeout(function () { dem_lui_so() }, 1000);
												} else {
													$('.dem-lui-gui').html(`VẪN GỬI`);
													wait_dialog.buttons.ok.enable();
												}
											}
											dem_lui_so();
										}
									});
									return false;
								}
							},
							cancel: {
								text: 'KHÔNG CHẮC CHẮN',
								keys: ['esc', 'enter'],
								btnClass: 'btn-primary',
								action: function () {
									this.close();
								}
							}
						},
						onContentReady: function () {
							var dialog = this;
							fix_dialog();
							const inputField = document.getElementById('txt-xac-nhan');

							// Ngăn dán vào input
							inputField.addEventListener('paste', function (event) {
								event.preventDefault();
								alert("Bạn không được dán nội dung vào ô này!");
							});

							// Kiểm tra khi người dùng nhập
							inputField.addEventListener('input', function () {
								const value = inputField.value.toLowerCase().trim();
								if ((value === "AN TOAN 100%") || (value === "an toan 100%") || (value === "an toàn 100%") || (value === "AN TOÀN 100%")) {
									dialog.buttons.ok.enable();
								} else {
									dialog.buttons.ok.disable();
								}
							});

							function checkAll(cb) {
								console.log(cb)
								const checkboxes = document.querySelectorAll('.an-toan');
								const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
								inputField.disabled = !allChecked;
								if (allChecked) {
									inputField.focus();
									lib.toastr.tip('error', 'Thông báo', 'Hãy nhập text: <b>AN TOAN 100%</b>')
								}

								// Change color of the corresponding <li> element
								checkboxes.forEach(checkbox => {
									const liElement = document.getElementById(`antoan-${checkbox.getAttribute('data-at')}`);
									if (checkbox.checked) {
										liElement.style.color = 'green';
									} else {
										liElement.style.color = 'red';
									}
								});
							}

							// Add event listener to all checkboxes
							const checkboxes = document.querySelectorAll('.an-toan');
							checkboxes.forEach(checkbox => {
								checkbox.addEventListener('change', checkAll);
							});
						}
					});

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
			get_export_form(this);
			fix_dialog();
		},
	});
}
export function main() {
}
