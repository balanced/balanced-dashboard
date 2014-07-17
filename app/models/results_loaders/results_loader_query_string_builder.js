Balanced.ResultsLoaderQueryStringBuilder = function() {
	this.queryStringAttributes = {};
};

var isSerializableDate = function(value) {
	return _.isDate(value) || moment.isMoment(value);
};

Balanced.ResultsLoaderQueryStringBuilder.prototype = {
	addValues: function(object) {
		var self = this;
		_.each(object, function(value, key) {
			self.addValue(key, value);
		});
		return self;
	},

	addValue: function(key, value) {
		if (Ember.isArray(value)) {
			if (value.length === 1) {
				this.queryStringAttributes[key] = value[0];
			} else if (value.length > 1) {
				this.queryStringAttributes[key + "[in]"] = value.join(",");
			}
		} else if (isSerializableDate(value)) {
			this.queryStringAttributes[key] = value.toISOString();
		} else if (!Ember.isBlank(value)) {
			this.queryStringAttributes[key] = value;
		}
	},

	getQueryStringAttributes: function() {
		return this.queryStringAttributes;
	},
};
