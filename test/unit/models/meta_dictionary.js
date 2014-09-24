module('Balanced.MetaDictionary');

asyncTest('save (invalid)', function(assert) {
	var metaDictionary = Balanced.MetaDictionary.create({
		transaction: Ember.Object.create(),
		fields: [{
			key: "",
			value: "sample value"
		}]
	});

	metaDictionary.save()
		.then(undefined, function() {
			assert.deepEqual(metaDictionary.get("validationErrors.fullMessages"), ["fields All keys must be present."]);
		})
		.then(start);
});

asyncTest('save (valid)', function(assert) {
	var transaction = {};
	transaction.set = sinon.stub();
	transaction.save = sinon.stub().returns(Ember.RSVP.resolve());

	var metaDictionary = Balanced.MetaDictionary.create({
		transaction: transaction,
		fields: [{
			key: "sample key",
			value: "sample value"
		}]
	});

	metaDictionary.save()
		.then(function() {
			assert.deepEqual(transaction.set.args, [
				[
					"meta", {
						"sample key": "sample value"
					}
				]
			]);
			assert.deepEqual(transaction.save.args, [
				[]
			]);

			assert.deepEqual(metaDictionary.get("validationErrors.fullMessages"), []);
		})
		.then(start);
});
