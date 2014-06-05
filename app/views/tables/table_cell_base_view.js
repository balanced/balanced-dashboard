Balanced.TableCellBaseView = Ember.View.extend({
	tagName: "td",
});

Balanced.LinkedDateCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_date_cell",
});

Balanced.LinkedTextCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_text_cell",
	classNames: ["label4a"],
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

Balanced.LinkedTwoLinesCellView = Balanced.LinkedTextCellView.extend({
	isBlank: Ember.computed.empty('primaryLabelText'),
	labelText: function() {
		var label = '<span class="primary">%@</span><span class="secondary">%@</span>';
		var secondaryLabel = this.get('secondaryLabelText') || '';
		return Balanced.Utils.safeFormat(label, this.get('primaryLabelText'), secondaryLabel).htmlSafe();
	}.property('primaryLabelText', 'secondaryLabelText')
});

Balanced.TitledLinkedCellView = Balanced.LinkedTextCellView.extend({
	title: Ember.computed.oneWay("labelText"),
});
a = "<h1>cc</h1>".htmlSafe()
Ember.Handlebars.Utils.escapeExpression("<h1></h1>")
