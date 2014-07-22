var ExportTransactionCreator = Ember.Object.extend(Ember.Validations, {
	validations: {
		emailAddress: {
			presence: true,
		}
	},

	save: function() {
		this.validate();
		if (this.get("isValid")) {
			return this.get("loader").postCsvExport(this.get("emailAddress"));
		} else {
			return Ember.RSVP.reject();
		}
	},
});

Balanced.Modals.ExportCsvModalView = Balanced.ModalBaseView.extend({
	templateName: "modals/export_csv_modal",
	title: "Export data",

	model: function() {
		return ExportTransactionCreator.create({
			loader: this.get("loader")
		});
	}.property("loader"),

	actions: {
		save: function() {
			var controller = this.get("controller");
			var alertMessage = {
				message: "We're processing your request. We will email you once the exported data is ready to view.",
				persists: false,
				type: 'success'
			};
			this.get("model")
				.save()
				.then(function() {
					controller.send('alert', alertMessage);
				})
		},
	}
});

Balanced.Modals.ExportCsvModalView.reopenClass({
	open: function(resultsLoader) {
		return this.create({
			loader: resultsLoader
		});
	},
});
