`import Ember from 'ember'`
`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger"`

Router = Ember.Router.extend
	_update_title: (infos) ->
		last_info = infos[infos.length - 1]
		title = last_info.handler.title
		route = last_info.handler
		page_title = route.get('pageTitle')

		if Ember.isBlank(@_doc_title)
			this._doc_title = document.title

		set_title = (title) =>
			if Ember.isBlank(title)
				document.title = @_doc_title + ' | ' + title
			else
				document.title = @_doc_title

		if _.isFunction(page_title)
			page_title = page_title(route, set_title)

		AnalyticsLogger.trackEvent("Visited #{page_title} page")
		set_title(page_title)

	didTransition: (infos) ->
		this._update_title(infos)
		AnalyticsLogger.trackPage(_.pluck(infos, 'name').join('/'))
		return this._super.apply(this, arguments)

Router.map ->
	this.route('login')
	this.route('logout')

	this.route('setup_guest_user', path: "/start")
	this.route('otp', path: '/otp')
	this.route('forgotPassword', path: '/forgot_password')
	this.route('resetPassword', path: '/password/:token')
	this.route('resetPassword', path: '/invite/:token')

	this.route("migrate", path: "/migrate")
	this.route("migrateConnect", path: "/connect/:marketplace_id")
	this.route("migrateSuccess", path: "/migrate/:marketplace_id")

	this.route("marketplace-application", path: "/marketplaces/applications/:id")
	this.resource 'marketplaces', path: '/marketplaces', ->
		this.route('apply')

		this.resource 'marketplace', path: '/:marketplace_id', ->
			this.route('settings')
			this.route('add_customer')
			this.route('import_payouts')

			# exists to handle old URIs
			this.resource('accounts', path: '/accounts/:item_id')
			this.route("redirect_activity_transactions", path: '/activity/transactions')
			this.route("redirect_activity_orders", path: '/activity/orders')
			this.route("redirect_activity_customers", path: 'activity/customers')
			this.route("redirect_activity_funding_instruments", path: 'activity/funding_instruments')
			this.route("redirect_activity_disputes", path: 'activity/disputes')
			this.route("redirect_invoices", path: 'invoices')

			this.route("orders")
			this.resource('orders', path: '/orders/:item_id')

			this.route("customers")
			this.resource('customer', path: '/customers/:item_id')

			this.route("disputes")
			this.resource('dispute', path: '/disputes/:item_id')

			this.route('funding_instruments', path: '/payment_methods')
			this.resource('bank_accounts', path: '/bank_accounts/:item_id')
			this.resource('cards', path: '/cards/:item_id')

			this.route("transactions")
			this.resource('credits', path: '/credits/:item_id')
			this.resource('reversals', path: '/reversals/:item_id')
			this.resource('debits', path: '/debits/:item_id')
			this.resource('holds', path: '/holds/:item_id')
			this.resource('refunds', path: '/refunds/:item_id')
			this.resource('events', path: '/events/:item_id')

			this.route("logs")
			this.resource("log", path: "/logs/:item_id")

			this.route('invoices', path: '/account_statements')
			this.resource('invoice', path: '/account_statements/:item_id')


	this.route('invalid', path: '*:')

`export default Router`
