import Ember from "ember";
import Login from "../models/login";

export default Ember.View.extend({
	layoutName: 'page-form',
	pageTitle: 'Sign in',

	afterFormLink: function() {
		return {
			linkTo: 'setup_guest_user',
			linkText: 'Create an account'
		};
	}.property(),

	model: Ember.computed.oneWay("controller.model"),

	didInsertElement: function() {
		$('form input:first').focus();
	},

	keyDown: function(e) {
		// Lets make sure we are in the login view
		if (this.templateName !== 'login') {
			return;
		}

		this.get('controller').send('reset');
	}
});
