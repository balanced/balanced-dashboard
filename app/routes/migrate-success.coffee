`import Ember from "ember";`
`import TitleRoute from "./title";`

SUCCESS_MESSAGE =
	"Migration request received: The migration process will take 2-3 business days. You'll receive an email confirmation upon completion."

Route = TitleRoute.extend(
	pageTitle: "Migrate"

	model: (params) ->
		@container
			.lookupFactory("model:marketplace")
			.findById(params.marketplace_id)

	setupController: (controller, model) ->
		controller.set("model", model)
		@controllerFor("notification_center").alertSuccess(SUCCESS_MESSAGE)
)

`export default Route;`
