import ModelRoute from "./model";
import Refund from "../models/refund" ;

var RefundsRoute = ModelRoute.extend({
	title: 'Refund',
	modelObject: Refund,
	marketplaceUri: 'refunds_uri'
});

export default RefundsRoute;
