import ListSectionView from "./list-section";

var OrderSellerSectionView = ListSectionView.extend({
	title: "Seller",

	linkedResources: function() {
		return this.resourceLinks("model.seller");
	}.property("model.seller")
});

export default OrderSellerSectionView;
