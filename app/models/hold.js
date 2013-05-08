Balanced.Hold = Balanced.Transaction.extend({
    type_name: function() {
        return "Hold";
    }.property(),

    funding_instrument_description: function() {
      if(this.get('source')) {
        return this.get('source').last_four + " (" + this.get('source').card_type + ") / " + this.get('source').name;
      } else {
        return "";
      }
    }.property('source')
});
