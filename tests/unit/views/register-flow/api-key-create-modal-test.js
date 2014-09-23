import { test, moduleFor } from 'ember-qunit';
moduleFor("view:register-flow/api-key-create-modal", "View - ApiKeyCreateModal");

test("#model", function(assert) {
	var model = this.subject().get("model");

	assert.ok(model.get("merchant") !== undefined);
	assert.ok(model.get("business") !== undefined);
	assert.ok(model.get("person") !== undefined);
});
