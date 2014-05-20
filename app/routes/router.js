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

function makeNestedResource(that, plural, singular) {
	// Instead of a nested resource, use 2 routes
	// since elements don't share the same route/controller/view
	// See http://discuss.emberjs.com/t/nested-resource-rendering-into-main-outlet-and-linkto-issue/1791
	that.route(plural, {
		path: '/' + plural
	});

	that.resource(singular, {
		path: '/' + plural + '/:item_id'
	});
}

Balanced.Router.map(function() {

	this.resource('marketplaces', {
		path: '/marketplaces'
	}, function() {

		this.route('apply', {
			path: '/apply'
		});

		this.resource('marketplace', {
			path: '/:marketplace_id'
		}, function() {
			this.route('settings', {
				path: '/settings'
			});
			this.route('add_customer', {
				path: '/add_customer'
			});
			this.route('initial_deposit', {
				path: '/initial_deposit'
			});
			this.route('import_payouts', {
				path: '/import_payouts'
			});

			// exists to handle old URIs
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

			this.resource('activity', {
				path: '/'
			}, function() {
				this.route('orders');
				this.route('transactions');
			});

			this.resource('customers', {
				path: '/customers/:item_id'
			});
			// exists to handle old URIs for accounts, redirects to the customers page
			this.resource('accounts', {
				path: '/accounts/:item_id'
			});

			this.resource('bank_accounts', {
				path: '/bank_accounts/:item_id'
			});
			this.resource('cards', {
				path: '/cards/:item_id'
			});

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

			this.resource('orders', {
				path: '/orders/:item_id'
			});

			this.route('funding_instruments', {
				path: '/payment_methods'
			});

			makeNestedResource(this, 'customers', 'customer');

			makeNestedResource(this, 'disputes', 'dispute');

			makeNestedResource(this, 'logs', 'log');

			makeNestedResource(this, 'invoices', 'invoice');
		});

	});

	// signup related
	this.route('login', {
		path: '/login'
	});
	this.route('logout', {
		path: '/logout'
	});

	this.route('forgotPassword', {
		path: '/forgot_password'
	});
	this.route('resetPassword', {
		path: '/password/:token'
	});
	this.route('resetPassword', {
		path: '/invite/:token'
	});
	this.route('start', {
		path: '/start'
	});
	this.route('claim', {
		path: '/claim'
	});
	this.route('accountSecurity', {
		path: '/security'
	});

	this.route('invalid', {
		path: '*:'
	});
});
