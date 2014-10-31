import completedFilter from "./completed-filter";
import CsvProgressBarModalView from "./csv-progress-bar-modal";

var ParseCreditsCsvProgressBarModalView = CsvProgressBarModalView.extend({
	title: "Checking File",
	isCancelable: true,

	isCompleted: function() {
		return this.get("collection").isEvery("isLoaded");
	}.property("collection.@each.isLoaded"),

	completed: completedFilter("isLoaded"),

	loadedObserver: function() {
		if (this.get("isCompleted")) {
			this.close();
		}
	}.observes("collection.@each.isLoaded"),

	actions: {
		cancel: function() {
			this.get("parentView.controller").refresh(undefined);
			this.close();
		}
	}
});

export default ParseCreditsCsvProgressBarModalView;
