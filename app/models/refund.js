Balanced.Refund = Balanced.Transaction.extend({
    type_name: function() {
        return "Refund";
    }.property(),

    funding_instrument_description: function() {
      if(this.get('debit')) {
        // TODO - what should we display for refunds?
        return this.get('debit').account_name;
      } else {
        return "";
      }
    }.property('debit')
});
