import Ember from "ember";
import MarketplaceCsvPaymentsTableView from "./marketplace-csv-payments-table";

var MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	validityAdjective: "invalid",
	isError: true,
	items: Ember.computed.alias("creditCreators.invalid")
});

export default MarketplaceInvalidCsvPaymentsTableView;
