import BaseSummarySection from "./summary-section-base";

var DisputeSummarySectionView = BaseSummarySection.extend({
	generateItems: function() {
		var model = this.get("model");
		this.addLabel("Status", "status");
		this.addSummaryItem("dispute-status", {
			model: model
		});

		this.addLabel("Customer", "customers");
		this.addSummaryItem("customer", {
			modelBinding: "summaryView.customer",
			summaryView: this
		});

		this.addLabel("Funding instrument label", {
			textBinding: "summaryView.fundingInstrumentLabelText",
			iconBinding: "summaryView.fundingInstrumentLabelIcon",
			summaryView: this
		});
		this.addSummaryItem("funding-instrument", {
			modelBinding: "summaryView.fundingInstrument",
			summaryView: this
		});
	},

	customer: Ember.computed.reads("model.transaction.customer"),

	fundingInstrument: Ember.computed.reads("model.transaction.source"),
	fundingInstrumentLabelText: Ember.computed("fundingInstrument.isCard", function() {
		var isCard = this.get("fundingInstrument.isCard");
		if (Ember.isBlank(isCard)) {
			return "Source";
		}
		else {
			return isCard ? "Source card" : "Source bank account";
		}
	}),

	fundingInstrumentLabelIcon: Ember.computed("fundingInstrument.isCard", function() {
		var isCard = this.get("fundingInstrument.isCard");
		if (!Ember.isBlank(isCard)) {
			return isCard ? "card" : "bank-account";
		}
	}),
});

export default DisputeSummarySectionView;
