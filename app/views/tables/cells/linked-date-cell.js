import TableCellBaseView from "./table-cell-base";

var LinkedDateCellView = TableCellBaseView.extend({
	templateName: "tables/cells/linked-date-cell",
	classNames: ["two-lines"],
	eventTrackerText: Ember.computed.reads("parentView.eventTrackerText")
});

export default LinkedDateCellView;
