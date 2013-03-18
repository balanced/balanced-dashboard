(function (app) {
    'use strict';

    var localStorage = window.localStorage,
        get = Ember.get, set = Ember.set;

    var Store = Ember.Object.extend({
        init: function (properties) {
            this._super(properties);
            var store = localStorage.getItem(get(this, 'name'));
            set(this, 'data', ( store && JSON.parse(store)) || {});
        },

        createRecord: function (model) {
            set(model, 'id', Date.now());
            return this.update(model);
        },

        update: function (model) {
            var data = this.get('data');

            data[get(model, 'id')] = model.getProperties(
                'id', 'title', 'completed'
            );

            this._stash();

            this.all().addObject(model);
            return model;
        },

        // Delete a model from `this.data`, returning it.
        destroy: function (model) {
            delete this.data[ model.get('id') ];
            this._stash();

            this.all().removeObject(model);
            return model;
        },

        all: function () {
            return this.get('_all');
        },

        _all: Ember.computed(function () {
            var data = get(this, 'data');
            var all = Ember.A([]);

            for (var keyName in data) {
                if (data.hasOwnProperty(keyName)) {
                    all.addObject(Balanced.Marketplace.create(data[keyName]));
                }
            }

            return all;
        }).property('data'),


        // Save the current state of the **Store** to *localStorage*.
        _stash: function () {
            localStorage.setItem(get(this, 'name'), JSON.stringify(get(this, 'data')));
        }
    });

    app.Store = Store;

})(window.Balanced);
