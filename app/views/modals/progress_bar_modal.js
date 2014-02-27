Balanced.ProgressBarModalView = Ember.View.extend({

	templateName: "modals/progress_bar_modal",

	classNames: ['modal-container'],

	modalElement: function() {
		return this.$(".modal").get(0);
	}.property("element"),

	$modal: function(options) {
		var element = this.get("modalElement");
		return $(element).modal(options || {});
	},

	show: function() {
		this.$modal("show");
	},

	hide: function() {
		this.$modal("hide");
	},

	getProgressBar: function() {
		return $(this.get("modalElement")).find(".progress-bar");
	},

	setProgressBarFraction: function(fractionValue) {
		this.getProgressBar().width((fractionValue * 100) + "%");
	},

	actions: {
		cancel: function() {
			this.hide();
			this.trigger("cancel");
		},
	}
});
