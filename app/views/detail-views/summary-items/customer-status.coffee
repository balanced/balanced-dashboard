`import Base from "./base-status";`

CustomerStatus = Base.extend(
	isUnverified: Ember.computed.equal("status", "unverified")

	description: Ember.computed "isUnverified", ->
		if @get("isUnverified")
			'You may credit this customer, but we recommend collecting more information from this customer for underwriting purposes.'

	learnMoreText: Ember.computed "isUnverified", ->
		if @get("isUnverified")
			"For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
)

`export default CustomerStatus;`
