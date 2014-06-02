Balanced.ResultsTable = Ember.Mixin.create({
	needs: ['marketplace'],

	type: 'transaction',

	pageTitle: function() {
		return "%@s".fmt(this.get('type').capitalize());
	}.property('type'),

	// override this if you dont want transaction type filter to appear
	transactionTypeFilter: true,

	minDate: null,
	maxDate: null,
	dateFilterTitle: 'Any time',

	// override this if you want to allow the results table to be able to sort by none
	allowSortByNone: false,

	sortField: 'created_at',
	sortOrder: 'desc',

	// we use this so we can display counts without having them reset every time you filter
	last_loaded_search_result: null,

	// must be overridden for data picker to work
	baseClassSelector: null,

	// override this and return a hash to add query params
	extra_filtering_params: null,

	// override this if you conditionally don't want to get results
	fetch_results: true,

	// override this if you want to translate this
	TYPE_TRANSLATION: {
		'hold': 'card_hold'
	},

	actions: {
		changeDateFilter: function(minDate, maxDate, title) {
			this.setProperties({
				minDate: minDate,
				maxDate: maxDate,
				dateFilterTitle: title
			});
		},

		changeSortOrder: function(field, sortOrder) {
			this.setProperties({
				sortField: field,
				sortOrder: sortOrder
			});
		},

		changeTypeFilter: function(type) {
			if (this.TYPE_TRANSLATION[type]) {
				type = this.TYPE_TRANSLATION[type];
			}

			this.set('type', type);
		},

		loadMore: function(results) {
			results.loadNextPage();
		},

		reload: function() {
			this.notifyPropertyChange('search_params');
		}
	},

	results: function() {
		if (!this.get('fetch_results')) {
			return null;
		}

		var searchArray = Balanced.SearchModelArray.newArrayLoadedFromUri(
			this.get('results_uri'),
			this.get('results_type')
		);

		var type = this.get('type') || '';
		if (['funding_instrument', 'customer', 'transaction', 'search'].indexOf(type) >= 0) {
			searchArray.set('sortProperties', [this.get('sortField') || 'created_at']);
			searchArray.set('sortAscending', this.get('sortOrder') === 'asc');
		} else if (type === 'dispute') {
			searchArray.set('sortProperties', [this.get('sortField') || 'initiated_at']);
			searchArray.set('sortAscending', this.get('sortOrder') === 'asc');
		}

		return searchArray;
	}.property('fetch_results', 'results_uri', 'results_type', 'sortField', 'sortOrder'),

	updateLastLoaded: function() {
		var results = this.get('results');
		if (results && results.get('isLoaded')) {
			this.set('last_loaded_search_result', results);
		}
	}.observes('results', 'results.isLoaded'),

	// must be overridden to provide content if not using search
	results_base_uri: function() {
		var marketplaceUri = this.get('controllers.marketplace.uri');
		if (!marketplaceUri) {
			return marketplaceUri;
		}

		return marketplaceUri + '/search';
	}.property('controllers.marketplace.uri'),

	results_uri: function() {
		return Balanced.Utils.applyUriFilters(
			this.get('results_base_uri'),
			this.get('search_params')
		);
	}.property('results_base_uri', 'search_params'),

	search_params: function() {
		return _.extend({
			type: this.get('type'),
			minDate: this.get('minDate'),
			maxDate: this.get('maxDate'),
			sortField: this.get('sortField'),
			sortOrder: this.get('sortOrder'),
			limit: this.get('limit')
		}, this.get('extra_filtering_params'));
	}.property('type', 'minDate', 'maxDate', 'sortField', 'sortOrder', 'limit', 'extra_filtering_params'),

	results_type: function() {
		var typeMappings = {
			transaction: 'Balanced.Transaction',
			'search': 'Balanced.Transaction',
			debit: 'Balanced.Debit',
			credit: 'Balanced.Credit',
			failed_credit: 'Balanced.Credit',
			card_hold: 'Balanced.Hold',
			hold: 'Balanced.Hold',
			refund: 'Balanced.Refund',
			account: 'Balanced.Account',
			customer: 'Balanced.Customer',
			funding_instrument: 'Balanced.FundingInstrument',
			bank_account: 'Balanced.BankAccount',
			card: 'Balanced.Card',
			log: 'Balanced.log',
			order: 'Balanced.Order',
			dispute: 'Balanced.Dispute',
			reversal: 'Balanced.Reversal'
		};

		return typeMappings[this.get('type')] || null;
	}.property('type'),

	isLoaded: Ember.computed.not('isLoading'),

	isLoading: function() {
		return this.get('fetch_results') && this.get('results') && !this.get('results.isLoaded');
	}.property('fetch_results', 'results.isLoaded', 'results'),

	updateResultsIfErrored: function() {
		var results = this.get('results');
		if (results && results.get('isError') && this.get('fetch_results')) {
			this.set('fetch_results', false);
		}
	}.observes('results', 'results.isError'),

	// used for when filtering to one specific type. for example: if the user
	// is viewing holds, type==hold category==transaction
	category: function() {
		var type = this.get('type');
		if (_.contains(Balanced.SEARCH.CATEGORIES, type)) {
			return type;
		}

		if (_.contains(Balanced.SEARCH.SEARCH_TYPES, type)) {
			return 'search';
		}

		if (_.contains(Balanced.SEARCH.TRANSACTION_TYPES, type)) {
			return 'transaction';
		}

		if (_.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
			return 'funding_instrument';
		}

		if (_.contains(Balanced.SEARCH.DISPUTE_TYPES, type)) {
			return 'dispute';
		}

		return '';
	}.property('type')
});
