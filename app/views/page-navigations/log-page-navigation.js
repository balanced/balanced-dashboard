import PageNavigationView from "./page-navigation";

var LogPageNavigationView = PageNavigationView.extend({
	pageType: Ember.computed.reads('model.type_name'),

	title: function() {
		return "%@ %@".fmt(this.get("model.message.request.method"), this.get("model.condensed_request_url"));
	}.property("model.message.request.method", "model.condensed_request_url"),
});

export default LogPageNavigationView;
