'use strict';
let lib = {};
export function set_lib(L) { lib = L; }

const api = '/api.aspx';

export const setting = {
	TNUT: {
		a7: { tang: 3, phong: 4, id: 7 },
		a8: { tang: 3, phong: 4, id: 8 },
		a9: { tang: 3, phong: 5, id: 9 },
		a10: { tang: 5, phong: 5, id: 10 },
		a16: { tang: 7, phong: 5, id: 16 },
	},
	STATUS: {
		1: 'free',
		2: 'hoc',
		3: 'fix',
	},
	TITLE: {
		1: 'Trống',
		2: 'Đang học',
		3: 'Đang sửa chữa nhé',
	},
	MAP: {},
	THONG_KE: { 1: 0, 2: 0, 3: 0 }
};
function set_status(item, p) {
	if (p.status == 1) {
		$(item).removeClass(setting.STATUS[2]).removeClass(setting.STATUS[3]).addClass(setting.STATUS[1]).attr('title', 'Phòng ' + p.name + ' đang không học');
	}
	else if (p.status == 2) {
		$(item).removeClass(setting.STATUS[1]).removeClass(setting.STATUS[3]).addClass(setting.STATUS[2]).attr('title', 'Phòng ' + p.name + ' đang học');
	}
	else if (p.status == 3) {
		$(item).removeClass(setting.STATUS[1]).removeClass(setting.STATUS[2]).addClass(setting.STATUS[3]).attr('title', 'Phòng ' + p.name + ' đang sửa chữa');
	}
}
function draw_nha(key) {
	var day_nha = setting.TNUT[key];
	var html = '<table class="table table-bordered">';
	html += '<tcaption>Giảng đường ' + key.toUpperCase() + '</tcaption>';
	for (var tang = day_nha.tang; tang >= 1; tang--) {
		html += '<tr>';
		for (var phong = 1; phong <= day_nha.phong; phong++) {
			var p = day_nha.id * 10000 + tang * 100 + phong;
			var item = setting.MAP[p];
			var status = setting.STATUS[item.status];
			var title = 'Phòng ' + item.name + ': ' + setting.TITLE[item.status];
			html += `<td class="phong-hoc ${status}" id="p${p}" data-key="${p}" title="${title}">`;
			html += (tang * 100 + phong);
			html += '</td>';
		}
		html += '</tr>';
	}
	$('#' + key).html(html);
}
function change_status(idPhong, status, callback) {
	//phải logined ok thì mới đc change status of idPhòng
	if (!lib.user.setting.logined) {
		//thông báo: mày chưa login, ko đc thay đổi, có muốn login ko
		//nếu có thì gọi hàm login() => show dialog nhập uid+pwd
		$.confirm({
			title: "Báo lỗi",
			icon: 'fa-solid fa-triangle-exclamation',
			type: 'red',
			content: "Muốn thay đổi trạng thái thì cần login?",
			animation: 'rotateYR',
			closeAnimation: 'rotateYR',
			animationBounce: 1.5,
			animateFromElement: false,
			columnClass: 's',
			closeIcon: true,
			buttons: {

				yes: {
					text: '<i class="fa fa-key"></i> Có Login ngay',
					btnClass: 'btn-primary',
					keys: ['y', 'c'],
					action: function () {
						lib.user.do_login();
					}
				},
				close: {
					text: '<i class="fa fa-circle-xmark"></i> Không',
					btnClass: 'btn-danger',
					keys: ['k', 'n'],
					action: function () {
					}
				},
			}
		})
		return; //để ko chạy phần dưới
	}
	$.post(api,
		{
			action: 'change_status',
			idPhong: idPhong,
			status: status
		},
		function (json) {
			if (json.ok) {
				//vẽ lại giao diện của html trong index
				set_status('#p' + idPhong, json)
				setting.MAP[idPhong] = json;
				thong_ke_lai();
				callback(json);
			} else {
				//lib.user.setting.logined = false; //đây là bug, bỏ nó đi
				bao_loi(json.msg);
			}
		},
		'json');
}
function bao_loi(msg, callback = null) {
	$.alert({
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
				text: 'OK',
				btnClass: 'btn-danger',
				keys: ['esc', 'enter'],
			}
		},
		onDestroy: function () {
			if (callback != null) callback()
		}
	});
}
//khi nào gọi hàm này?
//khi click vào 1 phòng, phòng đang ở class nào?? .phong-hoc
function get_history(idPhong) {
	function _get_history(idPhong, callback) {
		$.post(api,
			{
				action: 'get_history',
				idPhong: idPhong
			},
			function (json) {
				callback(json);
			}, 'json');
	}
	function get_html_history(json) {
		var html;
		if (json.ok) {
			//hậu xử lý ra html: đi ăn sáng đã: kệ nó quay
			//đã ăn xong, vào làm tiếp
			html = '<div class="table-responsive" style="height-max:100px">' +
				'<table class="table table-hover" id="table-history-phong"><thead>' +
				'<tr class="table-info">' +
				'<th>STT</th>' +
				'<th>Trạng thái</th>' +
				'<th>Người thay đổi</th>' +
				'<th>Thời gian</th>' +
				'</tr>' +
				'</thead><tbody>';
			//show html ra 1 dialog
			if (json.data) {
				var stt = json.data.length;
				for (var row of json.data) {
					html += '<tr>' +
						`<td>${stt--}</td>` +
						`<td>${setting.TITLE[row.status]}</td>` +
						`<td>${row.by}</td>` +
						`<td>${row.time}</td>` +
						'</tr>';
				}
			} else {
				html += '<tr class="table-warning">' +
					`<td colspan=3>KHÔNG CÓ DỮ LIỆU LỊCH SỬ</td>` +
					'</tr>';
			}
			html += '</tbody></table></div>';
		} else {
			html = json.msg; //báo lỗi của api
			lib.user.setting.logined = false;
		}
		return html;
	}
	function update_history(json, dialog) {
		var html = get_html_history(json);
		dialog.setContent(html);
		var status = json.data[0].status;
		if (status == 1) {
			dialog.buttons.free.hide();
			dialog.buttons.hoc.show();
			dialog.buttons.fix.show();
		} else if (status == 2) {
			dialog.buttons.free.show();
			dialog.buttons.hoc.hide();
			dialog.buttons.fix.show();
		} else if (status == 3) {
			dialog.buttons.free.show();
			dialog.buttons.hoc.show();
			dialog.buttons.fix.hide();
		}
	}
	function show_history(json) {
		var html = get_html_history(json);
		var dialog = $.confirm({
			title: 'Lịch sử thay đổi trạng thái phòng: ' + setting.MAP[idPhong].name,
			icon: 'fa-regular fa-clock',
			type: 'blue',
			content: html,
			animation: 'rotateXR',
			closeAnimation: 'rotateXR',
			animationBounce: 1.5,
			animateFromElement: false,
			columnClass: 'l',
			closeIcon: true,
			buttons: {
				fix: {
					text: '<span title="Chuyển phòng này sang trạng thái bận"><i class="fa-solid fa-screwdriver-wrench"></i> Đang Sửa</span>',
					btnClass: 'btn-danger',
					keys: ['b', 'f'],
					isHidden: setting.MAP[idPhong].status == 3,
					action: function () {
						//code để chuyển phòng này sang trạng đang sửa
						change_status(idPhong, 3, function () {
							_get_history(idPhong, function (json) { update_history(json, dialog); });
						});
						return false; // ko đóng
					}
				},
				hoc: {
					text: '<span title="Chuyển phòng này sang trạng thái học"><i class="fa-solid fa-people-roof"></i> Đang học</span>',
					btnClass: 'btn-blue',
					keys: ['h'],
					isHidden: setting.MAP[idPhong].status == 2,
					action: function () {
						//code để chuyển phòng này sang trạng đang học
						change_status(idPhong, 2, function () {
							_get_history(idPhong, function (json) { update_history(json, dialog); });
						});
						return false; // ko đóng
					}
				},
				free: {
					text: '<span title="Chuyển phòng này sang trạng phòng trống"><i class="fa-solid fa-house-circle-exclamation"></i> Phòng trống</span>',
					btnClass: 'btn-warning',
					keys: ['t'],
					isHidden: setting.MAP[idPhong].status == 1,
					action: function () {
						//code để chuyển phòng này sang trạng đang học
						change_status(idPhong, 1, function () {
							_get_history(idPhong, function (json) { update_history(json, dialog); });
						});
						return false; // ko đóng
					}
				},
				Close: {
					text: '<i class="fa fa-circle-xmark"></i> Đóng lại',
					btnClass: 'btn-secondary',
					keys: ['esc'],
					action: function () {
						//ko làm gì
						this.close();
					}
				}
			},
			onContentReady: function () {
				lib.table.sort_table('#table-history-phong', "Log history " + setting.MAP[idPhong].name, 10);
			},
		});

	};

	_get_history(idPhong, show_history)
}
function get_status(key, callback) {
	var day_nha = setting.TNUT[key];
	var ok = false;
	var json_str = localStorage.getItem('get_status_' + key);
	if (json_str != null) {
		var json = JSON.parse(json_str);
		if (json.ok == 1) {
			console.log('Load cache get_status_' + key);
			for (var item of json.data) {
				setting.MAP[item.id] = item;
			}
			callback(key);
			ok = true;
		}
	}
	if (ok) return;
	$.post(api,
		{
			action: 'get_status',
			idDay: day_nha.id
		},
		function (json) {
			if (json.ok) {
				console.log('Load api get_status_' + key);
				localStorage.setItem('get_status_' + key, JSON.stringify(json));
				for (var item of json.data) {
					setting.MAP[item.id] = item;
				}
				callback(key);
			} else {
				//bao loi
			}
		},
		'json');
}
function thong_ke_lai() {
	setting.THONG_KE[1] = setting.THONG_KE[2] = setting.THONG_KE[3] = 0;
	for (var key in setting.MAP) {
		var item = setting.MAP[key];
		setting.THONG_KE[item.status]++;
	}
	show_thong_ke();
}
function show_thong_ke() {
	function boc(a, b, c) {
		return ` ${a}: <span class="badge rounded-pill ${b}">${c}</span>`;
	}
	var html = boc("Đang học", "bg-info", setting.THONG_KE[2]) + boc("Trống", "bg-warning", setting.THONG_KE[1]) + boc("Sửa", "bg-danger", setting.THONG_KE[3]);
	$('#thong-ke').html(html);
}
function cap_nhat_trang_thai() {
	for (var key in setting.TNUT) {
		get_status(key, function (key) {

		})
	}
}
export function main() {
	//F5 thì mất biết logined => ko có thông tin user, hide Logout
	//mỗi vào trang thì hỏi api xem cookie chứa sid có ok ko?

	var dem = 0;
	for (var key in setting.TNUT) {
		get_status(key, function (key) {
			draw_nha(key);
			dem++; //vì get_status là hàm bất đồng bộ nên 1 lúc nó mới xong
			if (dem == 5) { //đã xong 5 toà nhà
				//thì mới đăng ký sự kiện click 1 thể
				localStorage.setItem('MAP', JSON.stringify(setting.MAP));
				$('.phong-hoc').click(function () {
					//alert('test click vào phòng học');
					//lấy id phòng:
					var id = $(this).data('key')
					get_history(id);
				});
				thong_ke_lai();
				setInterval(function () {
					//cap_nhat_trang_thai();
				}, 20000);
			}
		});
	}
}

$(".toa-nha").draggable();