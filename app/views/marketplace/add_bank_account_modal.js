Balanced.AddBankAccountModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/add_bank_account',

  formProperties: ['name', 'account_number', 'routing_number'],

  open: function() {
    var bankAccount = Balanced.BankAccount.create({
      uri: this.get('marketplace.owner_customer.bank_accounts_uri'),
      name: '',
      account_number: '',
      routing_number: '',
      type: 'checking'
    });
    this.set('model', bankAccount)
    this.reset(bankAccount);
    this.$('#add-bank-account').modal('show');
    this.$("form input:radio[name=account_type][value=checking]").prop("checked", true)
  },

  save: function() {
    var self = this;
    var bankAccount = this.get('model');

    // this isn't an ember widget, so have to grab it ourselves
    bankAccount.set('type', this.$("form input[name=account_type]").val());

    bankAccount.one('didCreate', function() {
      var verification = Balanced.Verification.create({
        uri: bankAccount.get('verifications_uri')
      });

      verification.one('didCreate', function() {
        self.get('marketplace').refresh();
        $('#add-bank-account').modal('hide');
      });
      verification.create();
    });
    bankAccount.on('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    bankAccount.create();
  }
});
