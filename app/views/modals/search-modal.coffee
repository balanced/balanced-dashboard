`import ModalBaseView from "./modal-base";`
`import Search from "./mixins/search-modal-mixin";`
`import Computed from "balanced-dashboard/utils/computed";`
`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`

isTabSelected = (value) ->
	Ember.computed.equal("selectedTabType", value)

SearchModalView = ModalBaseView.extend(Search,
	templateName: 'modals/search-modal'
	elementId: 'search-modal'

	selectedTabType: "transaction"

	isOrdersTabSelected: isTabSelected("order")
	isTransactionsTabSelected: isTabSelected("transaction")
	isCustomersTabSelected: isTabSelected("customer")
	isFundingInstrumentsTabSelected: isTabSelected("funding_instrument")
	isLogsTabSelected: isTabSelected("log")

	totalResults: Computed.sumAll("resultsLoader.results.total_results", "totalLogs")
	totalOrders: Ember.computed.oneWay("resultsLoader.results.total_orders")
	totalTransactions: Ember.computed.oneWay("resultsLoader.results.total_transactions")
	totalCustomers: Ember.computed.oneWay("resultsLoader.results.counts.customer")
	totalFundingInstruments: Ember.computed.oneWay("resultsLoader.results.total_funding_instruments")
	totalLogs: Ember.computed.oneWay("logsResultsLoader.results.length")

	isLoaded: Ember.computed.oneWay("resultsLoader.results.isLoaded")
	isQueryPresent: Ember.computed.notEmpty("resultsLoader.query")
	hasResults: Ember.computed.reads("totalResults")
	query: Ember.computed.alias("searchController.query")

	searchController: Ember.computed(->
		return this.container.lookup("controller:marketplace/search")
	)

	marketplace: Ember.computed.reads("model")

	resultsLoader: Ember.computed(->
		marketplace = @get("marketplace")
		if marketplace
			marketplace.getSearchLoader(
				searchType: @get("selectedTabType")
				endTime: @get("endTime")
				startTime: @get("startTime")
				query: @get("query")
			)
	).property("marketplace", "query", "selectedTabType", "startTime", "endTime")

	logsResultsLoader: Ember.computed(->
		marketplace = @get("marketplace")
		if marketplace
			marketplace.getSearchLogsLoader(
				query: @get("query")
			)
	).property("marketplace", "query")

	queryDidChange: (->
		AnalyticsLogger.trackEvent("Searched for #{@get('query')}")
	).observes("query")

	didInsertElement: ->
		@$().hide().fadeIn(300)
		$("#q").focus()
		Ember.$('body').on 'keyup', (e) =>
			if e.keyCode == 27 # ESC key
				AnalyticsLogger.trackEvent("Closed search modal")
				@close()

	actions:
		changeSearchTab: (tabName) ->
			@set("selectedTabType", tabName)

		changeTypeFilter: (type) ->
			if type == "transaction"
				type = null
			@set("resultsLoader.type", type)

		changePaymentMethodFilter: (type) ->
			@set('resultsLoader.type', type)

		changeSortOrder: (column) ->
			@get("resultsLoader").setSortField(column)

		changeDateFilter: (startTime, endTime) ->
			@setProperties(
				endTime: endTime
				startTime: startTime
			)

		changeStatusFilter: (status) ->
			@set("resultsLoader.statusFilters", status)
)

SearchModalView.reopenClass(
	open: (model) ->
		@create(model: model)
)

`export default SearchModalView;`
