`import Base from "./base";`

Customer = Base.extend(
	isLoading: Ember.computed.reads("model.isLoading")
	isLink: true

	text: Ember.computed.reads("model.display_me")
	hoverValue: Ember.computed.reads("model.display_me_with_email")
)

`export default Customer;`
