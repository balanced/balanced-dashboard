(function(ctx) {
	var balanced = ctx.balanced = {
		menu: function() {
			$('#marketplace-nav > ul > li > a').click(function(e) {
				$('#marketplace-nav .submenu').removeClass('selected');
			});
		}
	}
})(window);
