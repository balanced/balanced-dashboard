Balanced.PageNavigationView = Ember.View.extend({
	layoutName: "page_navigations/page_navigation_layout",
});

Balanced.TransactionsPageNavigationView = Balanced.PageNavigationView.extend({
	templateName: 'page_navigations/page_navigation_actions',
	title: "Transactions",
	actionButtons: function() {
		return [{
			modalViewName: Balanced.DebitNewFundingInstrumentModalView,
			buttonName: 'Debit a card'
		}, {
			modalViewName: Balanced.CreditNewFundingInstrumentModalView,
			buttonName: 'Credit a bank account'
		}];
	}.property()

});

Balanced.CustomerPageNavigationView = Balanced.PageNavigationView.extend({
	templateName: 'page_navigations/page_navigation_actions',
	pageType: 'Customer',
	title: Ember.computed.oneWay("model.display_me"),
	actionButtons: function() {
		return [{
			modalViewName: Balanced.CreditCustomerModalView,
			buttonName: 'Credit'
		}, {
			modalViewName: Balanced.DebitCustomerModalView,
			buttonName: 'Debit'
		}];
	}.property()
});
