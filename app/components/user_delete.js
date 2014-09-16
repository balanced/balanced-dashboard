Balanced.UserDeleteModalComponent = Balanced.ModalComponent.extend({
	isSubmitting: false,
	hasError: false,

	actions: {
		confirm: function() {
			var self = this;

			this.setProperties({
				hasError: false,
				isSubmitting: true
			});

			var user = this.get('user');
			if (!user || !user.delete) {
				return;
			}

			user.delete()
				.then(function() {
					self.setProperties({
						hasError: false,
						isSubmitting: false
					});
					self.get('userMarketplace').notifyPropertyChange('marketplace');
					self.hide();
				}, function() {
					self.setProperties({
						hasError: true,
						isSubmitting: false
					});
				});
		}
	}
});
