Balanced.Route = Ember.Route.extend({});

Balanced.Router = Ember.Router.extend({
	/*
	 * This function update page title when a transition is made
	 */
	_update_title: function(infos) {
		var last_info = infos[infos.length - 1];
		var title = last_info.handler.title;
		var route = last_info.handler;
		var page_title = route.get('pageTitle');

		// backup document title
		if (typeof this._doc_title === 'undefined') {
			this._doc_title = document.title;
		}

		var self = this;
		var set_title = function(title) {
			if (typeof title !== 'undefined') {
				document.title = self._doc_title + ' | ' + title;
			} else {
				document.title = self._doc_title;
			}
		};

		// try to call it if it is a function
		if (typeof page_title === 'function') {
			/*
			 * The title may be updated by the page_title function later,
			 * for example, ajax data loading page can update the title after the
			 * data is loaded. So, you can return such as 'Customer: loading ...',
			 * and call set_title('Customer: John') later when the data is loaded
			 */
			page_title = page_title(route, set_title);
		}

		set_title(page_title);
	},

	didTransition: function(infos) {
		this._update_title(infos);
		Balanced.Analytics.trackPage(_.pluck(infos, 'name').join('/'));
		return this._super.apply(this, arguments);
	}
});

Balanced.Router.map(function() {
	// signup related
	this.route('login');
	this.route('logout');

	this.route('sign_up', {
		path: "/claim"
	});
	this.route('start');

	this.route('forgotPassword', {
		path: '/forgot_password'
	});
	this.route('resetPassword', {
		path: '/password/:token'
	});
	this.route('resetPassword', {
		path: '/invite/:token'
	});
	this.route('accountSecurity', {
		path: '/security'
	});

	this.resource('marketplaces', {
		path: '/marketplaces'
	}, function() {

		this.route('apply');

		this.resource('marketplace', {
			path: '/:marketplace_id'
		}, function() {
			this.route('settings');
			this.route('add_customer');
			this.route('initial_deposit');
			this.route('import_payouts');

			// exists to handle old URIs
			this.resource('accounts', {
				path: '/accounts/:item_id'
			});
			this.route("redirect_activity_transactions", {
				path: '/activity/transactions'
			});
			this.route("redirect_activity_orders", {
				path: '/activity/orders'
			});
			this.route("redirect_activity_customers", {
				path: 'activity/customers'
			});
			this.route("redirect_activity_funding_instruments", {
				path: 'activity/funding_instruments'
			});
			this.route("redirect_activity_disputes", {
				path: 'activity/disputes'
			});
			this.route("redirect_invoices", {
				path: 'invoices'
			});

			this.route("orders");
			this.resource('orders', {
				path: '/orders/:item_id'
			});

			this.route("customers");
			this.resource('customer', {
				path: '/customers/:item_id'
			});

			this.route("disputes");
			this.resource('dispute', {
				path: '/disputes/:item_id'
			});

			this.route('funding_instruments', {
				path: '/payment_methods'
			});
			this.resource('bank_accounts', {
				path: '/bank_accounts/:item_id'
			});
			this.resource('cards', {
				path: '/cards/:item_id'
			});

			this.route("transactions");
			this.resource('credits', {
				path: '/credits/:item_id'
			});
			this.resource('reversals', {
				path: '/reversals/:item_id'
			});
			this.resource('debits', {
				path: '/debits/:item_id'
			});
			this.resource('holds', {
				path: '/holds/:item_id'
			});
			this.resource('refunds', {
				path: '/refunds/:item_id'
			});

			this.resource('events', {
				path: '/events/:item_id'
			});

			this.route("logs");
			this.resource("log", {
				path: "/logs/:item_id"
			});

			this.route('invoices', {
				path: '/account_statements'
			});
			this.resource('invoice', {
				path: '/account_statements/:item_id'
			});
		});

	});
	this.route('invalid', {
		path: '*:'
	});
});
