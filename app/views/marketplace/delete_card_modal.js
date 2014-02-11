Balanced.DeleteCardModalView = Balanced.View.extend({
	templateName: 'modals/delete_card',

	didInsertElement: function() {
		this.get('controller').on('openDeleteCardModal', this, this.open);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').off('openDeleteCardModal', this, this.open);
		this._super();
	},

	open: function(card) {
		this.set('model', card);
		$('#delete-card').modal({
			manager: this.$()
		});
	},

	actions: {
		deleteCard: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			this.get('model').delete().then(function() {
				$('#delete-card').modal('hide');
			});
		}
	}
});
