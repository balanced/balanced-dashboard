import TableCellBaseView from "./table-cell-base";

var LinkedTextCellView = TableCellBaseView.extend({
	templateName: "tables/cells/linked-text-cell",
	blankText: 'none',
	attributeBindings: ['title'],
	isBlank: Ember.computed.empty('labelText'),
	displayValue: function() {
		if (this.get('isBlank')) {
			return this.get('blankText');
		} else {
			return this.get('labelText');
		}
	}.property('blankText', 'isBlank', 'labelText'),
});

export default LinkedTextCellView;
