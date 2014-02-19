Balanced.View = Ember.View.extend({
	didInsertElement: function() {
		this.set('elementInDom', true);
		this._super();

		this.$('form input[type=text]:first').focus();
	},

	willDestroyElement: function() {
		this.set('elementInDom', false);
		this._super();
	}
});
