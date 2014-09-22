import ModelRoute from "./model";
import Hold from "../models/hold";

var HoldsRoute = ModelRoute.extend({
	title: 'Hold',
	modelObject: Hold,
	marketplaceUri: 'card_holds_uri'
});

export default HoldsRoute;
