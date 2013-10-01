Balanced.EventsController = Balanced.ObjectController.extend({
	eventData: function() {
		var model = this.get('model')['entity'],
			data = {
				"amount": model['amount'],
				"bank_account_uri": model['bank_account_uri'],
				"created_at": model['created_at'],
				"description": model['description'],
				"id": model['id'],
				"meta": model['meta'],
				"status": model['status'],
				"uri": model['uri']
			};
		return data;
	}.property('model')
});
