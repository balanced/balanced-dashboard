var EventCallback = Balanced.Model.extend({
	callback: Balanced.Model.belongsTo('callback', 'callback'),
});

export default EventCallback;
