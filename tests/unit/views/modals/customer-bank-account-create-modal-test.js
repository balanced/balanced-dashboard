import { test, moduleFor } from 'ember-qunit';

moduleFor("view:modals/customer-bank-account-create-modal", "View - CustomerBankAccountCreateModalView");

test("#model", function() {
	var BankAccount = require("balanced-dashboard/models/bank-account")['default'];
	var subject = this.subject();
	ok(subject.get("model") instanceof BankAccount);
});

asyncTest("#save", function() {
	var model = Ember.Object.create({
		tokenizeAndCreate: sinon.stub().returns(Ember.RSVP.resolve(model)),
		route_name: "cool_route"
	});

	var view = this.subject({
		model: model,
		customer: {
			id: "xxxxxxxxxxxxxxx"
		}
	});
	view.save()
		.then(function() {
			ok(model.tokenizeAndCreate.calledOnce);
			deepEqual(model.tokenizeAndCreate.firstCall.args, ["xxxxxxxxxxxxxxx"]);
		})
		.then(start);
});
