Balanced.SummarySectionView = Balanced.View.extend({
	templateName: "detail_views/summary_section",
	status: Ember.computed.oneWay("model.status"),

	resourceLinks: function() {
		var self = this;
		var args = _.toArray(arguments);

		var result = args.map(function(resourceName) {
			var resource = self.get(resourceName);
			if (!resource) {
				return undefined;
			}

			if (_.isArray(resource.content)) {
				resource = resource.content;
			}

			if (resource.length > 0) {
				var resources = [];
				_.each(resource, function(content) {
					resources.push(self.generateResourceLink(self.model, content));
				});
				return resources;
			} else {
				return self.generateResourceLink(self.model, resource);
			}
		});

		return _.flatten(result).compact();
	},

	generateResourceLink: function(parentModel, model) {
		var title;
		if (Ember.isBlank(model) || parentModel.uri === model.uri) {
			return;
		}

		if (model.constructor === Balanced.Order) {
			return {
				className: 'icon-single-transaction',
				title: 'Order',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount_escrowed'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Hold) {
			return {
				className: 'icon-single-transaction',
				title: 'Hold',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Debit) {
			return {
				className: 'icon-single-transaction',
				title: 'Debit',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Credit) {
			return {
				className: 'icon-single-transaction',
				title: 'Credit',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Refund) {
			title = (parentModel.constructor === Balanced.Refund) ? 'Other refund' : 'Refund';

			return {
				className: 'icon-single-transaction',
				title: title,
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Reversal) {
			title = (parentModel.constructor === Balanced.Reversal) ? 'Other reversal' : 'Reversal';

			return {
				className: 'icon-single-transaction',
				title: title,
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Dispute) {
			return {
				className: 'icon-single-transaction',
				title: 'Dispute',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Customer) {
			title = 'Customer';

			if (parentModel.constructor === Balanced.Order) {
				title = (model.get('id') === parentModel.get('seller.id')) ? 'Seller' : 'Buyer';
			}

			return {
				className: 'icon-customers',
				title: title,
				resource: model,
				value: model.get('display_me'),
				hoverValue: model.get('display_me_with_email')
			};
		}

		if (model.constructor === Balanced.Card) {
			return {
				className: 'icon-card',
				title: model.get('type_name'),
				resource: model,
				value: '%@ %@'.fmt(model.get('last_four'), model.get('brand')),
				hoverValue: '%@ %@ (%@)'.fmt(model.get('last_four'), model.get('brand'), model.get('type_name')),
			};
		}

		if (model.constructor === Balanced.BankAccount) {
			return {
				className: 'icon-bank-account',
				title: model.get('type_name').split(' ')[0],
				resource: model,
				value: '%@ %@'.fmt(model.get('last_four'), model.get('formatted_bank_name')),
				hoverValue: '%@ %@ (%@)'.fmt(model.get('last_four'), model.get('formatted_bank_name'), model.get('type_name'))
			};
		}
	}
});

Balanced.OrderSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.seller");
	}.property("model.seller", "model.buyers")
});

Balanced.DebitSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.order", "model.refunds", "model.hold", "model.customer", "model.source");
	}.property("model.order", "model.refunds", "model.refunds.length", "model.hold", "model.customer", "model.source")
});

Balanced.CreditSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	linkedResources: function() {
		return this.resourceLinks("model.order", "model.reversals", "model.customer", "model.destination");
	}.property("model.order", "model.reversals", "model.reversals.length", "model.customer", "model.destination")
});

Balanced.RefundSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.customer", "model.debit.source");
	}.property("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.refunds.length", "model.debit.customer", "model.debit.source")
});

Balanced.ReversalSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.credit.order", "model.credit", "model.credit.reversals", "model.credit.customer", "model.credit.destination");
	}.property("model.credit.order", "model.credit", "model.credit.reversals", "model.credit.reversals.length", "model.credit.customer", "model.credit.destination")
});

Balanced.HoldSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.customer", "model.source");
	}.property("model.debit.order", "model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.refunds.length", "model.customer", "model.source")
});

Balanced.DisputeSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		var status = this.get('model.state');

		if (status === 'new') {
			return 'Provide documentation to fight this dispute';
		}
		if (status === 'submitted') {
			return 'This dispute is under review. Once the card holder issues a decision, the status will update to won or lost.';
		}
		return null;
	}.property('model.state'),

	linkedResources: function() {
		return this.resourceLinks("model.transaction.order", "model.transaction.customer", "model.transaction.source");
	}.property("model.transaction.order", "model.transaction.customer", "model.transaction.source")
});

Balanced.CustomerSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		if (this.get('model.status') === 'unverified') {
			return 'You may credit this customer, but we recommend collecting more information from this customer for underwriting purposes.';
		}
		return null;
	}.property('model.status'),

	learnMore: function() {
		return {
			className: 'learn-more-unverified',
			text: "For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
		};
	}.property(),

	linkedResources: function() {
		return this.resourceLinks("model.orders_list");
	}.property("model.orders_list", "model.orders_list.length")
});

Balanced.CardSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property("model.customer")
});

Balanced.BankAccountSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		var status = this.get('status');

		if (status === 'pending') {
			return 'Two deposits have been made to your bank account. Confirm verification by entering the amounts.';
		} else if (status === 'unverified') {
			return 'You may only credit to this bank account. You must verify this bank account to debit from it.';
		} else if (status === 'unverifiable') {
			return 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.';
		}
		return undefined;
	}.property('status'),

	statusButtonModalView: function() {
		var status = this.get('status');
		if (status === 'unverified') {
			return Balanced.Modals.VerifyBankAccountModalView;
		} else if (status === 'pending') {
			return Balanced.Modals.BankAccountVerificationConfirmModalView;
		}
		return undefined;
	}.property('status'),

	statusButtonText: function() {
		var status = this.get('status');
		if (status === 'unverified' || status === 'pending') {
			return "Verify";
		}
		return undefined;
	}.property("status"),

	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer'),
});

Balanced.InvoiceSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		var createdAt = Balanced.Utils.humanReadableDateLong(this.get('model.settle_at'));
		return 'on %@'.fmt(createdAt);
	}.property('model.settle_at')
});
