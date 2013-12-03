require('app/models/mixins/load_promise');

Balanced.ModelArray = Ember.ArrayProxy.extend(Balanced.LoadPromise, {
	isLoaded: false,
	hasNextPage: false,
	loadingNextPage: false,

	loadNextPage: function() {
		var self = this;

		var promise = this.resolveOn('didLoad');
		self.set('loadingNextPage', true);

		if (this.get('hasNextPage')) {
			var typeClass = this.get('typeClass');

			Balanced.Adapter.get(typeClass, this.get('next_uri'), function(json) {
				var deserializedJson = typeClass.serializer.extractCollection(json);
				self._populateModels(deserializedJson);
				self.set('loadingNextPage', false);
			});
		} else {
			promise.reject(this);
			self.set('loadingNextPage', false);
		}

		return promise;
	},

	loadAll: function() {
		var self = this;
		var loadAll = _.bind(this.loadAll, this);

		if (this.get('isLoaded')) {
			_.defer(function() {
				if (self.get('hasNextPage') && !self.get('loadingNextPage')) {
					self.loadNextPage().then(loadAll);
				}
			});
		} else {
			this.one('didLoad', loadAll);
		}
	},

	reload: function() {
		if (!this.get('isLoaded')) {
			return this;
		}

		var self = this;
		this.set('isLoaded', false);
		var promise = this.resolveOn('didLoad');
		var typeClass = this.get('typeClass');

		Balanced.Adapter.get(this.constructor, this.get('uri'), function(json) {
			// todo, maybe we should go through and reload each item rather
			// than nuking and re-adding
			self.clear();
			var deserializedJson = typeClass.serializer.extractCollection(json);
			self._populateModels(deserializedJson);
		}, function() {
			promise.reject(self);
		});
		return promise;
	},

	_populateModels: function(json) {
		var self = this;

		var typeClass = this.get('typeClass');

		var itemsArray;
		if (json && $.isArray(json)) {
			itemsArray = json;
			this.set('next_uri', undefined);
			this.set('hasNextPage', false);
			this.set('counts', {});
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

				this.set('counts', json.counts);
			} else {
				this.set('isError', true);
				return;
			}
		}

		var typedObjects = _.map(itemsArray, function(item) {
			var typedObj = typeClass._materializeLoadedObjectFromAPIResult(item);

			// if an object is deleted, remove it from the collection
			typedObj.on('didDelete', function() {
				self.removeObject(typedObj);
			});

			return typedObj;
		});

		this.addObjects(typedObjects);
		this.set('isLoaded', true);
		this.trigger('didLoad');
	},

	_handleError: function(jqXHR, textStatus, errorThrown) {
		if (jqXHR.status === 400) {
			this.set('isValid', false);
			this.trigger('becameInvalid', jqXHR.responseText);
		} else {
			this.set('isError', true);
			this.trigger('becameError', jqXHR.responseText);
		}
	}
});

Balanced.ModelArray.reopenClass({
	newArrayLoadedFromUri: function(uri, defaultType) {
		var typeClass = Balanced.TypeMappings.typeClass(defaultType);
		var modelObjectsArray = this.create({
			content: Ember.A(),
			typeClass: typeClass,
			uri: uri
		});

		if (!uri) {
			return modelObjectsArray;
		}

		modelObjectsArray.set('isLoaded', false);
		Balanced.Adapter.get(typeClass, uri, function(json) {
			var deserializedJson = typeClass.serializer.extractCollection(json);
			modelObjectsArray._populateModels(deserializedJson);
		}, function(jqXHR, textStatus, errorThrown) {
			modelObjectsArray._handleError(jqXHR, textStatus, errorThrown);
		});

		return modelObjectsArray;
	},

	newArrayCreatedFromJson: function(json, defaultType) {
		var typeClass = Balanced.TypeMappings.typeClass(defaultType);
		var modelObjectsArray = this.create({
			content: Ember.A(),
			typeClass: typeClass,
			uri: null
		});

		if (!json) {
			return modelObjectsArray;
		}

		var deserializedJson = typeClass.serializer.extractCollection(json);
		modelObjectsArray._populateModels(deserializedJson);

		return modelObjectsArray;
	}
});
