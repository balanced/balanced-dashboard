import Ember from "ember";
import { test, moduleFor } from 'ember-qunit';

moduleFor("view:modals/customer-bank-account-create-modal", "View - CustomerBankAccountCreateModalView");

test("#save", function() {
	var transitionToRouteStub = sinon.stub();
	var model = Ember.Object.create({
		route_name: "cool_route",
	});
	model.tokenizeAndCreate = sinon.stub().returns(Ember.RSVP.resolve(model));

	var controller = Ember.Object.extend({
		transitionToRoute: transitionToRouteStub
	});

	var view = this.subject();
	view.setProperties({
		model: model,
		customer: {
			id: "xxxxxxxxxxxxxxx"
		}
	});

	view.container.register("controller:marketplace", controller)

	view.save(model)
		.then(function() {
			deepEqual(transitionToRouteStub.args, [["cool_route", model]]);
			deepEqual(model.tokenizeAndCreate.args, [["xxxxxxxxxxxxxxx"]]);
		});
});
