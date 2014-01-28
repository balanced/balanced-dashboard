Balanced.ResultsTable = Ember.Mixin.create({
	needs: ['marketplace'],

	type: 'transaction',

	minDate: null,
	maxDate: null,
	dateFilterTitle: 'Any time',

	// override this if you want to allow the results table to be able to sort by none
	allowSortByNone: false,

	sortField: null,
	sortOrder: null,

	// we use this so we can display counts without having them reset every time you filter
	last_loaded_search_result: null,

	// must be overridden for data picker to work
	baseClassSelector: null,

	// override this and return a hash to add query params
	extra_filtering_params: null,

	// override this if you conditionally don't want to get results
	fetch_results: true,

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
			this.set('type', type);
		},

		loadMore: function(results) {
			results.loadNextPage();
		},

		reload: function() {
			this.notifyPropertyChange('search_params');
		},
	},

	results: function() {
		if (!this.get('fetch_results')) {
			return null;
		}

		var searchArray = Balanced.SearchModelArray.newArrayLoadedFromUri(
			this.get('results_uri'),
			this.get('results_type')
		);

		if (['funding_instrument', 'transaction', 'search', 'dispute'].indexOf(this.get('type') || '') >= 0) {
			searchArray.set('sortProperties', [this.get('sortField') || 'created_at']);
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
		switch (this.get('type')) {
			case 'transaction':
				return 'Balanced.Transaction';
			case 'search':
				return 'Balanced.Transaction';
			case 'debit':
				return 'Balanced.Debit';
			case 'credit':
				return 'Balanced.Credit';
			case 'card_hold':
				return 'Balanced.Hold';
			case 'hold':
				return 'Balanced.Hold';
			case 'refund':
				return 'Balanced.Refund';
			case 'account':
				return 'Balanced.Account';
			case 'customer':
				return 'Balanced.Customer';
			case 'funding_instrument':
				return 'Balanced.FundingInstrument';
			case 'bank_account':
				return 'Balanced.BankAccount';
			case 'card':
				return 'Balanced.Card';
			case 'log':
				return 'Balanced.Log';
			case 'order':
				return 'Balanced.Order';
			case 'dispute':
				return 'Balanced.Dispute';
			default:
				return null;
		}
	}.property('type'),

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

		if (_.contains(Balanced.SEARCH.FUNDING_INSTRUMENT_TYPES, type)) {
			return 'funding_instrument';
		}

		if (_.contains(Balanced.SEARCH.DISPUTE_TYPES, type)) {
			return 'dispute';
		}

		return '';
	}.property('type')
});
