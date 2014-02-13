Balanced.LogoutView = Balanced.View.extend({
	templateName: 'logout',
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
	}
});
