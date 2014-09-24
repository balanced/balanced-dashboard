import Ember from "ember";

var MarketplacesController = Ember.ArrayController.extend({
	needs: ["marketplace", "application"]
});


export default MarketplacesController;
