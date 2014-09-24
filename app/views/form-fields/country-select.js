import Ember from "ember";
import { CountryCodes } from "balanced-dashboard/lib/country-codes";

var CountrySelectView = Ember.Select.extend({
	content: CountryCodes,
	classNames: ["country-select"],
	optionValuePath: "content.code",
	optionLabelPath: "content.name",
	prompt: " "
});

export default CountrySelectView;
