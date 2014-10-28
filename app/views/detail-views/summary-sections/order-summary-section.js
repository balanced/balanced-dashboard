import SummarySectionView from "./summary-section";

var OrderSummarySectionView = SummarySectionView.extend({
	editModelModalClass: function() {
		return this.get("container").lookupFactory("view:modals/edit-description-modal");
	}.property("model"),

	linkedResources: function() {
		return this.resourceLinks("model.description");
	}.property("model.description")
});

export default OrderSummarySectionView;
