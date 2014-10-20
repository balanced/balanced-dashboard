import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

export default function (attrs) {
	var App;

	var attributes = Ember.merge(config, {
		ADAPTER: null
	});
	attributes = Ember.merge(attributes, attrs);

	Router.reopen({
		location: 'none'
	});

	Ember.run(function() {
		App = Application.create(attributes);
		window.BalancedApp = App;
		App.setupForTesting();
		App.injectTestHelpers();
	});

	App.reset();
	return App;
}
