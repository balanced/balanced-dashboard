var JSON_PROPERTY_KEY = '__json';

var Rev0Serializer = Ember.Object.extend({
	//  properties which are not echoed back to the server
	privateProperties: ['id', 'uri', 'validationErrors', JSON_PROPERTY_KEY, 'links', '_type'],

	serialize: function(record) {
		var json = this._propertiesMap(record);
		return json;
	},

	extractSingle: function(rootJson, type, href) {
		return rootJson;
	},

	extractCollection: function(rootJson) {
		return rootJson;
	},

	// Taken from http://stackoverflow.com/questions/9211844/reflection-on-emberjs-objects-how-to-find-a-list-of-property-keys-without-knowi
	_propertiesMap: function(record) {
		var computedProps = [];
		record.constructor.eachComputedProperty(function(prop) {
			computedProps.push(prop);
		});

		var lifecycleProperties = ['isLoaded', 'isNew', 'isSaving', 'isValid', 'isError', 'isDeleted'];

		var props = {};
		for (var prop in record) {
			if (record.hasOwnProperty(prop) &&
				$.inArray(prop, computedProps) === -1 &&
				$.inArray(prop, lifecycleProperties) === -1 &&
				$.inArray(prop, this.privateProperties) === -1 &&
				prop.indexOf('__ember') < 0 &&
				prop.indexOf('_super') < 0 &&
				Ember.typeOf(record.get(prop)) !== 'function'
			) {
				props[prop] = record[prop];
			}
		}

		return props;
	}
});

export default Rev0Serializer;
