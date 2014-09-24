import Ember from "ember";

export default Ember.Handlebars.makeBoundHelper(function(obj) {
	return new Ember.Handlebars.SafeString(JSON.stringify(obj, null, 4));
});
