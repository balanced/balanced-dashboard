import ModelRoute from "./model";
import Reversal from "../models/reversal";

var ReversalsRoute = ModelRoute.extend({
	title: 'Reversal',
	modelObject: Reversal,
	marketplaceUri: 'reversals_uri'
});

export default ReversalsRoute;
