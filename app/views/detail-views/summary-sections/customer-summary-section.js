import SummarySectionView from "./summary-section";

var CustomerSummarySectionView = SummarySectionView.extend({
	statusText: function() {
		if (this.get('model.status') === 'unverified') {
			return 'You may credit this customer, but we recommend collecting more information from this customer for underwriting purposes.';
		}
		return null;
	}.property('model.status'),

	learnMore: function() {
		return {
			className: 'learn-more-unverified',
			text: "For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
		};
	}.property(),
});

export default CustomerSummarySectionView;
