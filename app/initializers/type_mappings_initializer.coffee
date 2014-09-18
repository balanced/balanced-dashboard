`import TypeMappings from "balanced-dashboard/models/core/type_mappings"`
`import UserMarketplace from "balanced-dashboard/models/user_marketplace"`

TypeMappingsInitializer =
	name: "typeMappings"
	initialize: (container, app) ->
		mappings =
			api_key: Balanced.APIKey
			bank_account: Balanced.BankAccount
			bank_account_verification: Balanced.Verification
			callback: Balanced.Callback
			card: Balanced.Card
			card_hold: Balanced.Hold
			credit: Balanced.Credit
			customer: Balanced.Customer
			debit: Balanced.Debit
			dispute: Balanced.Dispute
			dispute_documents: Balanced.DisputeDocument
			event: Balanced.Event
			event_callback: Balanced.EventCallback
			hold: Balanced.Hold
			invoice: Balanced.Invoice
			log: Balanced.Log
			log_search: Balanced.Log
			login: Balanced.Login
			marketplace: Balanced.Marketplace
			order: Balanced.Order
			refund: Balanced.Refund
			reversal: Balanced.Reversal
			settlement: Balanced.Settlement
			user_marketplace: UserMarketplace

		for key, value of mappings
			Balanced.TypeMappings.addTypeMapping(key, value)

`export default TypeMappingsInitializer`
