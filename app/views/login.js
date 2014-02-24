Balanced.LoginView = Balanced.View.extend({
	templateName: 'login',
	didInsertElement: function() {
		$('body').addClass('light-bg');
		$('footer').css('display', 'none');
		$('#content').addClass('no-min-height');

		this._super();
	},
	willDestroyElement: function() {
		$('body').removeClass('light-bg');
		$('footer').css('display', 'block');
		$('#content').removeClass('no-min-height');

		this._super();
	},
	keyDown: function(e) {
		// Lets make sure we are in the login view
		if (this.templateName !== 'login') {
			return;
		}

		this.get('controller').send('reset');
	}
});
