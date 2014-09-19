import Ember from "ember";

var CountrySelectView = Ember.Select.extend({
	content: Balanced.CountryCodes,
	classNames: ["country-select"],
	optionValuePath: "content.code",
	optionLabelPath: "content.name",
	prompt: " "
});

export default CountrySelectView;
