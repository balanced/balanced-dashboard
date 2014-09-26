`import Testing from "./testing";`

setupMarketplace = (App) ->
	stop()
	secret = undefined
	marketplace = undefined

	container = App.__container__

	registrationController = container.lookup("controller:registration")
	auth = container.lookup("auth:main")

	registrationController.createApiKeySecret()
		.then (s) ->
			secret = s
			registrationController.createMarketplaceForApiKeySecret(secret)
		.then (mp) ->
			marketplace = mp
			auth.loginGuestUser(secret)
		.then ->
			auth.setupGuestUserMarketplace(marketplace)
			Testing.setupCreatedMarketplace(marketplace)
		.fail ->
			console.log("fail", arguments)
		.then(start)

`export default setupMarketplace;`
