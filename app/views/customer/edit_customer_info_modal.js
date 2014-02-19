Balanced.EditCustomerInfoModalView = Balanced.View.extend({
	templateName: 'modals/edit_customer_info',

	classNames: ['modal-container', 'header-action-container'],

	marketplaceOwner: false,
	optionalFieldsOpen: false,

	dob_month: "",
	dob_year: "",

	willDestroyElement: function() {
		$('#edit-customer-info').modal('hide');
		this._super();
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

			Balanced.Utils.traverse(customer, function(val, key) {
				if (!customer.get(key)) {
					customer.set(key, null);
				}
			});

			customer.save().then(function() {
				self.get('customer').reload();
				$('#edit-customer-info').modal('hide');
			});
		}
	}
});
