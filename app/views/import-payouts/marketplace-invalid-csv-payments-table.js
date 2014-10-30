import Ember from "ember";
import MarketplaceCsvPaymentsTableView from "./marketplace-csv-payments-table";

var MarketplaceInvalidCsvPaymentsTableView = MarketplaceCsvPaymentsTableView.extend({
	validityAdjective: "invalid",
	isError: true,
});

export default MarketplaceInvalidCsvPaymentsTableView;
