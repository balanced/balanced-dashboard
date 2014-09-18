import Ember from "ember";

var FormSectionView = Ember.View.extend({
	classNameBindings: [":form-section", ":clearfix"],
	layoutName: "form_fields/form_section"
});

export default FormSectionView;
