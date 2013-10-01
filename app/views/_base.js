Balanced.View = Ember.View.extend({
	didInsertElement: function() {
		this.set('elementInDom', true);
		this._super();
	},

	willDestroyElement: function() {
		this.set('elementInDom', false);
		this._super();
	}
});
