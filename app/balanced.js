(function(ctx) {
	var balanced = ctx.balanced = {
		menu: function() {
			var submenu = $('#marketplace-nav .submenu');

			$('#marketplace-nav > ul > li > a').click(function(e) {
				submenu.removeClass('expanded');
				submenu.prev().removeClass('expanded');

				if ($(this).next().hasClass('submenu')) {
					$(this).addClass('expanded');
					$(this).next().addClass('expanded');
				}
			});

			var activeCategory = submenu.find('.active').parent().parent();

			activeCategory.addClass('expanded');
			activeCategory.prev().addClass('expanded');
		}
	};
})(window);
