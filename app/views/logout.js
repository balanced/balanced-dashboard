Balanced.LogoutView = Balanced.View.extend({
	templateName: 'logout',
	didInsertElement: function() {
		$(document.body).addClass('light-bg');
		$('footer').css('display', 'none');
		$('#content').addClass('no-min-height');

		this._super();
	},
	willDestroyElement: function() {
		$(document.body).removeClass('light-bg');
		$('footer').css('display', 'block');
		$('#content').removeClass('no-min-height');

		this._super();
	}
});
