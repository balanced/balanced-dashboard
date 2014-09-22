import Ember from "ember";

var BodyPanelView = Ember.View.extend({
	classNames: ['body-panel', 'clearfix'],

	didInsertElement: function() {
		var self = this;

		Ember.run(function() {
			self.updatePanelHeight();

			$(window).resize(function() {
				self.updatePanelHeight();
			});
		});
	},

	updatePanelHeight: function() {
		var windowHeight = $(window).height();
		var sidePanelTop = $('.side-panel').offset().top;
		var sidePanelBottom = $('.side-panel').height() + sidePanelTop;

		if (windowHeight > sidePanelBottom) {
			$('.side-panel').height(windowHeight - sidePanelTop);
		}
	}
});

export default BodyPanelView;
