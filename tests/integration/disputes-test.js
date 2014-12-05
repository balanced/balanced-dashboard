import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";
import fixturesAdapter from "../helpers/fixtures-adapter";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App;

module('Integration - Disputes', {
	setup: function() {
		App = startApp({
			ADAPTER: fixturesAdapter
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var disputesController = BalancedApp.__container__.lookup('controller:marketplace/disputes');
	sinon.stub(disputesController, "send");

	visit(DISPUTES_ROUTE)
		.then(function() {
			Ember.run(function() {
				disputesController.get("model").setProperties({
					startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
					endTime: moment('2013-08-01T23:59:59.999Z').toDate()
				});
			});
		})
		.check(".page-navigation h1", "Disputes")
		.then(function() {
			var resultsLoader = disputesController.get("model");
			equal(resultsLoader.get("path"), '/disputes', 'Disputes URI is correct');
			deepEqual(resultsLoader.get("queryStringArguments"), {
				"created_at[<]": "2013-08-01T23:59:59.999Z",
				"created_at[>]": "2013-08-01T00:00:00.000Z",
				"limit": 50,
				"sort": "initiated_at,desc"
			}, "Query string arguments match");
		})
		.then(function() {
			// Doing this so the results loader triggers an update
			return  Ember.RSVP.defer().promise;
		})
		.checkElements({
			"table.disputes tbody tr": 2,
			'table.disputes tbody tr:eq(0) td.date.initiated': 1,
			'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
			'table.disputes tbody tr:eq(0) td.status': 'needs_attention',
			'table.disputes tbody tr:eq(0) td.account': 1,
			'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
			'table.disputes tbody tr:eq(0) td.amount': '$12.00',
			'#marketplace-nav .alert-count': '2'
		});
});

test('can upload a dispute document', function() {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var DISPUTE_ROUTE = DISPUTES_ROUTE + '/DT2xOc7zAdgufK4XsCIW5QgD';
	var setModel = function(key, property) {
		var disputeController = BalancedApp.__container__.lookup("controller:dispute");
		Ember.run(function() {
			disputeController.get('model').set(key, property);
		});
	};

	visit(DISPUTE_ROUTE)
		.then(function() {
			setModel('canUploadDocuments', true);
		})
		.checkElements({
			'#content .page-type': 'Dispute',
			'#content .dispute-alert a': 1
		})
		.click('#content .dispute-alert a')
		.checkElements({
			'#evidence-portal .modal-header h2': 'Provide dispute evidence',
			'#evidence-portal .fileinput-button': 1
		})
		.then(function() {
			setModel('documents', [Models.DisputeDocument.create({
				"created_at": "2014-06-26T00:27:30.544797+00:00",
				"file_name": "test.jpg",
				"file_url": "http://www.balancedpayments.com",
				"guid": "DO9dJjGmyqbzDK5kXdp3fniy",
				"mime_type": "image/jpeg",
				"size": 129386,
				"updated_at": "2014-06-26T00:27:30.544821+00:00"
			})]);
			setModel('canUploadDocuments', false);
		})
		.checkElements({
			'#content div.documents table tbody tr': 1,
			'#content .dispute-alert a': 0
		});
});
