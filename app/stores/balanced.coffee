`import Store from "balanced-addon-models/stores/balanced";`

BalancedStore = Store.extend(
	modelMaps:
		bank_account: "model:bk/bank-account"
		customer: "model:bk/customer"
		api_key_production: "model:bk/api-key-production"
		marketplace: "model:bk/marketplace"
)

`export default BalancedStore;`
