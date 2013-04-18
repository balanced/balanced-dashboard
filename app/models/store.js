(function (Balanced) {
    'use strict';

    DS.RESTAdapter.reopen({
        url: Ember.ENV.BALANCED.API,
        namespace: "v1"
    });

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
            var objects = json[root] ? json[root] : json;
            if (objects) {
                var references = [];
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


    var balancedAdapter = DS.RESTAdapter.extend({
        serializer: rootLevelSerializer,
        createRecord: function (store, type, record) {
            var root = this.rootForType(type);
            var data = this.serialize(record, { includeId: true });

            this.ajax(this.buildURL(root), "POST", {
                data: data,
                context: this,
                success: function (json) {
                    Ember.run(this, function () {
                        this.didCreateRecord(store, type, record, json);
                    });
                },
                error: function (xhr) {
                    this.didError(store, type, record, xhr);
                }
            });
        },
        updateRecord: function (store, type, record) {
            var id = Ember.get(record, 'id');
            var root = this.rootForType(type);
            var data = this.serialize(record);

            this.ajax(this.buildURL(root, id), "PUT", {
                data: data,
                context: this,
                success: function (json) {
                    Ember.run(this, function () {
                        this.didSaveRecord(store, type, record, json);
                    });
                },
                error: function (xhr) {
                    this.didError(store, type, record, xhr);
                }
            });
        },

        buildURL: function(record, suffix) {
            var url = [this.url];

            Ember.assert("Namespace URL (" + this.namespace + ") must not start with slash", !this.namespace || this.namespace.toString().charAt(0) !== "/");
            Ember.assert("Record URL (" + record + ") must not start with slash", !record || record.toString().charAt(0) !== "/");
            Ember.assert("URL suffix (" + suffix + ") must not start with slash", !suffix || suffix.toString().charAt(0) !== "/");

            // TODO - HACK - to get around having a namespace on login. Take this out when we do real auth
            // Two URLs that we use are not part of the real API: /logins and /marketplaces (with no parameter), so in those cases leave off the namespace
            if (record !== "login" && (record !== "marketplace" || !Ember.isNone(suffix)) && !Ember.isNone(this.namespace)) {
              url.push(this.namespace);
            }

            url.push(this.pluralize(record));
            if (suffix !== undefined) {
              url.push(suffix);
            }

            return url.join("/");
          },
    });

    Balanced.Store = DS.Store.extend({
        revision: 12,
        adapter: balancedAdapter
    });

})(window.Balanced);
