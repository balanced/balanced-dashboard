import Model from "./core/model";

var EventCallback = Model.extend({
	callback: Model.belongsTo('callback', 'callback'),
});

export default EventCallback;
