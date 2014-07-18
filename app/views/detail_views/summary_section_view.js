Balanced.SummarySectionView = Balanced.View.extend({
	templateName: "detail_views/summary_section",

	resourceLinks: function() {
		var self = this;
		var args = _.toArray(arguments);

		return args.map(function(resourceName) {
			return self.generateResourceLink(self.get(resourceName));
		}).compact();
	},

	generateResourceLink: function(model) {
		if (Ember.isBlank(model)) {
			return;
		}
		if (model.constructor === Balanced.Customer) {
			return this.linkedResource('icon-customers', 'Customer', model, model.get('display_me'));
		}
	},

	linkedResource: function(className, title, resourceModel, value) {
		return {
			className: className,
			title: title,
			resource: resourceModel,
			value: value
		};
	}
});

Balanced.CustomerSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		if (this.get('model.status') === 'unverified') {
			return 'You may credit this customer, but we recommend collecting more information of this customer for underwriting purposes.';
		}
		return null;
	}.property('model.status'),

	learnMore: function() {
		return {
			className: 'learn-more-unverified',
			text: "For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
		};
	}.property()

});

Balanced.CardSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property("model.customer")
});

Balanced.BankAccountSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer')
});
