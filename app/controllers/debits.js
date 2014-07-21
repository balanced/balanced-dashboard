Balanced.DebitsController = Balanced.ObjectController.extend({
	needs: ['marketplace'],
	pageType: function() {
		return Balanced.Utils.capitalize(this.get("model.type_name"));
	}.property("model.type_name"),

	pageTitle: function() {
		return Balanced.Utils.formatCurrency(this.get("model.amount"));
	}.property("model.amount"),

});
