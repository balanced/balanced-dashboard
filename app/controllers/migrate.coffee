`import Ember from "ember";`
`import Utils from "balanced-dashboard/lib/utils";`
`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`

Controller = Ember.Controller.extend(
	needs: ["notification_center"]

	userMarketplaces: Ember.computed.reads("auth.user.user_marketplaces")
	marketplaces: Ember.computed.filterBy("userMarketplaces", "production")

	isStartingMigration: false

	getConnection: (apiKey) ->
		require("balanced-dashboard/lib/connections/api-connection").default.create(
			apiKey: apiKey
		)

	createMigration: (marketplace, emailAddress) ->
		deferred = Ember.RSVP.defer()
		AnalyticsLogger.trackEvent("Stripe migration started",
			data_marketplace_id: marketplace.get("id")
			data_email_address: emailAddress
		)

		Ember.$
			.ajax("https://api.balancedpayments.com/stripe/",
				method: "POST"
				data:
					email: emailAddress
				headers:
					Authorization: Utils.encodeAuthorization(marketplace.get("secret"))
			)
			.done ->
				deferred.resolve()
			.fail (xhr, error, message) ->
				AnalyticsLogger.trackEvent("Stripe migration error",
					data_marketplace_id: marketplace.get("id"),
					data_email_address: emailAddress,
					xhr_text: xhr.responseText
				)

				deferred.reject(xhr.responseJSON.errors)
		deferred.promise

	actions:
		startMigration: (marketplace, emailAddress, isAccepted) ->
			@set "errors", []
			@get("controllers.notification_center").clearAlerts()
			if marketplace && emailAddress && isAccepted
				@set("isStartingMigration", true)
				@createMigration(marketplace, emailAddress)
					.then =>
						marketplace.reload()
					.then =>
						@transitionTo("migrateSuccess", marketplace)
					.catch (errors) =>
						for error in errors
							error.isStripeUnderwritingError = (error.category_code == "stripe-underwriting-error")
						@set("errors", errors)
					.finally =>
						@set("isStartingMigration", false)
			else
				@get("controllers.notification_center").alertError("Please fill all of the fields")
)

`export default Controller;`
