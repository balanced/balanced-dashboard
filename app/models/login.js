require('app/models/store');

Balanced.Login = Balanced.Model.extend({
    // TODO: this is lame, how do we create models that just reflect the API
    // (e.g. are dictionaries)
    uri: DS.attr('string'),
    email_address: DS.attr('string'),
    password: DS.attr('string'),
    user_uri: DS.attr('string')
});
