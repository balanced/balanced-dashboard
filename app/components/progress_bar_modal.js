require('app/components/modal');

Balanced.ProgressBarModalComponent = Balanced.ModalComponent.extend({

	cssStyle: function() {
		var percentage = this.get("progressPercentage");
		return "width: " + percentage + "%";
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
