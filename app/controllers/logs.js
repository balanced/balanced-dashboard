Balanced.LogsIndexController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'created_at',
	sortOrder: 'desc',
	results_type: 'Balanced.Log',
	type: null,
	limit: 20,

	baseClassSelector: '#logs',

	currentEndpointFilter: null,
	statusRollupFilterSucceeded: true,
	statusRollupFilterFailed: true,

	actions: {
		setEndPointFilter: function (endpoint) {
			this.changeEndpointFilter(endpoint);

			if (endpoint) {
				this.set('currentEndpointFilter', Balanced.Utils.toTitleCase(endpoint));
			} else {
				this.set('currentEndpointFilter', null);
			}
		}
	},

	setStatusRollupFilter: function () {
		var SUCCEEDED = ['2xx'],
			FAILED = ['3xx', '4xx', '5xx'];

		var succeeded = this.get('statusRollupFilterSucceeded'),
			failed = this.get('statusRollupFilterFailed'),
			filters = [];

		if (succeeded) {
			filters = filters.concat(SUCCEEDED);
		}

		if (failed) {
			filters = filters.concat(FAILED);
		}

		if (!succeeded && !failed) {
			filters = null;
		}

		this.changeStatusRollupFilter(filters);
	}.observes('statusRollupFilterSucceeded', 'statusRollupFilterFailed'),

	changeEndpointFilter: function (endpoint) {
		var filteringParams = Ember.copy(this.get('extra_filtering_params'));

		if (endpoint) {
			filteringParams.endpoint = endpoint;
		} else {
			delete filteringParams.endpoint;
		}

		this.set('extra_filtering_params', filteringParams);
	},

	changeStatusRollupFilter: function (statuses) {
		var filteringParams = Ember.copy(this.get('extra_filtering_params'));

		if (statuses) {
			var status_rollup = {
				'status_rollup[in]': statuses
			};

			$.extend(filteringParams, status_rollup);
		} else {
			delete filteringParams['status_rollup[in]'];
		}

		this.set('extra_filtering_params', filteringParams);
	},

	results_base_uri: function () {
		return '/v1/logs';
	}.property(),

	extra_filtering_params: function () {
		return {
			'method[in]': 'post,put,delete'
		};
	}.property()
});

Balanced.LogsLogController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});
