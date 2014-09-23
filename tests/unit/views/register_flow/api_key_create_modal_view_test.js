module("ApiKeyCreateModalView");

test("#model", function(assert) {
	var model = Balanced.ApiKeyCreateModalView.create().get("model");

	assert.ok(model.get("merchant") !== undefined);
	assert.ok(model.get("business") !== undefined);
	assert.ok(model.get("person") !== undefined);
});
