Balanced.PageNavigationView = Ember.View.extend({
	templateName: 'page_navigation',

});

Balanced.CustomerPageNavigationView = Balanced.PageNavigationView.extend({
	pageType: 'Customer',
	actionClassNames: ['credit-customer'],
	actionButtons: function() {
		return [{
			modalViewName: Balanced.CreditCustomerModalView,
			buttonName: 'Credit'
		}, {
			modalViewName: Balanced.DebitCustomerModalView,
			buttonName: 'Debit'
		}]
	}.property()
});
