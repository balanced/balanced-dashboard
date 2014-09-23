import Rev0Serializer from "../serializers/rev0";
import Model from "./core/model";

var Download = Model.extend({
	// have to override the URI for create, since the uri property of the JSON is the search URI
	_createUri: function() {
		return '/downloads';
	},

	uri: ""
});

Download.reopenClass({
	serializer: Rev0Serializer.extend({
		_propertiesMap: function(record) {
			var result = {};
			var properties = [
				"uri",
				"email_address",
				"beginning",
				"ending",
				"type"
			];
			properties.forEach(function(name) {
				var value = record.get(name);
				if (!Ember.isBlank(value)) {
					result[name] = value;
				}
			});

			return result;
		}
	}).create()
});

export default Download;
