Balanced.CreateBankAccountModalView = Balanced.View.extend({
  templateName: 'modals/create_bank_account',

  nameError: false,
  accountNumberError: false,
  routingNumberError: false,
  typeError: false,

  name: "",
  accountNumber: "",
  routingNumber: "",
  type: "checking",

  save: function() {
    var self = this;

    var bankAccount = Balanced.BankAccount.create({
      name: this.get('name.value'),
      account_number: this.get('account_number.value'),
      routing_number: this.get('routing_number.value'),
      type: this.get('type.value')
    });

    bankAccount.one('didCreate', function() {
      $('#create-bank-account').modal('hide');
      self.get('marketplace').get('bank_accounts').addObject(bankAccount);
    });
    bankAccount.on('becameInvalid', function(json) {
      console.log("Error creating bank account: " + json);
    });
    bankAccount.create();
  }
});
