import CsvUploadCellView from "./csv-upload-cell";
import Utils from "balanced-dashboard/lib/utils";

var CurrencyCsvUploadCellView = CsvUploadCellView.extend({
	templateName: "import-payouts/default-csv-upload-cell",

	amount: Ember.computed.reads("item.credit.amount"),

	displayValue: function() {
		if (this.get("isError")) {
			return this._super();
		} else {
			return Utils.formatCurrency(this.get("amount"));
		}
	}.property("amount", "isError")
});

export default CurrencyCsvUploadCellView;
