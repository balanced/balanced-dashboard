import Ember from "ember";
import ModalView from "./modal";
import Utils from "balanced-dashboard/lib/utils";

var EditCustomerInfoModalView = ModalView.extend({
	templateName: 'modals/edit-customer-info',

	classNames: ['modal-container', 'header-action-container'],

	marketplaceOwner: false,
	optionalFieldsOpen: false,
	controllerEventName: false,

	afterSave: function() {
		this.get('customer').reload();
		this.hide();
	},

	beforeSave: function() {
		var customer = this.get('model');

		Utils.traverse(customer, function(val, key) {
			if (!customer.get(key)) {
				customer.set(key, null);
			}
		});
	},

	actions: {
		open: function() {
			var customer = Ember.copy(this.get('customer'), true);

			// if the address hash is empty, cast it to an empty object
			customer.setProperties({
				isNew: false,
				address: customer.get('address') || {}
			});
			customer.trigger('didCreate');

			this.set('optionalFieldsOpen', false);

			this._super(customer);
		},

		toggleOptionalFields: function() {
			this.set('optionalFieldsOpen', !this.get('optionalFieldsOpen'));
			// trigger a resize to reposition the dialog
			$('body').trigger('resize');
		}
	}
});

export default EditCustomerInfoModalView;
