require("app/views/modals/progress_bar_modal");

var Computed = {
	completedFilter: function(propertyName) {
		return function() {
			return (this.get("collection") || []).filterBy(propertyName);
		}.property("collection.@each." + propertyName);
	}
};

var CsvProgressBarModalView = Balanced.ProgressBarModalView.extend({
	refresh: function(collection) {
		this.set("collection", collection);
		this.updateProgressBar();
		if (!collection.get("isEmpty")) {
			this.show();
		}
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

Balanced.ParseCreditsCsvProgressBarModalView = CsvProgressBarModalView.extend({
	title: "Checking File",
	isCancelable: true,

	isCompleted: function () {
		return this.get("collection").isEvery("isLoaded");
	}.property("collection.@each.isLoaded"),

	completed: Computed.completedFilter("isLoaded"),

	loadedObserver: function() {
		if (this.get("isCompleted")) {
			this.hide();
		}
	}.observes("collection.@each.isLoaded"),

	actions: {
		cancel: function() {
			this.get("parentView.controller").refresh(undefined);
			this.hide();
		}
	}
});

Balanced.SaveCreditsCsvProgressBarModalView = CsvProgressBarModalView.extend({
	title: "Processing",
	isCancelable: false,
	completed: Computed.completedFilter("isSaved")
});
