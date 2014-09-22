import ModelRoute from "./model";
import Credit from "../models/credit";

var CreditsRoute = ModelRoute.extend({
	title: 'Credit',
	modelObject: Credit,
	marketplaceUri: 'credits_uri'
});

export default CreditsRoute;
