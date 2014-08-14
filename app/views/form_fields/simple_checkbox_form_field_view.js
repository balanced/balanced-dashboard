Balanced.SimpleCheckboxFormFieldView = Balanced.View.extend({
	templateName: "form_fields/simple_checkbox_form_field",
	classNameBindings: [":form-group", "isError:has-error", ":checkbox"],

	setModelValue: function(value) {
		var model = this.get("model");
		var field = this.get("field");
		return model.set(field, value);
	},

	getModelValue: function() {
		var model = this.get("model");
		var field = this.get("field");
		return model.get(field);
	},

	value: function(a, value) {
		if (arguments.length > 1) {
			this.setModelValue(value);
		}
		return this.getModelValue();
	}.property("model", "field"),

	errorMessages: function() {
		var validationErrors = this.get("model.validationErrors");
		if (validationErrors) {
			var errors = validationErrors.get(this.get("field"));
			if (errors) {
				return errors.get("fullMessages");
			}
		}
		return [];
	}.property("model.validationErrors", "field"),

	isError: function() {
		return this.get("errorMessages.length") > 0;
	}.property("errorMessages.length")
});

Balanced.TocCheckboxFormFieldView = Balanced.SimpleCheckboxFormFieldView.extend({
	labelText: function() {
		var firstLink = '<a href="https://www.balancedpayments.com/terms/">Terms & Conditions</a>';
		var secondLink = '<a href="https://www.balancedpayments.com/terms/marketplaceagreement">Marketplace Agreement</a>';
		var thirdLink = '<a href="https://www.balancedpayments.com/privacy">Privacy Policy</a>';
		return new Ember.Handlebars.SafeString("I accept the %@, %@ and %@".fmt(firstLink, secondLink, thirdLink));
	}.property(),

	field: "isTermsAccepted",
	explanationText: "We respect your privacy. Your information is stored securely and used only for transaction processing, customer support, and fraud prevention."
});
