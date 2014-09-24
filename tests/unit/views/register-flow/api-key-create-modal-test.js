import { test, moduleFor } from 'ember-qunit';
moduleFor("view:register-flow/api-key-create-modal", "View - ApiKeyCreateModal");

test("#model", function() {
	var model = this.subject().get("model");

	ok(model.get("merchant") !== undefined);
	ok(model.get("business") !== undefined);
	ok(model.get("person") !== undefined);
});
