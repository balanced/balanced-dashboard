setupMarketplace = (App) ->
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
		.then ->
			marketplace

`export default setupMarketplace;`
