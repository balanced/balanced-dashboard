Balanced.AddBankAccountModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/add_bank_account',

  formProperties: ['name', 'account_number', 'routing_number', 'type'],

  open: function() {
    var bankAccount = Balanced.BankAccount.create({
      name: '',
      account_number: '',
      routing_number: '',
      type: 'checking'
    });
    this.set('model', bankAccount)
    this.reset(bankAccount);
    $('#add-bank-account').modal('show');
  },

  save: function() {
    var self = this;
    var bankAccount = this.get('model');

    bankAccount.one('didCreate', function() {
      self.get('marketplace').refresh();
      $('#add-bank-account').modal('hide');
    });
    bankAccount.on('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    bankAccount.create();
  }
});
