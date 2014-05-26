Balanced.TableCellBaseView = Ember.View.extend({
	tagName: "td",
});

Balanced.LinkedDateCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_date_cell",
});

Balanced.LinkedTextCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_text_cell",
	classNames: ["label4a"]
});

Balanced.LinkedTwoLinesCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_two_lines_cell"
});

Balanced.TitledLinkedCellView = Balanced.LinkedTextCellView.extend({
	title: Ember.computed.oneWay("labelText"),
	attributeBindings: ['title'],
});
