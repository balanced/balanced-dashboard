Balanced.ModalComponent = Ember.Component.extend({
	submitAction: 'submit',
	classNames: ['modal-container'],
	modalElement: '.modal',

	willDestroyElement: function() {
		this.hide();
	},

	hide: function() {
		this.$(this.get('modalElement')).modal('hide');
	},

	actions: {
		open: function(model) {
			var self = this;
			var modalElement = this.get('modalElement');

			if (model) {
				model.on('didCreate', function() {
					self.$(modalElement).modal('hide');
				});

				this.set('model', model);
			}

			this.$(modalElement).modal({
				manager: this.$()
			});
		},

		save: function(model) {
			model = model || this.get('model');

			if (Ember.get(model, 'isSaving')) {
				return;
			}

			var self = this;

			model.save().then(function() {
				self.sendAction('submitAction', model);
			});
		}
	}

});
