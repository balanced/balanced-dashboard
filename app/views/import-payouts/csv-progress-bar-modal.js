import ProgressBarModalView from "../modals/progress-bar-modal";

var CsvProgressBarModalView = ProgressBarModalView.extend({
	refresh: function(collection) {
		this.set("collection", collection);
		this.updateProgressBar();
	},

	progressText: function() {
		var num = this.get("completed.length") || 0;
		var den = this.get("collection.length") || 0;
		return " %@/%@ rows".fmt(num, den);
	}.property("completed.length", "collection.length"),

	updateProgressBar: function() {
		var num = this.get("completed.length") || 0;
		var den = this.get("collection.length") || 0;
		this.setProgressBarFraction(num / den);
	}.observes("completed.length", "collection.length"),
});

export default CsvProgressBarModalView;
