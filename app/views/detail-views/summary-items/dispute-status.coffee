`import Base from "./base-status";`

DisputeStatus = Base.extend(
	description: Ember.computed "model.status", ->
		switch @get('model.status')
			when "needs_attention"
				'Provide documentation to fight this dispute'
			when "under_review"
				'This dispute is under review. Once the card reviewer issues a decision, the status will update to won or lost.'
)

`export default DisputeStatus;`
