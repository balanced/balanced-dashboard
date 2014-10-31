import Computed from "balanced-dashboard/utils/computed";
import Ember from "ember";

var ImportPayoutsView = Ember.View.extend({

	title: function() {
		return this.get("creditCreators.isDataMissing") ?
			"Upload your file" :
			"Payout summary";
	}.property("creditCreators.isDataMissing"),

	creditCreators: Ember.computed.readOnly("controller.creditCreators"),

	payoutTotal: Computed.sum("creditCreators.valid", "credit.amount"),
	escrowTotal: Ember.computed.oneWay("controller.controllers.marketplace.in_escrow").readOnly(),
	escrowDifference: Computed.subtract("escrowTotal", "payoutTotal").readOnly(),

	isEscrowValid: Ember.computed.gte("escrowDifference", 0),
	isPreviewable: Ember.computed.and("isEscrowValid", "creditCreators.isLoaded"),

	getProgressModal: function(modalName) {
		var controller = this.get("container").lookup("controller:modals-container");
		return controller.open(modalName);
	},

	updateReaderBody: function(text) {
		var modal = this.getProgressModal("import-payouts/parse-credits-csv-progress-bar-modal");
		this.get("controller").refresh(text);
		modal.refresh(this.get("creditCreators"));
		setTimeout(function() {
			if (modal.get("isCompleted")) {
				modal.close();
			}
		}, 300);
	},

	actions: {
		reset: function() {
			this.updateReaderBody();
		},

		submit: function() {
			var modal = this.getProgressModal("import-payouts/save-credits-csv-progress-bar-modal");
			modal.refresh(this.get("creditCreators"));
			this.get("controller").save(function() {
				modal.close();
			});
		},

		fileSelectionChanged: function() {
			var self = this;
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function(event) {
				var text = event.target.result;
				self.updateReaderBody(text);
			};
			reader.readAsText(file);
		}
	}
});

export default ImportPayoutsView;
