import Ember from "ember";

var ModalView = Ember.View.extend({
	controllerEventName: 'openModal',
	modalElement: '.modal',
	defaultModelAction: 'save',
	controllerKey: 'controller',

	didInsertElement: function() {
		if (this.controllerEventName) {
			this.get(this.get('controllerKey')).on(this.controllerEventName, this, this.open);
		}

		this._super();
	},

	willDestroyElement: function() {
		if (this.controllerEventName) {
			this.get(this.get('controllerKey')).off(this.controllerEventName, this, this.open);
		}

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
			var eventName = this.get('defaultModelAction');
			if (eventName) {
				if (eventName === 'save') {
					eventName = 'didCreate';
				} else if (eventName === 'delete') {
					eventName = 'didDelete';
				}

				model.on(eventName, function() {
					self.hide();
				});
			}

			this.set('model', model);
		}

		this._createModal();
	},

	reposition: function() {
		// trigger a resize to reposition the dialog
		$(document.body).trigger('resize');
	},

	actions: {
		close: function() {
			this.hide();
		},

		save: function(model, opts) {
			model = model || this.get('model');

			if (Ember.get(model, 'isSaving')) {
				return;
			}

			var self = this;
			if (_.isFunction(this.beforeSave) && this.beforeSave(model) === false) {
				return;
			}

			var errorCallback = this.errorSaving;
			if (_.isFunction(errorCallback)) {
				errorCallback = _.bind(errorCallback, this);
			}

			model[this.get('defaultModelAction')].call(model, opts).then(function(model) {
				if (_.isFunction(self.afterSave)) {
					self.afterSave(model);
				}

				if (!self.get('submitAction')) {
					return;
				}

				self.sendAction('submitAction', model);
			}, errorCallback);
		}
	}
});


export default ModalView;
