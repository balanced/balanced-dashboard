import BaseResultsLoader from "./base";
import Customer from "../customer";

var CustomersResultsLoader = BaseResultsLoader.extend({
	resultsType: Customer,
});

export default CustomersResultsLoader;
