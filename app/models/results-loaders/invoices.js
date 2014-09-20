import BaseResultsLoader from "./base";
import Invoice from "balanced-dashboard/models/invoice";

var InvoicesResultsLoader = BaseResultsLoader.extend({
	resultsType: Invoice,
});

export default InvoicesResultsLoader;
