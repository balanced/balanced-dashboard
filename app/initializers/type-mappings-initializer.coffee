`import TypeMappings from "balanced-dashboard/models/core/type-mappings"`
`import UserMarketplace from "balanced-dashboard/models/user-marketplace"`

TypeMappingsInitializer =
	name: "typeMappings"
	initialize: (container, app) ->
		registerMapping = (key, factoryName) ->
			klass = container.lookupFactory("model:#{factoryName || key}")
			TypeMappings.addTypeMapping(key, klass)

		registerMapping "api_key", "api-key"
		registerMapping "bank_account", "bank-account"
		registerMapping "bank-account", "bank-account"
		registerMapping "bank_account_verification", "verification"
		registerMapping "verification", "verification"
		registerMapping "callback"
		registerMapping "card"
		registerMapping "card_hold", "hold"
		registerMapping "credit"
		registerMapping "customer"
		registerMapping "debit"
		registerMapping "dispute"
		registerMapping "dispute_documents", "dispute-document"
		registerMapping "dispute-document"
		registerMapping "event"
		registerMapping "event_callback", "event-callback"
		registerMapping "funding-instrument"
		registerMapping "hold"
		registerMapping "log"
		registerMapping "log_search", "log"
		registerMapping "login"
		registerMapping "marketplace"
		registerMapping "order"
		registerMapping "refund"
		registerMapping "reversal"
		registerMapping "settlement"
		registerMapping "transaction"
		registerMapping "user_marketplace", "user-marketplace"

`export default TypeMappingsInitializer`
