Balanced.PayMultipleSellersModalView = Balanced.View.extend({

	templateName: 'modals/pay_multiple_sellers',

	didInsertElement: function() {
		this.get('controller').on('openPayMultipleSellersModal', this, this.open);
	},

	willDestroyElement: function() {
		this.get('controller').off('openPayMultipleSellersModal', this, this.open);
	},

	open: function() {
		$('#pay-multiple-sellers').modal({
			manager: this.$()
		});
	},

	actions: {
		fileSelectionChanged: function() {
			this.set('file', event.target.files[0]);
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			var self = this;
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					var fullText = e.target.result;
					var objects = $.csv.toArrays(fullText);

					var createCredit = function(bankAccount) {
						var credit = Balanced.Credit.create();
						credit.set('destination', bankAccount);
						credit.set('amount', amount);
						credit.save();
					};

					// Skip the first, since it's the header
					for (var i = 1; i < objects.length; i++) {
						var obj = objects[i];
						var bankAccountId = obj[1];
						var amount = Balanced.Utils.dollarsToCents(obj[2]);
						Balanced.BankAccount.find(Balanced.BankAccount.constructUri(bankAccountId)).then(createCredit);
					}

					$('#pay-multiple-sellers').modal('hide');
					self.get('controller').transitionToRoute('activity');
				};
			})(this.get('file'));
			reader.readAsText(this.get('file'));
		}
	}
});
