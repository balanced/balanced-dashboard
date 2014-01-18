Balanced.MarketplaceUploadPaymentsCsvColumnsMapping = Balanced.WizardStepView.extend({

	actions: {
		submit: function() {
			var c = this.get("controller");
			c.setColumnsMapping({});
		}
	}
});
