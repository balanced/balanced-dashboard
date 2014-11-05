import Ember from "ember";
import LinkedTextCellView from "../linked-text-cell";

var UnlinkedStatusCellView = LinkedTextCellView.extend({
	templateName: "tables/cells/unlinked-status-cell",
	iconName: "icon-unlinked",
	tooltipTitle: "This transaction is unlinked",
	tooltipContent: function () {
		var closeButton = '<a class="close"><i class="icon-x"></i></a>';
		var linkTemplate = '<a class="linked-list" href="%@" target="_blank"><i class="%@ non-interactive"></i>%@</a>';

		var bodyText = "<p>Balanced requires that all debits must be attributed to the correct merchant and corresponding credit. To meet this requirement, you'll need to link transactions using the Order resource from the 1.1 version of the Balanced API. Click on the links below to learn more.<p>";
		bodyText += linkTemplate.fmt("https://docs.balancedpayments.com/1.1/guides/orders/", "icon-payments", "How an Order works");
		bodyText += linkTemplate.fmt("https://docs.balancedpayments.com/1.1/guides/migrating-api-1-1/", "icon-code", "How to implement Orders in API v1.1");
		bodyText += closeButton;

		return bodyText;
	}.property(),
});

export default UnlinkedStatusCellView;
