import Ember from "ember";
import JustitiaDispute from "./justitia-dispute";
import Computed from "../utils/computed";

var Dispute = Balanced.Model.extend(Ember.Validations, {
	transaction: Balanced.Model.belongsTo('transaction', 'transaction'),
	events: Balanced.Model.hasMany('events', 'event'),
	documents: Balanced.Model.hasMany('dispute_documents', 'dispute-document'),

	note: null,
	tracking_number: null,
	validations: {
		note: {
			presence: true,
		}
	},
	justitia_dispute: function() {
		return JustitiaDispute.find(this.get('dispute_uri'));
	}.property('dispute_uri'),

	isEvidenceProvided: function() {
		return !!this.get('justitia_dispute.created_at');
	}.property('justitia_dispute.created_at'),

	type_name: 'Dispute',
	route_name: 'dispute',

	uri: '/disputes',
	events_uri: Computed.concat('uri', '/events'),

	dispute_uri: function() {
		return '/disputes/' + this.get('id');
	}.property('id'),

	dispute_documents_uri: function() {
		return '/disputes/' + this.get('id') + '/documents';
	}.property('id'),

	amount_dollars: function() {
		if (this.get('amount')) {
			return (this.get('amount') / 100).toFixed(2);
		} else {
			return '';
		}
	}.property('amount'),

	customer_display_me: Ember.computed.alias('transaction.customer.display_me'),
	customer_email: Ember.computed.alias('transaction.customer.email'),

	last_four: Ember.computed.alias('transaction.last_four'),
	bank_name: Ember.computed.alias('transaction.bank_name'),
	funding_instrument_description: Ember.computed.oneWay('transaction.funding_instrument_description').readOnly(),
	funding_instrument_name: Ember.computed.alias('transaction.funding_instrument_name'),
	funding_instrument_type: Ember.computed.alias('transaction.funding_instrument_type'),
	page_title: Computed.orProperties('transaction.description', 'transaction.id'),

	getTransactionsLoader: function(attributes) {
		var DisputeTransactionsResultsLoader = require("balanced-dashboard/models/results-loaders/dispute-transactions")["default"];
		attributes = _.extend({
			dispute: this
		}, attributes);
		return DisputeTransactionsResultsLoader.create(attributes);
	},

	hasExpired: function() {
		return moment(this.get('respond_by')).toDate() < moment().toDate();
	}.property('respond_by'),

	canUploadDocuments: function() {
		return !this.get('isEvidenceProvided') && !this.get('hasExpired') && (this.get('status') === 'pending');
	}.property('isEvidenceProvided', 'hasExpired', 'status')
});

export default Dispute;
