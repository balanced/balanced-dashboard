import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";
import Computed from "balanced-dashboard/utils/computed";

var SummarySectionView = Ember.View.extend({
	templateName: "detail-views/summary-section",
	status: Ember.computed.oneWay("model.status"),
	hasStatusOrLinkedResources: Computed.orProperties("status", "linkedResources"),
	resourceLinks: function() {
		var self = this;
		var args = _.toArray(arguments);

		var result = args.map(function(resourceName) {
			var resource = self.get(resourceName);

			if (resourceName === 'model.description') {
				return self.generateResource(resource, resourceName);
			}

			if (!resource) {
				return undefined;
			}

			if (_.isArray(resource.content)) {
				resource = resource.content;
			}

			if (_.isString(resource)) {
				return self.generateResource(resource, resourceName);
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

	generateResource: function(value, resourceName) {
		if (resourceName === "model.description") {
			return {
				className: 'icon-description',
				title: 'Internal description',
				value: value,
				hoverValue: value,
				editModelModalClass: this.get("container").lookupFactory("view:modals/edit-description-modal")
			};
		}
	},

	generateResourceLink: function(parentModel, model) {
		var BankAccount = this.get("container").lookupFactory("model:bank-account");
		var Card = this.get("container").lookupFactory("model:card");
		var Credit = this.get("container").lookupFactory("model:credit");
		var Customer = this.get("container").lookupFactory("model:customer");
		var Debit = this.get("container").lookupFactory("model:debit");
		var Dispute = this.get("container").lookupFactory("model:dispute");
		var Hold = this.get("container").lookupFactory("model:hold");
		var Order = this.get("container").lookupFactory("model:order");
		var Refund = this.get("container").lookupFactory("model:refund");
		var Reversal = this.get("container").lookupFactory("model:reversal");

		var title;
		if (Ember.isBlank(model) || parentModel.uri === model.uri) {
			return;
		}

		if (model.constructor === Order) {
			return {
				className: 'icon-single-transaction',
				title: 'Order',
				resource: model
			};
		}

		if (model.constructor === Hold) {
			return {
				className: 'icon-single-transaction',
				title: 'Hold',
				resource: model
			};
		}

		if (model.constructor === Debit) {
			return {
				className: 'icon-single-transaction',
				title: 'Debit',
				resource: model
			};
		}

		if (model.constructor === Credit) {
			return {
				className: 'icon-single-transaction',
				title: 'Credit',
				resource: model,
			};
		}

		if (model.constructor === Refund) {
			title = (parentModel.constructor === Refund) ? 'Other refund' : 'Refund';

			return {
				className: 'icon-single-transaction',
				title: title,
				resource: model,
			};
		}

		if (model.constructor === Reversal) {
			title = (parentModel.constructor === Reversal) ? 'Other reversal' : 'Reversal';

			return {
				className: 'icon-single-transaction',
				title: title,
				resource: model,
			};
		}

		if (model.constructor === Dispute) {
			return {
				className: 'icon-single-transaction',
				title: 'Dispute',
				resource: model,
			};
		}

		if (model.constructor === Customer) {
			title = 'Customer';

			if (parentModel.constructor === Order) {
				title = (model.get('id') === parentModel.get('seller.id')) ? 'Merchant' : 'Buyer';
			}

			return {
				className: 'icon-customers',
				title: title,
				resource: model,
			};
		}

		if (model.constructor === Card) {
			return {
				className: 'icon-card',
				title: model.get('type_name'),
				resource: model,
			};
		}

		if (model.constructor === BankAccount) {
			return {
				className: 'icon-bank-account',
				title: model.get('type_name').split(' ')[0],
				resource: model,
			};
		}
	}
});

export default SummarySectionView;
