module("Balanced.RegistrationController", {
	setup: function() {
		var container = new Ember.Container();
		this.controller = Balanced.RegistrationController.create({
			container: container
		});
	},
});

asyncTest("#createApiKeySecret", function(assert) {
	var controller = this.controller;
	var stub = sinon.stub(jQuery, "ajax");
	stub.returns(Ember.RSVP.resolve({
		"links": {},
		"api_keys": [{
			"links": {},
			"created_at": "2014-08-15T19:35:48.129067Z",
			"secret": "secret-key",
			"href": "/api_keys/:id",
			"meta": {},
			"id": ":id"
		}]
	}));

	controller
		.createApiKeySecret({
			name: "Name"
		})
		.then(function(result) {
			assert.deepEqual(result, "secret-key");
			assert.deepEqual(stub.args[0], [{
				"accepts": {
					"json": "application/vnd.balancedpayments+json; version=1.1"
				},
				"contentType": "application/json; charset=UTF-8",
				"data": "{\"name\":\"Name\"}",
				"dataType": "json",
				"headers": {},
				"type": "POST",
				"url": "https://api.balancedpayments.com/api_keys"
			}]);
			stub.restore();
			start();
		});
});
