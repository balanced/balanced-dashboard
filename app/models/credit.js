Balanced.Credit = Balanced.Transaction.extend({
    type_name: function() {
        return "Credit";
    }.property(),

    funding_instrument_description: function() {
      if(this.get('bank_account')) {
      return this.get('bank_account').last_four + " (" + this.get('bank_account').bank_name + ") / " + this.get('bank_account').name;
      } else {
        return "";
      }
    }.property('bank_account')
});

Balanced.Credit.find = function(uri) {
    var credit = Balanced.Credit.create({uri: uri});
    Balanced.Model.ajax(ENV.BALANCED.API + uri, "GET").then(function(json) {
        credit.setProperties(json);
    });
    return credit;
};
