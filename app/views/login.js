import Ember from "ember";

export default Ember.View.extend({
	layoutName: 'page-form',
	pageTitle: 'Sign in',
	model: Ember.computed.oneWay("controller.model"),

	afterFormLink: function() {
		return {
			linkTo: 'setup_guest_user',
			linkText: 'Create an account'
		};
	}.property(),

	didInsertElement: function() {
		$('form input:first').focus();
	},

	keyDown: function(e) {
		if (this.templateName === 'login') {
			this.get('controller').send('reset');
		}
	}
});
