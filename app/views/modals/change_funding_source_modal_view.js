Balanced.ChangeFundingSourceModalView = Balanced.ModalBaseView.extend({
	templateName: 'modals/change-funding-source-modal',
	title: 'Change default payment method',
	elementId: 'change-funding-source',
	classNameBindings: [":wide-modal", ":modal-overflow"],
	submitAction: false,

	source: function() {
		var debitableBankAccounts = this.get('debitable_bank_accounts');
		var sourceUri = this.get('source_uri');
		var defaultSource = null;

		if (!debitableBankAccounts) {
			return;
		}

		if (debitableBankAccounts && debitableBankAccounts.get('length') > 0) {
			defaultSource = (debitableBankAccounts.get('content') || debitableBankAccounts)[0];
		}
		return debitableBankAccounts.find(function(source) {
			if (source) {
				return sourceUri === source.get('uri');
			}
		}) || defaultSource;
	}.property('source_uri', 'debitable_bank_accounts'),

	debitable_bank_accounts: function() {
		return this.get('marketplace.owner_customer.debitable_bank_accounts');
	}.property('marketplace.owner_customer.debitable_bank_accounts'),

	actions: {
		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var invoice = this.get('model');
			var source = this.get('source');
			var cents = null;

			var sourceUri = this.get('source_uri');

			if (source) {
				sourceUri = source.get('debits_uri');
			}

			invoice.set('source_uri', sourceUri);
			invoice.on('didUpdate', function() {
				invoice.reload();
				self.hide();
			});

			this._super(invoice);
		}
	}
});

Balanced.ChangeFundingSourceModalView.reopenClass({
	open: function(invoice) {
		return this.create({
			model: invoice
		});
	}
});

// {{#if is_not_paid}}
// 	<span class="hidden-print">{{change-funding-source-modal marketplace=controllers.marketplace.model source_uri=source.uri model=model}}</span>
// {{/if}}
