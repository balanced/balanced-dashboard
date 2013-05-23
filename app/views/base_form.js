Balanced.BaseFormView = Balanced.View.extend({
	formProperties: [],

	updateObjectFromFormFields: function(modelObj) {
		_.each(this.formProperties, function(property) {
			modelObj.set(property, this.get(this._fieldNameToValueName(property)));
		}, this);
	},

	highlightErrorsFromAPIResponse: function(description) {
		_.each(this.formProperties, function(property) {
			this.set(this._fieldNameToErrorName(property), description.indexOf(property) != -1);
		}, this);
	},

	reset: function(modelObj) {
		_.each(this.formProperties, function(property) {
			this._resetProperty(property, modelObj);
		}, this);
	},

	_resetProperty: function(property, modelObj) {
		this.set(this._fieldNameToValueName(property), modelObj.get(property));
		this.set(this._fieldNameToErrorName(property), false);
	},

	_fieldNameToValueName: function(property) {
		return property.replace(/\./g,'_') + '.value';
	},

	_fieldNameToErrorName: function(property) {
		return property.replace(/\./g,'_') + '_error';
	}
});
