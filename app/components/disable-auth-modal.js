import Ember from "ember";

var DisableAuthModalComponent = Ember.Component.extend({
	classNames: ['modal-container'],

	willDestroyElement: function() {
		this.hide();
	},

	hide: function() {
		$('#disable-mfa').modal('hide');
	},

	open: function() {
		$('#disable-mfa').modal({
			manager: this.$()
		});
	},

	actions: {
		submit: function() {
			this.hide();
			this.get('targetObject').send('disableAuth');
		}
	}
});

export default DisableAuthModalComponent;
