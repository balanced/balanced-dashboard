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

	cssStyle: function() {
		var percentage = this.get("progressPercentage");
		return "width: %@%".fmt(percentage);
	}.property("progressPercentage"),

	progressPercentage: function() {
		return parseInt(this.get("progressFraction") * 100, 10);
	}.property("progressFraction"),

	update: function(fractionValue, text) {
		this.set("progressFraction", fractionValue);
		if (text === undefined) {
			text = this.get("progressPercentage") + "%";
		}
		this.set("progressText", text);
	}

});
