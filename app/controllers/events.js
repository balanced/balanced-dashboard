Balanced.EventsController = Balanced.ObjectController.extend({
	eventData: function(){
		var entity = this.get('model')['entity'],
			data = {
				"amount":               entity['amount'],
				"bank_account_uri":     entity['bank_account_uri'],
				"created_at":           entity['created_at'],
				"description":          entity['description'],
				"id":                   entity['id'],
				"meta":                 entity['meta'],
				"status":               entity['status'],
				"uri":                  entity['uri']
			};
		return data;
	}.property('model')
});
