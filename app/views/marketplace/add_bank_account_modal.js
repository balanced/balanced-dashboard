Balanced.AddBankAccountModalView = Balanced.View.extend({
    templateName: 'modals/add_bank_account',

    open: function () {
        var bankAccount = Balanced.BankAccount.create({
            uri: this.get('customer.bank_accounts_uri'),
            name: '',
            account_number: '',
            routing_number: '',
            type: 'checking'
        });
        this.set('model', bankAccount);
        this.$('#add-bank-account').modal('show');
        this.$('form input:radio[name=account_type][value=checking]').prop('checked', true);
    },

    save: function () {
        if (this.get('model.isSaving')) {
            return;
        }
        this.set('model.isSaving', true);

        var self = this;
        var bankAccount = this.get('model');

        var bankAccountData = {
            // this isn't an ember widget, so have to grab it ourselves
            type: this.$('form input[name=account_type]:checked').val(),
            name: bankAccount.get('name'),
            account_number: bankAccount.get('account_number'),
            routing_number: bankAccount.get('routing_number')
        };

        // Tokenize the bank account using the balanced.js library
        balanced.bankAccount.create(bankAccountData, function (response) {
            switch (response.status) {
                case 201:
                    self.associateBankAccount(response.data);
                    break;
                case 400:
                    bankAccount.set('validationErrors', {});
                    _.each(response.error, function (value, key) {
                        bankAccount.set('validationErrors.' + key, 'invalid');
                    });
                    self.set('model.isSaving', false);
                    break;
                default:
                    bankAccount.set('displayErrorDescription', true);
                    var errorSuffix = (response.error && response.error.description) ? (': ' + response.error.description) : '.';
                    bankAccount.set('errorDescription', 'Sorry, there was an error tokenizing this bank account' + errorSuffix);
                    self.set('model.isSaving', false);
                    break;
            }
        });
    },

    associateBankAccount: function(responseData) {
        var self = this;

        // Now that it's been tokenized, we just need to associate it with this customer's account
        var bankAccountAssociation = Balanced.BankAccount.create({
            uri: this.get('customer.bank_accounts_uri'),
            bank_account_uri: responseData.uri
        });
        bankAccountAssociation.save().then(function () {
            self.set('model.isSaving', false);
            self.get('customer.bank_accounts').reload();
            $('#add-bank-account').modal('hide');
        }, function() {
            self.set('model.displayErrorDescription', true);
            self.set('model.errorDescription', 'Sorry, there was an error associating this bank account.');
            self.set('model.isSaving', false);
        });
    }
});
