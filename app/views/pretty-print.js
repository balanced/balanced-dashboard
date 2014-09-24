import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";

var PrettyPrintView = Ember.View.extend({
	templateName: 'pretty-print',
	content: null,

	didInsertElement: function() {
		Ember.run.scheduleOnce('afterRender', this, this.format);
		this._super();
	},

	format: function() {
		this.$('.prettyprinted').removeClass('prettyprinted');
		this.$('.prettyprint').text(Utils.prettyPrint(this.get('content')));
		prettyPrint();
	}.observes('content')
});

export default PrettyPrintView;
