import MetaDictionary from "balanced-dashboard/models/helpers/meta-dictionary";

module('Model - MetaDictionary');

asyncTest('save (invalid)', function() {
	var metaDictionary = MetaDictionary.create({
		transaction: Ember.Object.create(),
		fields: [{
			key: "",
			value: "sample value"
		}]
	});

	metaDictionary.save()
		.then(undefined, function() {
			deepEqual(metaDictionary.get("validationErrors.fullMessages"), ["fields All keys must be present."]);
		})
		.then(start);
});

asyncTest('save (valid)', function() {
	var transaction = {};
	transaction.set = sinon.stub();
	transaction.save = sinon.stub().returns(Ember.RSVP.resolve());

	var metaDictionary = MetaDictionary.create({
		transaction: transaction,
		fields: [{
			key: "sample key",
			value: "sample value"
		}]
	});

	metaDictionary.save()
		.then(function() {
			deepEqual(transaction.set.args, [
				[
					"meta", {
						"sample key": "sample value"
					}
				]
			]);
			deepEqual(transaction.save.args, [
				[]
			]);

			deepEqual(metaDictionary.get("validationErrors.fullMessages"), []);
		})
		.then(start);
});
