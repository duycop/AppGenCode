$(function () {

	/**
	 * KỸ THUẬT CALLBACK TRONG JS
	 * 
	 * ĐỊNH NGHĨA 1 HÀM JS: CÓ THAM SỐ TÊN LÀ CALLBACK
	 * 
	 * TRONG THÂN HÀM NÀY CÓ LỜI GỌI TỚI HÀM CALLBACK + TRUYỀN THAM SỐ
	 * 
	 * NƠI KHÁC GỌI HÀM CÓ THAM SỐ CALLBACK
	 * 
	 * TẠI VỊ  TRÍ CỦA THAM SỐ NÀY: TRUYỀN VÀO 1 TÊN HÀM (NẾU HÀM NÀY DÙNG NHIỀU: cb_h1)
	 * hoặc dùng 1 hàm ko tên: dòng 39..45: làm hàm ko có tên sẽ xử lý riêng
	 * 
	 * 
	 * 
	 */

	var dem = {};
	window.dem = dem;
	function demso(selector, callback) {  //hàm có 2 tham số, tham số thứ 2 là loại callback, đặt tên ts thứ 2 là j cũng đc, nên dùng từ callback cho khỏi nhầm kỹ thuật
		dem[selector] = dem[selector] || 0;
		dem[selector]++;
		$(selector).html('Đang đếm đến số ' + dem[selector]);
		callback(dem[selector]);  //dùng như 1 hàm, luôn có callback(); khi ko có ts, còn có  ts thì truyền vào
	}
	function xu_ly_h1() {
		demso('h1', cb_h1);
	}
	var dem_rieng = 0;

	function cb_h1(so) {
		if (so >= 10)
			dem['h1'] = 0;
	}

	
	function xu_ly_h2() {
		demso('h2',
			function (so) { 
				if (so >= 5) {
					dem['h2'] = 0;
					dem_rieng++;
					$('h3').html('số lần reset h2=' + dem_rieng)
				}
			}
		);
	}
	$('h1').click(function () { xu_ly_h1(); });
	$('h2').click(function () { xu_ly_h2(); });

	//hàm ko tên thì ai gọi? : callback cần
	//hàm ko tên tự chạy
	//(function (a, b, c, d) { c('#' + b).html('biến a = ' + d(a)) })(12, 'hehe', $, function (b) { return b+ 100; });
});