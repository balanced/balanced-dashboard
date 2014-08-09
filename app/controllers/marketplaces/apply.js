var generateYears = function(times, start) {
	return _.times(times, function(i) {
		return start - i;
	});
};

Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({
	needs: ["temporary_alerts"],

	// When the user visits the page directly the auth.isGuest variable is not setup.
	isGuest: function() {
		var result = this.get('auth.isGuest');
		return result === undefined || result;
	}.property("auth.isGuest").readOnly(),

	companyTypes: Balanced.Marketplace.COMPANY_TYPES,

	streetAddressHint: function() {
		if (this.get("model.isBusiness")) {
			return "Enter your or another business representative's address including apartment, suite, or unit number, not the business address";
		} else {
			return "Enter your billing address including apartment, suite, or unit number";
		}
	}.property("model.isBusiness"),

	dateDays: Balanced.TIME.DAYS_IN_MONTH,
	dateMonths: Balanced.TIME.MONTHS,
	dateYears: function() {
		return generateYears(80, new Date().getFullYear() - 17);
	}.property(),

	incorporationDateYears: function() {
		return generateYears(80, new Date().getFullYear());
	}.property(),

	accountTypes: Balanced.BankAccount.ACCOUNT_TYPES,

	actions: {
		selectType: function(applicationType) {
			this.get('content').set('applicationType', applicationType);

			$('#marketplace-apply input:text').filter(function() {
				return $(this).val() === "";
			}).first().focus();
		},

		save: function() {
			var self = this;
			var model = this.get("model");

			model.validate();
			model.logValidationErrors();

			if (model.get("isValid")) {
				Balanced.Utils.setCurrentMarketplace(null);
				Balanced.Auth.unsetAPIKey();
				model.save()
					.then(function(marketplace) {
						var message = 'We\'ve received your information. In the meantime, you may fund your balance with your credit card to transact right away.';
						if (marketplace) {
							self.transitionToRoute('marketplace.initial_deposit', marketplace);
							self.get("controllers.temporary_alerts").alertSucces(message);
						}
					});
			}
		},
	},
});
