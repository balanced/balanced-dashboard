import Ember from "ember";

var FormSectionView = Ember.View.extend({
	classNameBindings: [":form-section", ":clearfix"],
	layoutName: "form-fields/form-section"
});

export default FormSectionView;
