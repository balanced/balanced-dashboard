`import Store from "balanced-addon-models/stores/balanced";`

BalancedStore = Store.extend(
	modelMaps:
		bank_account: "model:bk/bank-account"
#customer: "model:customer"
#marketplace: "model:marketplace"
#log: "model:log"
#dispute: "model:dispute"
#refund: "model:refund"
#reversal: "model:reversal"
#credit: "model:credit"
#debit: "model:debit"
#hold: "model:card-hold"
#card_hold: "model:card-hold"
)

`export default BalancedStore;`
