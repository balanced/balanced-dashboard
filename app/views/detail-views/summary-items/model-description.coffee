`import Base from "./base";`

ModelDescription = Base.extend(
	isLoading: Ember.computed.reads("model.isLoading")
	isBlank: Ember.computed.empty("model.description")
	text: Ember.computed.reads("model.description")
)

`export default ModelDescription;`
