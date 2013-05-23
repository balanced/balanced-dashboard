Balanced.BaseFormView = Balanced.View.extend({
	formProperties: [],

	updateObjectFromFormFields: function(modelObj) {
		_.each(this.formProperties, function(property) {
			modelObj.set(property, this.get(property + '.value'));
		}, this);
	},

	highlightErrorsFromAPIResponse: function(description) {
		_.each(this.formProperties, function(property) {
			this.set(property + '_error', description.indexOf(property) != -1);
		}, this);
	},

	reset: function(modelObj) {
		_.each(this.formProperties, function(property) {
			this._resetProperty(property, modelObj);
		}, this);
	},

	_resetProperty: function(property, modelObj) {
		this.set(property + '.value', modelObj.get(property));
		this.set(property + '_error', false);
	}
});
