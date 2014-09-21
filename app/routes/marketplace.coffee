`import Utils from "balanced-dashboard/lib/utils";`
`import AuthRoute from "./auth";`

MarketplaceRoute = AuthRoute.extend
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

	actions:
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
