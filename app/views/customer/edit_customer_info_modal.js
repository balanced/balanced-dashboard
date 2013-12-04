Balanced.EditCustomerInfoModalView = Balanced.View.extend({
	templateName: 'modals/edit_customer_info',

	classNames: ['modal-container', 'header-action-container'],

	marketplaceOwner: false,
	optionalFieldsOpen: false,

	dob_month: "",
	dob_year: "",

	willDestroyElement: function() {
		$('#edit-customer-info').modal('hide');
	},

	actions: {
		open: function() {
			var customer = Ember.copy(this.get('customer'), true);
			customer.set('isNew', false);

			// if the address hash is empty, cast it to an empty object
			customer.set('address', customer.get('address') || {});

			customer.trigger('didCreate');

			this.set('model', customer);

			this.set('dob_month', customer.get('dob_month'));
			this.set('dob_year', customer.get('dob_year'));

			this.set('optionalFieldsOpen', false);
			$('#edit-customer-info').modal({
				manager: this.$()
			});
		},

		toggleOptionalFields: function() {
			this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
			// trigger a resize to reposition the dialog
			$("body").trigger("resize");
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var customer = this.get('model');
			console.log(customer);

			_.each(['email', 'ssn_last4', 'dob_year', 'dob_month', 'ein', 'business_name', 'phone', 'name', 'address.city', 'address.line1', 'address.line2', 'address.state', 'address.postal_code', 'address.country_code'], function(key) {
				console.log(key, customer.get(key), !customer.get(key) || customer.get(key) === 'xxxx')
				if (!customer.get(key) || customer.get(key) === 'xxxx') {
					customer.set(key, undefined);
				}
			});

			customer.save().then(function() {
				self.get('customer').reload();
				$('#edit-customer-info').modal('hide');
			});
		}
	}
});
