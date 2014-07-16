Balanced.BodyPanelView = Ember.View.extend({
	classNames: ['body-panel', 'clearfix'],

	didInsertElement: function() {
		var self = this;

		Ember.run(function() {
			self.updatePanelHeight();

			$(window).resize(function() {
				self.updatePanelHeight();
			});
		})
	},

	updatePanelHeight: function() {
		var windowHeight = $(window).height();
		var sidePanelBottom = $('.side-panel').height() + $('.side-panel').offset().top;

		if (windowHeight > sidePanelBottom) {
			var positionTop = $('.side-panel').offset().top;
			$('.side-panel').height(windowHeight - positionTop);
		}
	}
});
