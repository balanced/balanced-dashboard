import BaseSummarySection from "./summary-section-base";
import Utils from "balanced-dashboard/lib/utils";

var BankAccountSummarySectionView = BaseSummarySection.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("bank-account-status", {
			model: model
		});

		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			modelBinding: "fundingInstrument.customer", fundingInstrument: model
		});
	},
});

export default BankAccountSummarySectionView;
