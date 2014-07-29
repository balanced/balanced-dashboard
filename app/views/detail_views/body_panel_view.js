Balanced.BodyPanelView = Ember.View.extend({
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
		var documentHeight = document.body.scrollHeight;
		var sidePanelTop = $('.side-panel').offset().top;
		// var sidePanelBottom = $('.side-panel').height() + sidePanelTop;
		console.log(documentHeight, sidePanelTop, documentHeight - sidePanelTop)
		$('.side-panel').height(documentHeight - sidePanelTop);
	}
});
