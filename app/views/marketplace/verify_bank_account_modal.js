Balanced.VerifyBankAccountModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/verify_bank_account',

  formProperties: ['amount_1', 'amount_2'],

  open: function(bankAccount) {
    this.set('bank_account', bankAccount);

    // operate on a copy so we don't mess up the original object
    var originalVerification = bankAccount.get('verification');
    var verification = Ember.copy(originalVerification, true);
    this.set('model', verification);
    this.reset(verification);
    $('#verify-bank-account').modal('show');
  },

  save: function() {
    var self = this;

    var verification = this.get('model');

    verification.one('didUpdate', function() {
      self.bank_account.refresh();
      $('#verify-bank-account').modal('hide');
    });
    verification.one('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject);
    });
    verification.update();
  }
});
