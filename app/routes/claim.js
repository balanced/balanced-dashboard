Balanced.ClaimRoute = Balanced.Route.extend({
	//
	// parseResponse: function(unparsedJson) {
	// 	unparsedJson = unparsedJson || '{}';
	// 	var json = JSON.parse(unparsedJson);
	// 	for (var key in json) {
	// 		if (!json.hasOwnProperty(key)) {
	// 			continue;
	// 		}
	// 		this.get('validationErrors').add(key, 'invalid', null, json[key]);
	// 	}
	// 	this.propertyDidChange('validationErrors');
	// },

	model: function() {
		console.log('yoo model');
		var claim = Balanced.Claim.create();

		return {
			claim: claim
		};
	},

	setupController: function(controller, model) {
		console.log('yoo setupController');
		this._super(controller, model.claim);
	},

	redirect: function() {
		console.log('yoo redirect');
		if (!this.get('auth.isGuest')) {
			console.log('yoo redirect2');
			this.transitionTo('index');
		}
	},

	actions: {
		cancel: function() {
			this.transitionTo('index');
		}
	}
});
