require('app/models/store');


var store = Balanced.AuthStore.create({
    name: 'balanced-ember-example'
});


Balanced.Login = Balanced.Model.extend({
    store: store,

    // TODO: this is lame, how do we create models that just reflect the API
    // (e.g. are dictionaries)
    uri: DS.attr('string'),
    email_address: DS.attr('string'),
    password: DS.attr('string'),
    user_uri: DS.attr('string')
});


Balanced.Login.reopenClass({
    store: store,

    /*
     Removes a model from the store.
     */
    destroy: function (model) {
        this.store.destroy(model);
    }
});
