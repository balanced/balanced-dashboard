import completedFilter from "./completed-filter";
import CsvProgressBarModalView from "./csv-progress-bar-modal";

var SaveCreditsCsvProgressBarModalView = CsvProgressBarModalView.extend({
	title: "Processing",
	isCancelable: false,
	completed: completedFilter("isSaved")
});

export default SaveCreditsCsvProgressBarModalView;
