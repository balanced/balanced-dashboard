Balanced.SummarySectionView = Balanced.View.extend({
	templateName: "detail_views/summary_section",

	resourceLinks: function() {
		var self = this;
		var args = _.toArray(arguments);

		var result = args.map(function(resourceName) {
			var resource = self.get(resourceName);
			if (resource && _.isArray(resource.content)) {
				var resources = [];
				_.each(resource.content, function(content) {
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
		if (Ember.isBlank(model)) {
			return;
		}

		if (model.constructor === Balanced.Customer) {
			return {
				className: 'icon-customers',
				title: 'Customer',
				resource: model,
				value: model.get('display_me'),
				hoverValue: model.get('display_me_with_email')
			};
		}

		if (model.constructor === Balanced.Dispute) {
			return {
				className: 'icon-payments',
				title: 'Dispute',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Debit) {
			return {
				className: 'icon-payments',
				title: 'Debit',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Credit) {
			return {
				className: 'icon-payments',
				title: 'Credit',
				resource: model,
				value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
				hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
			};
		}

		if (model.constructor === Balanced.Refund) {
			if (parentModel.constructor === Balanced.Refund) {
				if (parentModel.uri !== model.uri) {
					return {
						className: 'icon-payments',
						title: 'Other refund',
						resource: model,
						value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
						hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
					};
				}
				return undefined;
			} else {
				return {
					className: 'icon-payments',
					title: 'Refund',
					resource: model,
					value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
					hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
				};
			}
		}

		if (model.constructor === Balanced.Reversal) {
			if (parentModel.constructor === Balanced.Reversal) {
				if (parentModel.uri !== model.uri) {
					return {
						className: 'icon-payments',
						title: 'Other reversal',
						resource: model,
						value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
						hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
					};
				}
				return undefined;
			} else {
				return {
					className: 'icon-payments',
					title: 'Reversal',
					resource: model,
					value: '$%@'.fmt(Balanced.Utils.centsToDollars(model.get('amount'))),
					hoverValue: 'Created at %@'.fmt(Balanced.Utils.humanReadableDateShort(model.created_at))
				};
			}
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
				title: model.get('type_name'),
				resource: model,
				value: '%@ %@'.fmt(model.get('last_four'), model.get('formatted_bank_name')),
				hoverValue: '%@ %@ (%@)'.fmt(model.get('last_four'), model.get('formatted_bank_name'), model.get('type_name'))
			};
		}
	}
});

Balanced.DebitSummarySectionView = Balanced.SummarySectionView.extend({
	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model.dispute", "model.refunds", "model.hold", "model.customer", "model.source");
	}.property("model.dispute", "model.refunds.@each", "model.hold", "model.customer", "model.source")
});

Balanced.CreditSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: Ember.computed.alias('model.status_description'),

	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model.reversals", "model.customer", "model.destination");
	}.property("model.reversals.@each", "model.customer", "model.destination")
});

Balanced.RefundSummarySectionView = Balanced.SummarySectionView.extend({
	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model.debit.dispute", "model.debit", "model.debit.refunds", "model.debit.customer", "model.debit.source");
	}.property("model.debit.dispute", "model.debit", "model.debit.refunds.@each", "model.debit.customer", "model.debit.source")
});

Balanced.ReversalSummarySectionView = Balanced.SummarySectionView.extend({
	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model.credit", "model.credit.reversals", "model.credit.customer", "model.credit.destination");
	}.property("model.credit", "model.credit.reversals.@each", "model.credit.customer", "model.credit.destination")
});

Balanced.HoldSummarySectionView = Balanced.SummarySectionView.extend({
	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model.debit.dispute", "model.debit", "model.debit.refunds", "model.customer", "model.source");
	}.property("model.debit.dispute", "model.debit", "model.debit.refunds", "model.customer", "model.source")
});

Balanced.DisputeSummarySectionView = Balanced.SummarySectionView.extend({
	// Note: missing order links
	linkedResources: function() {
		return this.resourceLinks("model", "model.refunds", "model.hold", "model.customer", "model.source");
	}.property("model", "model.refunds", "model.hold", "model.customer", "model.source")
});

Balanced.CustomerSummarySectionView = Balanced.SummarySectionView.extend({
	statusText: function() {
		if (this.get('model.status') === 'unverified') {
			return 'You may credit this customer, but we recommend collecting more information of this customer for underwriting purposes.';
		}
		return null;
	}.property('model.status'),

	learnMore: function() {
		return {
			className: 'learn-more-unverified',
			text: "For an individual, you may collect full legal name, email, permanent street address, and last four digits of SSN. For a business, we also recommend collecting the full business name and EIN number."
		};
	}.property()

});

Balanced.CardSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property("model.customer")
});

Balanced.BankAccountSummarySectionView = Balanced.SummarySectionView.extend({
	linkedResources: function() {
		return this.resourceLinks("model.customer");
	}.property('model.customer')
});
