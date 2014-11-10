`import BaseMenuView from "./base-menu";`
`import Utils from "balanced-dashboard/lib/utils";`

OrderSortMenuView = BaseMenuView.extend(
	templateName: "menus/order-sort-menu"
	elementId: "order-sort-menu"
	descMenuText: "Date created: newest"
	ascMenuText: "Date created: oldest"

	menuTitle: (->
		if @get("controller.resultsLoader.sortDirection") == "desc"
			return @get("descMenuText")
		else
			return @get("ascMenuText")
	).property("controller.resultsLoader.sortDirection", "ascMenuText", "descMenuText")
)

`export default OrderSortMenuView;`
