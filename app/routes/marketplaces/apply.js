Balanced.MarketplacesApplyRoute = Balanced.Route.extend({
	title: 'Apply for production access',
	pageTitle: 'Apply for production access',
	model: function() {
		var request = Balanced.ProductionAccessRequest.create({

		});
		return {
			request: request,
			title: this.title
		};
	},
	setupController: function(controller, model) {
		this._super(controller, model.request);
		this.controllerFor('marketplace').set('content', null);
	},
	actions: {
		signup: function(models) {
			var self = this;

			function persistMarketplace(user) {
				Balanced.Utils.setCurrentMarketplace(null);
				Balanced.Auth.unsetAPIKey();

				models.apiKey.save().then(function(apiKey) {
					var apiKeySecret = apiKey.get('secret');
					//  set the api key for this request
					Balanced.Auth.setAPIKey(apiKeySecret);
					var settings = {
						headers: {
							Authorization: Balanced.Utils.encodeAuthorization(apiKeySecret)
						}
					};

					models.marketplace.save(settings).then(function(marketplace) {
						//  associate to login
						var userMarketplaceAssociation = Balanced.UserMarketplace.create({
							uri: user.api_keys_uri,
							secret: apiKeySecret
						});
						userMarketplaceAssociation.save().then(function() {
							Balanced.Auth.setAPIKey(apiKey.get('secret'));
							user.reload();
							//  we need the api key to be associated with the user before we can create the bank account

							//  create bank account
							models.bankAccount.tokenizeAndCreate(marketplace.get('owner_customer.id')).then(function(bankAccount) {
								// we don't know the bank account's
								// verification uri until it's created so we
								// are forced to create it here.
								var verification = Balanced.Verification.create({
									uri: bankAccount.get('bank_account_verifications_uri')
								});
								verification.save().then(function() {
									//  annnnd we're done
									self.send('alert', {
										type: 'success',
										message: 'We\'ve received your information. In the ' + 'meantime, you may fund your balance with your ' + 'credit card to transact right away.'
									});
								});
							});

							// we don't actually care if the bank account creates successfully, so we can go on to the initial deposit
							self.transitionTo('marketplace.initial_deposit', marketplace);
						});
					});
				});
			}

			if (models.user) {
				var password = models.user.password;
				models.user.save().then(function(user) {
					Balanced.Auth.signIn(models.user.email_address, password).then(function() {
						persistMarketplace(Balanced.Auth.get('user'));
					});
				});
			} else {
				persistMarketplace(Balanced.Auth.get('user'));
			}
		}
	}
});
