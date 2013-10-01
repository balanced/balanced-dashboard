Balanced.PrettyPrintView = Balanced.View.extend({
	templateName: 'prettyPrint',
	content: null,

	didInsertElement: function() {
		prettyPrint();
	}
});
