Balanced.Event = Balanced.Model.extend({
	transaction:        Balanced.Model.belongsTo('entity','Balanced.Transaction'),
	eventCallbacks:     Balanced.Model.hasMany('callbacks','Balanced.EventCallback')
});

Balanced.TypeMappings.addTypeMapping('event', 'Balanced.Event');