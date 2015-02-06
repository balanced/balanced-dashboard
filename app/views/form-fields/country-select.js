import Ember from "ember";
import SelectFormFieldView from "./select-form-field";
import { CountryCodes } from "balanced-dashboard/lib/country-codes";

var CountrySelectView = SelectFormFieldView.extend({
	content: Ember.computed(function() {
		var result = [{
			name: "",
			code: ""
		}];
		return result.concat(CountryCodes);
	}),
	inputClassNames: ["country-select", "full"],
	optionValuePath: "content.code",
	optionLabelPath: "content.name"
});

export default CountrySelectView;
