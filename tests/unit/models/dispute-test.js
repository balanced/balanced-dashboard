import Dispute from "balanced-dashboard/models/dispute";
import DisputeDocument from "balanced-dashboard/models/dispute-document";
import JustitiaDispute from "balanced-dashboard/models/justitia-dispute";

module('Model - Dispute');

test('status', function() {
	var dispute = Dispute.create();
	var document = DisputeDocument.create();
	var justitiaDispute = JustitiaDispute.create({
		created_at: "2013-08-01T00:00:00.000Z"
	});
	dispute.set('justitia_dispute', justitiaDispute);
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
	}].forEach(function(status, index) {
		dispute.set('serverStatus', status.actual);
		equal(dispute.get('status'), status.expected);
	});

	dispute.set('documents', []);
	dispute.set('justitia_dispute.created_at', null);
	dispute.set('serverStatus', 'pending');
	equal(dispute.get('status'), 'needs_attention');
	dispute.set('respond_by', moment().subtract(3, 'days').toDate());
	equal(dispute.get('status'), 'expired');
});
