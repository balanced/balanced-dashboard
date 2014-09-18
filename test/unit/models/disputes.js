module('Balanced.Dispute');

test('state', function(assert) {
	var dispute = Balanced.Dispute.create();
	var document = Balanced.DisputeDocument.create();
	dispute.set('documents', [document]);

	[{
		actual: 'won',
		expected: 'won'
	}, {
		actual: 'pending',
		expected: 'submitted'
	}, {
		actual: 'lost',
		expected: 'lost'
	}].each(function(state) {
		dispute.set('status', state.actual);
		assert.equal(dispute.get('state'), state.expected);
	});

	dispute.set('documents', []);
	dispute.set('status', 'pending');
	assert.equal(dispute.get('state'), 'pending');
});
