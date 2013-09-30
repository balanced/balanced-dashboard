Balanced.EventCallback = Balanced.Model.extend({
	callback: Balanced.Model.belongsTo('callback', 'Balanced.Callback'),
});

Balanced.TypeMappings.addTypeMapping('event_callback', 'Balanced.EventCallback');
