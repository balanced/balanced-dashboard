import Ember from "ember";

var SummarySectionView = Ember.View.extend({
	templateName: "detail-views/summary-section",
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

export default SummarySectionView;

