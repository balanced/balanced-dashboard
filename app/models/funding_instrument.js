Balanced.FundingInstrument = Balanced.Model.extend({

});

Balanced.Card = Balanced.FundingInstrument.extend({
    type_name: function() {
        return 'Card';
    }.property(),

    is_bank_account: false,

    description: function () {
        return '{0} ({1})'.format(
            this.get('last_four'),
            this.get('brand')
        );
    }.property('last_four', 'brand')
});

Balanced.BankAccount = Balanced.FundingInstrument.extend({
    type_name: function() {
        return 'Bank Account';
    }.property(),

    is_bank_account: true,

    description: function () {
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }

        var acNum = this.get('account_number');
        return '{0} ({1})'.format(
            acNum.substr(acNum.length - 4),
            toTitleCase(this.get('bank_name'))
        );
    }.property('account_number', 'bank_name')
});
