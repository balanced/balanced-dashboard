import ModelRoute from "./model";
import Event from "../models/event";

var EventsRoute = ModelRoute.extend({
	title: 'Event',
	modelObject: Event,
	marketplaceUri: 'events_uri'
});

export default EventsRoute;
