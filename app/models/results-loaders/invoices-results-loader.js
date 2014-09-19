import ResultsLoader from "./results-loader";
import Invoice from "balanced-dashboard/models/invoice";

var InvoicesResultsLoader = ResultsLoader.extend({
	resultsType: Invoice,
});

export default InvoicesResultsLoader;
