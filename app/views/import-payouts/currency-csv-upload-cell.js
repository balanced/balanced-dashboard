import CsvUploadCellView from "./csv-upload-cell";
import Utils from "balanced-dashboard/lib/utils";

var CurrencyCsvUploadCellView = CsvUploadCellView.extend({
	templateName: "import_payouts/default_csv_upload_cell",

	displayValue: function() {
		if (this.get("isError")) {
			return this._super();
		} else {
			return Utils.formatCurrency(this.get("context.credit.amount"));
		}
	}.property("fieldValue", "hasIsRequiredError", "isError")
});

export default CurrencyCsvUploadCellView;
