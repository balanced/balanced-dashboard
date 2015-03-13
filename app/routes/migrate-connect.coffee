`import Ember from "ember";`
`import TitleRoute from "./title";`

Route = TitleRoute.extend(
	pageTitle: "Connect Stripe account"

	model: (params) ->
		@container
			.lookupFactory("model:marketplace")
			.findById(params.marketplace_id)

	setupController: (controller, model) ->
		controller.set("model", model)
)

`export default Route;`
