'use strict';
let lib = {};
export function set_lib(L) { lib = L; }
export function main() { }
export function sort_table(id, fn, pageLength_) {
	$('.jconfirm-holder').width($('.jconfirm-open').width());
	let pageLength = 10;
	if (pageLength_) pageLength = pageLength_;
	if (!fn) fn = "Export";
	$(id).DataTable({
		dom: 'Bfrtip',
		"pageLength": pageLength,
		buttons: [
			{
				text:'<span title="Copy table data to clipboard, will paste to Excel"><i class="fa-solid fa-copy"></i> Copy</span>',
				extend: 'copyHtml5',
				title: fn
			},
			{
				text: '<span title="Download Excel"><i class="fa-solid fa-file-excel"></i> Excel <i class="fa-solid fa-download"></i></span>',
				extend: 'excelHtml5',
				title: fn
			}
		],
		"order": [],
		"language": {
			"decimal": "",
			"emptyTable": "Không có dữ liệu",
			"info": "Hiển thị từ _START_ đến _END_ / tổng _TOTAL_",
			"infoEmpty": "Showing 0 to 0 of 0 entries",
			"infoFiltered": "(Lọc ra trong _MAX_ tổng số dòng)",
			"infoPostFix": "",
			"thousands": ",",
			"lengthMenu": "Hiển thị _MENU_ entries",
			"loadingRecords": "Loading...",
			"processing": "Processing...",
			"search": "Tìm kiếm:",
			"zeroRecords": "Không tìm thấy lớp nào phù hợp",
			"paginate": {
				"first": "Trang đầu",
				"last": "Trang cuối",
				"next": '<i class="fa-solid fa-circle-right" title="Trang sau"></i>',
				"previous": '<i class="fa-solid fa-circle-left" title="Trang trước"></i>'
			},
			"aria": {
				"sortAscending": ": Sắp xếp tăng dần",
				"sortDescending": ": Sắp xếp giảm dần"
			}
		}
	});
	$('.jconfirm-holder').width($('.jconfirm-open').width());
}