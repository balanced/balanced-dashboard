import ResultsTableView from "././results-table";
import Utils from "balanced-dashboard/lib/utils";

var InvoiceTableView = ResultsTableView.extend({
	classNames: ['invoice', 'non-interactive'],
	templateName: 'results/invoice-table',

	getValue: function(field) {
		var model = this.get("model");

		if (model) {
			return model.get(field);
		}
		return null;
	},

	fees: function() {
		var feesByType = this.get("feesByType");
		var self = this;
		return feesByType.map(function(fee) {
			var rowObject = Ember.Object.create({
				className: fee.className,
				type: fee.type,
				quantity: Utils.formatNumber(self.getValue(fee.quantity)),
				txnAmount: Utils.formatCurrency(self.getValue(fee.txnAmount)),
				fee: Utils.safeFormat(fee.fee).htmlSafe(),
				totalFee: Utils.formatCurrency(self.getValue(fee.totalFee))
			});

			if (fee.primary) {
				rowObject.set("primary", fee.primary);
				rowObject.set("secondary", fee.secondary);
			}

			return rowObject;
		});
	}.property(),

	feesByType: function() {
		if (this.get("model.isDispute")) {
			return [{
				className: "dispute-details-row",
				type: "Dispute",
				quantity: "disputes_count",
				txnAmount: "disputes_total_amount",
				fee: "%@ per dispute".fmt(Utils.formatCurrency(this.get("model.dispute_fixed_fee"))),
				totalFee: "disputes_total_fee"
			}];
		}

		return [{
				className: "hold-details-row",
				type: "Hold",
				quantity: "holds_count",
				txnAmount: "holds_total_amount",
				fee: "%@ per hold".fmt(Utils.formatCurrency(this.get("model.hold_fee"))),
				totalFee: "holds_total_fee"
			}, {
				className: "card-debit-details-row",
				primary: "Debit",
				secondary: "Cards",
				quantity: "card_debits_count",
				txnAmount: "card_debits_total_amount",
				fee: "%@% of txn + %@".fmt(this.get("model.variable_fee_percentage"), Utils.formatCurrency(this.get("model.card_debit_fixed_fee"))),
				totalFee: "card_debits_total_fee"
			}, {
				className: "bank-account-debit-details-row",
				primary: "Debit",
				secondary: "Bank accounts",
				quantity: "bank_account_debits_count",
				txnAmount: "bank_account_debits_total_amount",
				fee: "%@% of txn + $0.30 (%@ cap)".fmt(this.get("model.bank_account_debit_variable_fee_percentage"), Utils.formatCurrency(this.get("model.bank_account_debit_variable_fee_cap"))),
				totalFee: "bank_account_debits_total_fee"
			}, {
				className: "succeeded-bank-account-credit-details-row",
				primary: "Credit",
				secondary: "Succeeded",
				quantity: "bank_account_credits_count",
				txnAmount: "bank_account_credits_total_amount",
				fee: "%@ per credit".fmt(Utils.formatCurrency(this.get("model.bank_account_credit_fee"))),
				totalFee: "bank_account_credits_total_fee"
			}, {
				className: "succeeded-card-credit-details-row",
				primary: "Credit",
				secondary: "Push to card",
				quantity: "card_credits_count",
				txnAmount: "card_credits_total_amount",
				fee: "%@ per credit".fmt(Utils.formatCurrency(this.get("model.card_credit_fixed_fee"))),
				totalFee: "card_credits_total_fee"
			}, {
				className: "refund-details-row",
				type: "Refund",
				quantity: "refunds_count",
				txnAmount: "refunds_total_amount",
				fee: "%@% of txn amount returned".fmt(this.get("model.variable_fee_percentage")),
				totalFee: "refunds_total_fee"
			}];
	}.property("model.isDispute")
});

export default InvoiceTableView;
