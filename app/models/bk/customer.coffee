`import Ember from "ember";`
`import BkCustomer from "balanced-addon-models/models/customer";`

Customer = BkCustomer.extend(
	routeName: "customer"
	getApiProperties: ->
		@getProperties("address", "business_name", "dob_month", "dob_year", "ein", "email", "meta", "name", "phone", "source", "ssn_last4")
)

`export default Customer;`
