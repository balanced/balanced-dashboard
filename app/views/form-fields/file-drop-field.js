import Ember from "ember";

var FileDropFieldView = Ember.View.extend({
	templateName: 'form-fields/file-drop-field',
	dropMessage: 'Drag and drop files',

	dragEnter: function() {
		this.set('isDragging', true);
	},
	dragLeave: function() {
		this.set('isDragging', false);
	},
	dragOver: function(event) {
		event.preventDefault();
	},
	drop: function(event) {
		event.preventDefault();
		this.set('isDragging', false);
	}
});

export default FileDropFieldView;
