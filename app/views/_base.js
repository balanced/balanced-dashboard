var get = Ember.get;

Balanced.View = Ember.View.extend({
	didInsertElement: function() {
		this.set('elementInDom', true);
		this._super();

		this.$('form input[type=text]:first').focus();
	},

	willDestroyElement: function() {
		this.set('elementInDom', false);
		this._super();
	}
});

Balanced.ModalView = Balanced.View.extend({
	controllerEventName: 'openModal',
	modalElement: '.modal',

	didInsertElement: function() {
		this.get('controller').on(this.controllerEventName, this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off(this.controllerEventName, this, this.open);
		this._super();
	},

	hide: function() {
		this.$(this.get('modalElement')).modal('hide');
	},

	_createModal: function(opts) {
		this.$(this.get('modalElement')).modal(_.extend({
			manager: this.$()
		}, opts || {}));
	},

	open: function(model) {
		var self = this;

		if (model) {
			model.on('didCreate', function() {
				self.hide();
			});

			this.set('model', model);
		}

		this._createModal();
	},

	actions: {
		close: function() {
			this.hide();
		},

		save: function(model) {
			model = model || this.get('model');

			if (get(model, 'isSaving')) {
				return;
			}

			var self = this;
			if (_.isFunction(this.beforeSave) && this.beforeSave(model) === false) {
				return;
			}

			model.save().then(function(model) {
				if (_.isFunction(this.afterSave)) {
					this.afterSave(model);
				}

				if (!self.get('submitAction')) {
					return;
				}

				self.sendAction('submitAction', model);
			}, _.bind(this.errorSaving, this));
		}
	}
});
