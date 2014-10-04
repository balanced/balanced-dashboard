LOADER_NAMES = [
	"base"
	"credit-reversals"
	"customers"
	"dispute-transactions"
	"disputes"
	"funding-instruments"
	"invoice-transactions"
	"invoices"
	"logs"
	"search-logs"
	"marketplace-search"
	"orders"
	"transactions"
]

ResultLoadersInitializer =
	name: "resultLoaders"
	initialize: (container) ->
		for name in LOADER_NAMES
			klass = require("balanced-dashboard/models/results-loaders/#{name}").default
			container.register("results-loader:#{name}", klass)

`export default ResultLoadersInitializer;`
