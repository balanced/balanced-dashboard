import BaseResultsLoader from "./base";

var CustomersResultsLoader = BaseResultsLoader.extend({
	resultsType: Balanced.Customer,
});

export default CustomersResultsLoader;
