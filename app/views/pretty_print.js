Balanced.PrettyPrintView = Balanced.View.extend({
	templateName: 'prettyPrint',
	content: null,

	didInsertElement: function() {
		console.log('didInsertElement');
		Ember.run.scheduleOnce('afterRender', this, this.format);

		this._super();
	},

	format: function() {
		this.$('.prettyprinted').removeClass('prettyprinted');
		this.$('.prettyprint').text(Balanced.Utils.prettyPrint(this.get('content')));
		prettyPrint();
	}.observes('content')
});
