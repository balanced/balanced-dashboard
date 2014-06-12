Balanced.MarketplaceInitialDepositController = Balanced.ObjectController.extend({
	needs: ['marketplace'],
	loadingMessage: 'Verifying...',

	marketplace: Ember.computed.oneWay("controllers.marketplace.model"),

	initialAmounts: function() {
		return _.map([10, 25, 50, 100], function(amount) {
			return {
				amount: "" + amount,
				formatted: Balanced.Utils.formatCurrency(amount * 100)
			};
		});
	}.property(),

	expirationMonths: Balanced.TIME.MONTHS,
	expirationYears: function() {
		var start = new Date().getFullYear();
		return _.times(10, function(i) {
			return start + i;
		});
	}.property(),

	transactionModel: function() {
		return Balanced.InitialDepositTransactionFactory.create();
	}.property(),

	isSaving: false,

	actions: {
		submit: function() {
			var self = this;
			var model = this.get("transactionModel");
			var marketplace = this.get("marketplace");
			model.set("marketplace", marketplace);
			model.validate();

			if (model.get("isValid")) {
				self.set("isSaving", true);
				model.save().then(function(credit) {
					self.transitionToRoute('activity', marketplace);
				}).
				finally(function() {
					self.set("isSaving", false);
				});
			}
		},
	},
});
