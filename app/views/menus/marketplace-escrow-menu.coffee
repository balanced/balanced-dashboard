`import BaseMenuView from "./base-menu";`
`import Utils from "balanced-dashboard/lib/utils";`

MarketplaceEscrowMenuView = BaseMenuView.extend(
	templateName: "menus/marketplace-escrow-menu"
	elementId: "marketplace-escrow-menu"

	escrowAmount: Ember.computed.reads("marketplace.formattedEscrowAmount")
	iconName: "icon-escrow",
	menuTitle: (->
		"Total balance (without orders): #{@get("escrowAmount")}"
	).property("escrowAmount")
)

`export default MarketplaceEscrowMenuView;`
