require('app/components/modal');

Balanced.ProgressBarModalComponent = Ember.Component.extend({

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

	update: function(fractionValue, text) {
		this.set("progressFraction", fractionValue);
		this.getProgressBar().width((fractionValue * 100) + "%");
		this.set("progressText", text);
	}

});
