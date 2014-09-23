import Model from "./core/model";
import ModelArray from "./core/model-array";

var JustitiaDispute = Model.extend({});

JustitiaDispute.reopenClass({
	loadFromUri: function(uri) {
		return ModelArray.newArrayLoadedFromUri(uri, JustitiaDispute, "disputes");
	}
});

export default JustitiaDispute;
