import Ember from "ember";

var TextFieldView =  Ember.TextField.extend({
	attributeBindings: ['autocomplete', 'placeholder', 'autofocus']
});

export default TextFieldView;
