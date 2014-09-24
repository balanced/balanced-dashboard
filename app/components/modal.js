import Ember from "ember";

var ModalComponent = Ember.Component.extend({
	submitAction: 'submit',
	classNames: ['modal-container'],
	modalElement: '.modal',

	willDestroyElement: function() {
		this.hide();
	},

	hide: function() {
		this.$(this.get('modalElement')).modal('hide');
	},

	reposition: function() {
		// trigger a resize to reposition the dialog
		$(document.body).trigger('resize');
	},

	actions: {
		open: function(model) {
			var self = this;
			var modalElement = this.get('modalElement');

			if (model) {
				model.on('didCreate', function() {
					self.hide();
				});

				this.set('model', model);
			}

			this.$(modalElement).modal({
				manager: this.$()
			});
		},

		close: function() {
			this.hide();
		},

		save: function(model) {
			model = model || this.get('model');

			if (Ember.get(model, 'isSaving')) {
				return;
			}

			var self = this;

			model.save().then(function() {
				if (!self.get('submitAction')) {
					return;
				}

				self.sendAction('submitAction', model);
			});
		}
	}
});

export default ModalComponent;
