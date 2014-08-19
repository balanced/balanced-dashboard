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

var Save = Balanced.Modals.ObjectActionMixin;

Balanced.Modals.ExportCsvModalView = Balanced.ModalBaseView.extend(Save, {
	templateName: "modals/export_csv_modal",
	title: "Export data",
	elementId: "download-csv",

	getNotificationController: function() {
		return this.get("container").lookup("controller:notification_center");
	},

	model: function() {
		return ExportTransactionCreator.create({
			loader: this.get("loader")
		});
	}.property("loader"),

	actions: {
		save: function() {
			var alertsController = this.getNotificationController();
			var message = "We're processing your request. We will email you once the exported data is ready to view.";
			this.save(this.get("model"))
				.then(function() {
					alertsController.alertSuccess(message, {
						expire: true
					});
				});
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
