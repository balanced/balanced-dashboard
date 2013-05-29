////
// Takes in cents and returns pretty formatted dollars
//
// ex: 123456 => $1,234.56
////
Ember.Handlebars.registerBoundHelper('centsToDollars', function(cents) {
    if(cents) {
        return '$' + (cents / 100).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    }
});