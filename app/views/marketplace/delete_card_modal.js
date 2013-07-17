Balanced.DeleteCardModalView = Balanced.View.extend({
	templateName: 'modals/delete_card',

	isSubmitting: false,

	didInsertElement: function() {
		this.get('controller').on('openDeleteCardModal', $.proxy(this.open, this));
	},

	open: function(card) {
		this.set('isSubmitting', false);
		this.set('model', card);
		$('#delete-card').modal('show');
	},

	deleteCard: function () {
		if(this.get('isSubmitting')) {
			return;
		}

		var self = this;
		this.set('isSubmitting', true);
		this.get('model').delete().then(function() {
			self.set('isSubmitting', false);
			$('#delete-card').modal('hide');
		}, function() {
			self.set('isSubmitting', false);
		});
	}
});
