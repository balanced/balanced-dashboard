Models =
	lookupFactory: (name) ->
		BalancedApp.__container__.lookupFactory("model:#{name}")

r = (name) ->
	klass = require("balanced-dashboard/models/#{name}").default
	klassName = name.camelize().replace(/^./, (l) -> l.toUpperCase())
	Models[klassName] = klass

files = "
	api-key
	bank-account
	callback
	card
	claim
	credit
	customer
	debit
	dispute-document
	dispute
	download
	event-callback
	event
	forgot-password
	funding-instrument
	hold
	invoice
	justitia-dispute
	log
	login
	marketplace
	order
	refund
	reset-password
	reversal
	settlement
	transaction
	user
	user-invite
	user-marketplace
	verification
".split(/\s+/)

for file in files
	r file

`export default Models`
