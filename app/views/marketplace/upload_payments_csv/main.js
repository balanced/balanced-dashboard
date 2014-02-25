require("app/views/modals/progress_bar_modal");

Balanced.ParseCreditsCsvProgressBarModalView = Balanced.ProgressBarModalView.extend({
	title: "Checking File",
	isCancelable: "true",

	loadedCount: function() {
		var collection = this.get("collection") || [];
		return collection.filterBy("isLoaded").get("length");
	}.property("collection", "collection.@each.isLoaded"),

	progressText: function() {
		var num = this.get("loadedCount");
		var den = this.get("collection.length") || 0;
		return "%@/%@".fmt(num, den);
	}.property("loadedCount", "collection.length"),

	updateProgressBar: function() {
		var num = this.get("loadedCount");
		var den = this.get("collection.length") || 0;
		this.setProgressBarFraction(num / den);
	}.observes("progressText"),

	loadedObserver: function() {
		if (this.get("collection.isLoaded")) {
			setTimeout(function() {
				this.hide();
			}.bind(this), 500);
		}
	}.observes("collection.isLoaded"),

	actions: {
		cancel: function() {
			this.get("parentView.controller").refresh(undefined);
			this.hide();
		}
	}
});

Balanced.MarketplaceUploadPaymentsCsvView = Ember.View.extend({

	creditCreators: Ember.computed.alias("controller.creditCreators"),

	payoutTotal: Balanced.computed.sum("creditCreators.valid", "credit.amount"),
	escrowTotal: Ember.computed.alias("controller.controllers.marketplace.in_escrow"),

	isProcessable: Ember.computed.and("isEscrowValid", "creditCreators.isValid"),
	isUnprocessable: Ember.computed.not("isProcessable"),

	displayCsvRows: Ember.computed.and("creditCreators.length", "isEscrowValid", "creditCreators.isLoaded"),

	isEscrowValid: function() {
		var total = this.get("payoutTotal");
		var escrow = this.get("escrowTotal");
		return total <= escrow;
	}.property("payoutTotal", "escrowTotal"),

	updateReaderBody: function(text) {
		var self = this;
		var modal = this.get("parseProgressBarModal");

		self.get("controller").refresh(text);
		var collection = this.get("creditCreators");
		if (!collection.get("isEmpty")) {
			modal.set("collection", collection);
			modal.show();
		}
	},

	updateProgress: function(modalName, num, den) {
		var modal = this.get(modalName);
		var text = "%@/%@ rows".fmt(num, den);
		var fraction = den > 0 ? num / den : 0;
		modal.update(fraction, text);
	},

	actions: {
		reset: function() {
			this.updateReaderBody(undefined);
		},

		confirmRemoveCreditCreator: function(creator) {
			var self = this;
			var modal = this.get("confirmRemoveModal");
			modal.on("cancel", function() {
				modal.send("close");
				modal.reset();
			});
			modal.on("confirm", function() {
				self.get("controller").send("removeCreditCreator", creator);
				modal.send("close");
				modal.reset();
			});
			modal.send("open");
		},

		submit: function() {
			var self = this;
			self.updateProgressFraction();
			self.trigger("saveStarted");
			self.get("controller").save(function() {
				self.trigger("saveCompleted");
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
