require('app/models/mixins/load_promise');

Balanced.ModelArray = Ember.ArrayProxy.extend(Balanced.LoadPromise, {
    isLoaded: false,
    hasNextPage: false,
    loadingNextPage: false,

    loadNextPage: function () {
        var self = this;

        var promise = this.resolveOn('didLoad');
        self.set('loadingNextPage', true);

        if (this.get('hasNextPage')) {
            var typeClass = this.get('typeClass');

            Balanced.Adapter.get(typeClass, this.get('next_uri'), function (json) {
                self.populateModels(json);
                self.set('loadingNextPage', false);
            });
        } else {
            promise.reject(this);
            self.set('loadingNextPage', false);
        }

        return promise;
    },

    refresh: function () {
        if(this.get('isLoaded')) {
            var self = this;
            this.set('isLoaded', false);
            var promise = this.resolveOn('didLoad');

            Balanced.Adapter.get(this.constructor, this.get('uri'), function (json) {
                // todo, maybe we should go through and reload each item rather
                // than nuking and re-adding
                self.clear();
                self.populateModels(json);
            }, function () {
                promise.reject(self);
            });
            return promise;
        } else {
            return this;
        }
    },

    populateModels: function (json) {
        var self = this;

        var typeClass = this.get('typeClass');

        var itemsArray;
        if (json && $.isArray(json)) {
            itemsArray = json;
            this.set('next_uri', undefined);
            this.set('hasNextPage', false);
        } else {
            if (json && json.items && $.isArray(json.items)) {
                itemsArray = json.items;

                if (json.next_uri) {
                    this.set('next_uri', json.next_uri);
                    this.set('hasNextPage', true);
                } else {
                    this.set('next_uri', undefined);
                    this.set('hasNextPage', false);
                }
            } else {
                this.set('isError', true);
                return;
            }
        }

        var typedObjects = _.map(itemsArray, function (item) {
            var typedObj = typeClass._materializeLoadedObjectFromAPIResult(item);

            // if an object is deleted, remove it from the collection
            typedObj.on('didDelete', function () {
                self.removeObject(typedObj);
            });

            return typedObj;
        });

        this.addObjects(typedObjects);
        this.set('isLoaded', true);
        this.trigger('didLoad');
    }
});
