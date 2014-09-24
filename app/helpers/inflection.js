export default Ember.Handlebars.makeBoundHelper(function(property, options) {
	var str;

	if (options) {
		var length = property;
		var singularForm = options.hash["singular"];

		if ((parseInt(length, 10) > 1) || (parseInt(length, 10) === 0)) {
			str = length + " " + singularForm + "s";
		} else {
			str = length + " " + singularForm;
		}
	}

	return new Ember.Handlebars.SafeString(str);
});
