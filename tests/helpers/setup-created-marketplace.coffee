setupCreatedMarketplace = (marketplace) ->
	id = marketplace.get("id")
	customerId = marketplace.get('owner_customer_uri').split('/').pop()
	routes = {
		marketplace: marketplace
	}

	routes.MARKETPLACE_ID = id
	routes.CUSTOMER_ID = customerId

	routes.MARKETPLACES_ROUTE = '/marketplaces'
	routes.MARKETPLACE_ROUTE = "/marketplaces/#{id}"
	routes.ACTIVITY_ROUTE = "/marketplaces/#{id}/activity/transactions"
	routes.ADD_CUSTOMER_ROUTE = "/marketplaces/#{id}/add_customer"
	routes.CUSTOMER_ROUTE = "/marketplaces/#{id}/customers/#{customerId}"
	routes.LOGS_ROUTE = "/marketplaces/#{id}/logs"
	routes.SETTINGS_ROUTE = "/marketplaces/#{id}/settings"
	routes.INITIAL_DEPOSIT_ROUTE = "/marketplaces/#{id}/initial_deposit"
	routes

`export default setupCreatedMarketplace;`
