import Dispute from "balanced-dashboard/models/dispute";
import DisputeDocument from "balanced-dashboard/models/dispute-document";

module('Model - Dispute');

test('state', function() {
	var dispute = Dispute.create();
	var document = DisputeDocument.create();
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
	}].forEach(function(state, index) {
		dispute.set('status', state.actual);
		equal(dispute.get('state'), state.expected);
	});

	dispute.set('documents', []);
	dispute.set('status', 'pending');
	equal(dispute.get('state'), 'pending');
});
