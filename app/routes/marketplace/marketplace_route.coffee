MarketplaceRoute = Balanced.AuthRoute.extend
	model: (params) ->
		return @get("auth.user.marketplacesLoader").find(params.marketplace_id)

	afterModel: (model) ->
		Balanced.Utils.setCurrentMarketplace(model)

	setupController: (controller, model) ->
		@_super(controller, model)

		Balanced.Utils.setCurrentMarketplace(model)
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
