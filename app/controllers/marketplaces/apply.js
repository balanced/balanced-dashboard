Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({
	isGuest: Ember.computed.oneWay('auth.isGuest'),

	dobDays: Balanced.TIME.DAYS_IN_MONTH,
	dobMonths: Balanced.TIME.MONTHS,
	dobYears: function() {
		var start = new Date().getFullYear() - 17;
		return _.times(80, function (i) {
			return start - i
		});
	}.property(),

	accountTypes: Balanced.BankAccount.ACCOUNT_TYPES,

	getUser: function() {
		var self = this;
		return new Ember.RSVP.Promise(function(reseolve, reject) {
			if (self.get("isGuest")) {

			}
		});
	},

	actions: {
		selectType: function(applicationType) {
			this.get('content').set('applicationType', applicationType);

			$('#marketplace-apply input:text').filter(function() {
				return $(this).val() === "";
			}).first().focus();
		},

		save: function() {
			var model = this.get("model");
			var self = this;
			model.validate();
			if (model.get("isValid")) {
				model.save()
					.then(function(marketplace) {
						self.transitionTo('marketplace.initial_deposit', marketplace);
						self.send('alert', {
							type: 'success',
							message: 'We\'ve received your information. In the meantime, you may fund your balance with your credit card to transact right away.'
						});
					})
					.catch(function(error) {
						Balanced.ErrorsLogger.captureMessage("Balanced.ProductionAccessRequest", {
							extra: {
								formFields: model.getErrorObject(),
								marketplaceId: model.get("marketplace.id")
							}
						});
					});
			}
		},
	},
});
