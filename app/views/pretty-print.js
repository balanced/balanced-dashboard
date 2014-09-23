import Ember from "ember";

var PrettyPrintView = Ember.View.extend({
	templateName: 'pretty-print',
	content: null,

	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, this.format);
		this._super();
	},

	format: function() {
		this.$('.prettyprinted').removeClass('prettyprinted');
		this.$('.prettyprint').text(Balanced.Utils.prettyPrint(this.get('content')));
		prettyPrint();
	}.observes('content')
});

export default PrettyPrintView;
