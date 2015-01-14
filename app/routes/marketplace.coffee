`import Utils from "balanced-dashboard/lib/utils";`
`import AuthRoute from "./auth";`

MarketplaceRoute = AuthRoute.extend
	shortcuts:
		"/": "openSearch"

	model: (params) ->
		return @controllerFor("sessions")
			.get("currentUser.marketplacesLoader")
			.find(params.marketplace_id)

	afterModel: (model) ->
		Utils.setCurrentMarketplace(model)

	setupController: (controller, model) ->
		@_super(controller, model)

		Utils.setCurrentMarketplace(model)
		controller.updateGuestNotification()
		controller.updateProductionMarketplaceNotification()
		controller.updateBankAccountNotifications()
		controller.updateOpenMarketplaceBankAccountCreateModal()

	actions:
		openSearch: (event) ->
			if !$(event.target).is(":input")
				event.preventDefault()
				this.send("openModal", "modals/search-modal", @modelFor("marketplace"))
		submitRefundDebit: (refund) ->
			@transitionTo('refunds', refund)
		submitReverseCredit: (reversal) ->
			@transitionTo('reversals', reversal)
		submitCaptureHold: (debit) ->
			@transitionTo('debits', debit)
		submitCreditCustomer: (credit) ->
			@transitionTo('credits', credit)
		submitDebitCustomer: (debit) ->
			@transitionTo('debits', debit)

`export default MarketplaceRoute`
