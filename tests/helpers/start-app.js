import Ember from 'ember';
import Application from 'balanced-dashboard/app';
import Router from 'balanced-dashboard/router';

export default function (attrs) {
	var App;

	var attributes = Ember.merge({
		rootElement: '#ember-testing',
		LOG_ACTIVE_GENERATION: false,
		LOG_VIEW_LOOKUPS: false,
	}, attrs);

	Router.reopen({
		location: 'none'
	});

	Ember.run(function() {
		App = Application.create(attributes);
		window.BalancedApp = App;
		App.setupForTesting();
		App.injectTestHelpers();
	});
	return App;
}
