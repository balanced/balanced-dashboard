import CheckboxFormFieldView from "./checkbox-form-field";
import Ember from "ember";

var TocCheckboxFormFieldView = CheckboxFormFieldView.extend({
	labelText: function() {
		var firstLink = '<a href="https://www.balancedpayments.com/terms/">Terms & Conditions</a>';
		var secondLink = '<a href="https://www.balancedpayments.com/terms/marketplaceagreement">Marketplace Agreement</a>';
		var thirdLink = '<a href="https://www.balancedpayments.com/privacy">Privacy Policy</a>';
		return new Ember.Handlebars.SafeString("I accept the %@, %@ and %@".fmt(firstLink, secondLink, thirdLink));
	}.property(),

	field: "isTermsAccepted",
	explanationText: "We respect your privacy. Your information is stored securely and used only for transaction processing, customer support, and fraud prevention."
});

export default TocCheckboxFormFieldView;
