Balanced.DeleteCallbackModalView = Balanced.DeleteModalView.extend({
	name: 'Delete webhook',
	description: 'Are you sure you want to delete this endpoint? No future webhooks will be sent to this URL.',
	controllerEventName: 'openDeleteCallbackModal',
	idElement: 'delete-callback'
});
