import Ember from "ember";
import Model from "./core/model";

var Callback = Model.extend(Ember.Validations, {
	validations: {
		url: {
			presence: true
		}
	}
});

export default Callback;
