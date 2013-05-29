////
// Takes in cents and returns pretty formatted dollars
//
// ex: 123456 => $1,234.56
////
Ember.Handlebars.registerBoundHelper('formatCurrency', Balanced.Utils.formatCurrency);