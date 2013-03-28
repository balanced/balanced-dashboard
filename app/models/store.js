(function (app) {
    'use strict';

    var localStorage = window.localStorage,
        get = Ember.get, set = Ember.set;

    /*
     * Like a regular serializer but because we do *not* have a root level
     * element this thing jumps in and munges the payload.
     *
     * http://emberjs.com/guides/models/the-rest-adapter/#toc_json-root
     *
     * TODO: We need to serialize into the root level dict as well as loading
     * from it
     * */
    var rootLevelSerializer = DS.JSONSerializer.create({
        extract: function (loader, json, type, record) {
            var root = this.rootForType(type);
            var nestedJson = {};
            nestedJson[root] = json;

            this.sideload(loader, type, nestedJson, root);
            this.extractMeta(loader, type, nestedJson);

            if (nestedJson) {
                if (record) {
                    loader.updateId(record, nestedJson[root]);
                }
                this.extractRecordRepresentation(loader, type, nestedJson[root]);
            }
        },
        extractMany: function (loader, json, type, records) {
            var root = 'items';

            this.extractMeta(loader, type, json);

            if (json[root]) {
                var objects = json[root], references = [];
                if (records) {
                    records = records.toArray();
                }

                for (var i = 0; i < objects.length; i++) {
                    if (records) {
                        loader.updateId(records[i], objects[i]);
                    }
                    var reference = this.extractRecordRepresentation(loader, type, objects[i]);
                    references.push(reference);
                }

                loader.populateArray(references);
            }
        }
    });

    var adapter = DS.RESTAdapter.extend({
        url: Ember.ENV.BALANCED.API,
        namespace: 'v1',
        serializer: rootLevelSerializer
    });

    var store = DS.Store.extend({
        revision: 12,
        adapter: adapter
    });

    var rootStore = DS.Store.extend({
        revision: 12,
        adapter: adapter
    });

    app.Store = store;
    app.RootStore = rootStore;

})(window.Balanced);
