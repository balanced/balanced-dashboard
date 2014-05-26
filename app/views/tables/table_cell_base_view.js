Balanced.TableCellBaseView = Ember.View.extend({
	tagName: "td"
});

Balanced.LinkedDateCellView = Balanced.TableCellBaseView.extend({
	templateName: "tables/cells/linked_date_cell"
});
