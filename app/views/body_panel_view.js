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
		var maxHeight = $(window).height();
		var positionTop = $('.body-panel').offset().top;
		$('.side-panel').height(maxHeight - positionTop);
	}
});
