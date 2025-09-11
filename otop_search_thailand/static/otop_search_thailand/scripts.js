// DataTables ภาษาไทย
document.addEventListener('DOMContentLoaded', function() {
	if (window.jQuery && $('#otopTable').length) {
		var table = $('#otopTable').DataTable({
			language: {
				url: '//cdn.datatables.net/plug-ins/1.13.10/i18n/th.json'
			}
		});
		// Province filter
		$('#provinceFilter').on('change', function() {
			table.column(1).search(this.value).draw();
		});
		// Category filter
		$('#categoryFilter').on('change', function() {
			table.column(2).search(this.value).draw();
		});
		// Reset filters
		$('#resetFilters').on('click', function() {
			$('#provinceFilter').val('');
			$('#categoryFilter').val('');
			table.column(1).search('').column(2).search('').draw();
		});
	}

	// ปิดเมนู Mobile navbar หลังคลิก
	var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
	var navbarCollapse = document.getElementById('navbarResponsive');
	navLinks.forEach(function(link) {
		link.addEventListener('click', function() {
			if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
				new bootstrap.Collapse(navbarCollapse).hide();
			}
		});
	});

	// ตัวเลขนับขึ้น (stat-num)
	var statNums = document.querySelectorAll('.stat-num');
	if (statNums.length) {
		statNums.forEach(function(el) {
			var end = parseInt(el.textContent.replace(/,/g, ''));
			var duration = 1200;
			var start = 0;
			var step = Math.ceil(end / (duration / 16));
			var current = 0;
			el.textContent = '0';
			var counter = setInterval(function() {
				current += step;
				if (current >= end) {
					el.textContent = end.toLocaleString();
					clearInterval(counter);
				} else {
					el.textContent = current.toLocaleString();
				}
			}, 16);
		});
	}
});
