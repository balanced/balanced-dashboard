require('app/models/core/mixins/load_promise');
require('app/models/core/model_array');
require('app/models/core/type_mappings');
require('app/models/core/serializers/rev1');

var JSON_PROPERTY_KEY = '__json';
var URI_POSTFIX = "_uri";
var URI_METADATA_PROPERTY = "_uris";

Balanced.Model = Ember.Object.extend(Ember.Evented, Ember.Copyable, Balanced.LoadPromise, {

	isLoaded: false,
	isSaving: false,
	isDeleted: false,
	isError: false,
	isNew: true,
	isValid: true,

	displayErrorDescription: function() {
		return (!this.get('isValid') || this.get('isError')) && !this.get('validationErrors');
	}.property('isValid', 'isError', 'validationErrors'),

	// computes the ID from the URI - exists because at times Ember needs the
	// ID of our model before it has finished loading. This gets overridden
	// when the real model object gets loaded by the ID value from the JSON
	// attribute
	id: function() {
		var uri = this.get('uri');

		if (uri) {
			return uri.substring(uri.lastIndexOf('/') + 1);
		}
	}.property('uri'),

	save: function(settings) {
		settings = settings || {};
		var self = this;
		var data = this.constructor.serializer.serialize(this);

		self.set('isSaving', true);

		var creatingNewModel = this.get('isNew');

		var resolveEvent = creatingNewModel ? 'didCreate' : 'didUpdate';
		var uri = creatingNewModel ? this._createUri() : this.get('uri');
		var adapterFunc = creatingNewModel ? Balanced.Adapter.create : Balanced.Adapter.update;

		var promise = this.resolveOn(resolveEvent);

		adapterFunc.call(Balanced.Adapter, this.constructor, uri, data, function(json) {
			var deserializedJson = self.constructor.serializer.extractSingle(json, this.constructor, (creatingNewModel ? null : self.get('href')));
			self._updateFromJson(deserializedJson);
			self.set('isNew', false);
			self.set('isSaving', false);
			self.set('isValid', true);
			self.set('isError', false);
			self.trigger(resolveEvent);
			Balanced.Model.Events.trigger(resolveEvent, self);
		}, $.proxy(self._handleError, self), settings);

		return promise;
	},

	_createUri: function() {
		return this.get('uri');
	},

	delete: function() {
		var self = this;
		var settings = settings || {};

		self.set('isDeleted', true);
		self.set('isSaving', true);

		var promise = this.resolveOn('didDelete');

		Balanced.Adapter.delete(this.constructor, this.get('uri'), function(json) {
			self.set('isSaving', false);
			self.trigger('didDelete');
			Balanced.Model.Events.trigger('didDelete', self);
		}, $.proxy(self._handleError, self), settings);

		return promise;
	},

	reload: function() {
		if (!this.get('isLoaded')) {
			return this;
		}

		var self = this;
		this.set('isLoaded', false);

		var promise = this.resolveOn('didLoad');

		Balanced.Adapter.get(this.constructor, this.get('uri'), function(json) {
			var deserializedJson = self.constructor.serializer.extractSingle(json, this.constructor, self.get('href'));
			self._updateFromJson(deserializedJson);
			self.set('isLoaded', true);
			self.trigger('didLoad');
		}, $.proxy(self._handleError, self));

		return promise;
	},

	copy: function() {
		var modelObject = this.constructor.create({
			uri: this.get('uri')
		});
		modelObject._updateFromJson(this.get(JSON_PROPERTY_KEY));
		return modelObject;
	},

	updateFromModel: function(modelObj) {
		this._updateFromJson(modelObj.get(JSON_PROPERTY_KEY));
	},

	populateFromJsonResponse: function(json) {
		var decodingUri = this.get('isNew') ? null : this.get('uri');
		var modelJson = this.constructor.serializer.extractSingle(json, this.constructor, decodingUri);
		if (modelJson) {
			this._updateFromJson(modelJson);
		} else {
			this.set('isNew', false);
			this.set('isError', true);
			this.trigger('becameError');
		}
	},

	_updateFromJson: function(json) {
		var self = this;
		if (!json) {
			return;
		}

		this.set('isNew', false);
		this.set(JSON_PROPERTY_KEY, json);

		Ember.changeProperties(function() {
			for (var prop in json) {
				if (json.hasOwnProperty(prop)) {
					var desc = Ember.meta(self.constructor.proto(), false).descs[prop];
					// don't override computed properties with raw json
					if (!(desc && desc instanceof Ember.ComputedProperty)) {
						self.set(prop, json[prop]);
					}
				}
			}
		});

		this.set('isLoaded', true);
		this.trigger('didLoad');
	},

	_handleError: function(jqXHR, textStatus, errorThrown) {
		this.set('isSaving', false);
		if (jqXHR.status === 400) {
			this.set('isValid', false);
			this.trigger('becameInvalid', jqXHR.responseText);
		} else {
			this.set('isError', true);
			this.set('errorStatusCode', jqXHR.status);
			this.trigger('becameError', jqXHR.responseText);
		}

		if (jqXHR.responseJSON && jqXHR.responseJSON.extras && Object.keys(jqXHR.responseJSON.extras).length > 0) {
			this.set('validationErrors', jqXHR.responseJSON.extras);
		}

		if (jqXHR.responseJSON && jqXHR.responseJSON.description) {
			this.set('errorDescription', jqXHR.responseJSON.description);
		}
	},

	_extractTypeClassFromUrisMetadata: function(uriProperty) {
		var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

		var metadataType = this.get(uriMetadataProperty + "." + uriProperty + "._type");
		if (metadataType) {
			var mappedType = Balanced.TypeMappings.classForType(metadataType);
			if (mappedType) {
				return mappedType;
			} else {
				Ember.Logger.warn("Couldn't map _type of %@ for URI: %@".fmt(metadataType, this.get('uri')));
			}
		}

		return undefined;
	}
});

Balanced.Model.reopenClass({
	serializer: Balanced.Rev1Serializer.create(),

	find: function(uri, settings) {
		var modelClass = this;
		var modelObject = modelClass.create({
			uri: uri
		});
		modelObject.set('isLoaded', false);
		modelObject.set('isNew', false);

		Balanced.Adapter.get(modelClass, uri, function(json) {
			modelObject.populateFromJsonResponse(json, uri);
		}, $.proxy(modelObject._handleError, modelObject));

		return modelObject;
	},

	findAll: function(settings) {
		var uri = this.create().get('uri');
		if (!uri) {
			throw new Error("Can't call findAll for class that doesn't have a default URI: %@".fmt(this));
		}
		return Balanced.ModelArray.newArrayLoadedFromUri(uri, this);
	},

	constructUri: function(id) {
		var uri = this.create().get('uri');
		if (id) {
			return Balanced.Utils.combineUri(uri, id);
		}
		return uri;
	},

	/*
	 * Used for adding a one-to-one association to a model.
	 *
	 * Params:
	 * - propertyName - The property whose value we'll get to determine the URI
	 *  or embedded data to use for the association
	 *  - defaultType - Used as a fallback in case the object doesn't have a
	 * _type or the _uris doesn't have data for this association
	 *
	 * Example:
	 *
	 * Balanced.Marketplace = Balanced.UserMarketplace.extend({
	 *      owner_customer: Balanced.Model.belongsTo('owner_customer_json', 'Balanced.Customer')
	 * });
	 */
	belongsTo: function(propertyName, defaultType) {
		defaultType = defaultType || 'Balanced.Model';

		var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
		var uriProperty = propertyName + URI_POSTFIX;
		var fullUriProperty = JSON_PROPERTY_KEY + '.' + propertyName + URI_POSTFIX;

		return Ember.computed(function() {
			var typeClass = Balanced.TypeMappings.typeClass(defaultType);

			var embeddedPropertyValue = this.get(embeddedProperty);
			var uriPropertyValue = this.get(fullUriProperty);
			if (embeddedPropertyValue) {
				var embeddedObj = typeClass._materializeLoadedObjectFromAPIResult(embeddedPropertyValue);
				return embeddedObj;
			} else if (uriPropertyValue) {
				var metadataTypeClass = this._extractTypeClassFromUrisMetadata(uriProperty);
				if (metadataTypeClass) {
					typeClass = metadataTypeClass;
					return typeClass.find(uriPropertyValue);
				} else {
					// if we can't figure out what type it is from the
					// metadata, fetch it and set the result as an embedded
					// property in our JSON. That'll force an update of the
					// association
					var self = this;
					Balanced.Adapter.get(defaultType, uriPropertyValue, function(json) {
						var modelJson = typeClass.serializer.extractSingle(json, typeClass, uriPropertyValue);
						self.set(embeddedProperty, modelJson);
					});

					return embeddedPropertyValue;
				}
			} else {
				return embeddedPropertyValue;
			}
		}).property(embeddedProperty, fullUriProperty);
	},

	/*
	 * Used for adding a one-to-many association to a model.
	 *
	 * Params:
	 * - propertyName - The property whose value we'll get to determine the URI
	 *  or embedded data to use for the association
	 *  - defaultType - Used to find/construct child objects. If the _type
	 * field is present in the returned JSON, we'll map that to create objects
	 * of the correct type. Since we use the type of object to pick which host
	 * to use, it's important to set the defaultType, even if your returned
	 * data uses the _type field.
	 *
	 * Example:
	 *
	 * Balanced.Marketplace = Balanced.UserMarketplace.extend({
	 *      customers: Balanced.Model.hasMany('customers_json', 'Balanced.Customer')
	 * });
	 */
	hasMany: function(propertyName, defaultType) {
		defaultType = defaultType || 'Balanced.Model';

		var embeddedProperty = JSON_PROPERTY_KEY + '.' + propertyName;
		var uriProperty = propertyName + URI_POSTFIX;
		var fullUriProperty = JSON_PROPERTY_KEY + '.' + uriProperty;
		var uriMetadataProperty = JSON_PROPERTY_KEY + '.' + URI_METADATA_PROPERTY;

		return Ember.computed(function() {
			var typeClass = Balanced.TypeMappings.typeClass(defaultType);
			var embeddedPropertyValue = this.get(embeddedProperty);
			// if the URI isn't defined in the JSON, check for a property on
			// the model. This way we can hardcode URIs if necessary to support
			// undocumented URIs
			var uriPropertyValue = this.get(fullUriProperty) || this.get(uriProperty);

			if (embeddedPropertyValue) {
				return Balanced.ModelArray.newArrayCreatedFromJson(embeddedPropertyValue, defaultType);
			} else if (uriPropertyValue) {
				return Balanced.ModelArray.newArrayLoadedFromUri(uriPropertyValue, defaultType);
			} else {
				return Balanced.ModelArray.create({
					content: Ember.A(),
					typeClass: typeClass
				});
			}
		}).property(embeddedProperty, uriProperty, fullUriProperty, uriMetadataProperty + ".@each");
	},

	_materializeLoadedObjectFromAPIResult: function(json) {
		var objClass = this;
		if (json._type) {
			var mappedTypeClass = Balanced.TypeMappings.classForType(json._type);
			if (mappedTypeClass) {
				objClass = mappedTypeClass;
			}
		} else {
			// HACK - once we fix the API response from the auth proxy, we should take out the if
			if (objClass !== Balanced.UserMarketplace) {
				Ember.Logger.warn("No _type field found on URI: " + json.uri);
			}
		}
		var typedObj = objClass.create();
		typedObj.set('isNew', false);
		typedObj._updateFromJson(json);
		typedObj.trigger('didLoad');
		return typedObj;
	},

	_isEmbedded: function(propertyName, settings) {
		settings = settings || {};

		var embedded = !(/_uri$/.test(propertyName));
		if (settings.hasOwnProperty('embedded')) {
			embedded = settings.embedded;
		}

		return embedded;
	}
});

Balanced.Model.Events = Ember.Object.extend(Ember.Evented).create();
