import Ember from "ember";
import MarketplaceCsvPaymentsTableView from "./marketplace-csv-payments-table";

var MarketplaceValidCsvPaymentsTableView = MarketplaceCsvPaymentsTableView.extend({
	validityAdjective: "valid",
});

export default MarketplaceCsvPaymentsTableView;
