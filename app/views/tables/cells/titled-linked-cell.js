import LinkedTextCellView from "./linked-text-cell";

var TitledLinkedCellView = LinkedTextCellView.extend({
	title: Ember.computed.oneWay("labelText"),
});

export default TitledLinkedCellView;
