var JSON_PROPERTY_KEY = '__json';
var LINKS_PROPERTY_KEY = '__links';
var EMBEDDED_DATA_PROPERTY_KEY = '__embedded';

Balanced.Rev1Serializer = Ember.Object.extend({
	//  properties which are not echoed back to the server
	privateProperties: ['id', 'uri', 'validationErrors', JSON_PROPERTY_KEY, LINKS_PROPERTY_KEY, EMBEDDED_DATA_PROPERTY_KEY, '_type'],

	serialize: function(record) {
		var json = this._propertiesMap(record);
		return json;
	},

	extractSingle: function(rootJson, href) {
		var modelObj;
		var objType;

		var objTypes = _.keys(_.omit(rootJson, "links", "meta"));
		if (objTypes.length === 0) {
			return null;
		}

		if (objTypes.length > 1) {
			Ember.warn("Got more than we bargained for in extractSingle");
		}

		objType = objTypes[0];

		modelObj = rootJson[objType][0];

		this._populateObject(modelObj, objType, rootJson);

		return modelObj;
	},

	extractCollection: function(rootJson) {
		var collection = [];
		var self = this;

		var populateFunc = function(val) {
			collection.push(self._populateObject(val, typeName, rootJson));
		};

		for (var typeName in rootJson) {
			var vals = rootJson[typeName];
			if ($.isArray(vals)) {
				_.each(vals, populateFunc);
			}
		}

		var nextUri = rootJson.meta ? rootJson.meta.next : null;

		return {
			items: collection,
			next_uri: nextUri
		};
	},

	_populateObject: function(modelObj, objType, rootJson) {
		var linksValues = {};
		linksValues[objType + '.id'] = modelObj.id;
		if (modelObj.links) {
			for (var key in modelObj.links) {
				linksValues[objType + '.' + key] = modelObj.links[key];
			}
		}

		var replaceHrefFunc = function(match, linkParam) {
			var replacement = linksValues[linkParam];

			if (replacement === undefined) {
				Ember.Logger.warn("Couldn't find replacement for param %@".fmt(linkParam));
				throw new Error("Undefined value for URL macro");
			}

			if(replacement === null) {
				throw new Error("Null value for URL macro");
			}

			return replacement;
		};

		var templatedLinks = {};
		var objPropertyName = objType;
		for (var link in rootJson.links) {
			if (link.indexOf(objPropertyName + ".") === 0) {
				var linkName = link.substring(objPropertyName.length + 1);

				// Template all the links
				var href = rootJson.links[link];

				try {
					var replacedHref = href.replace(/\{([\.\w]+)\}/g, replaceHrefFunc);
					templatedLinks[linkName] = replacedHref;
				} catch (e) {
					templatedLinks[linkName] = null;
				}
			}
		}

		for (link in templatedLinks) {
			modelObj[link + "_uri"] = templatedLinks[link];
		}

		modelObj.uri = modelObj.href;
		modelObj._type = objType.replace(/s$/, '');
		return modelObj;
	},

	// Taken from http://stackoverflow.com/questions/9211844/reflection-on-emberjs-objects-how-to-find-a-list-of-property-keys-without-knowi
	_propertiesMap: function(record) {
		var computedProps = [];
		record.constructor.eachComputedProperty(function(prop) {
			computedProps.push(prop);
		});

		var lifecycleProperties = ['isLoaded', 'isNew', 'isSaving', 'isValid', 'isError', 'isDeleted'];

		var props = {};
		for (var prop in record) {
			if (record.hasOwnProperty(prop) &&
				$.inArray(prop, computedProps) === -1 &&
				$.inArray(prop, lifecycleProperties) === -1 &&
				$.inArray(prop, this.privateProperties) === -1 &&
				prop.indexOf('__ember') < 0 &&
				prop.indexOf('_super') < 0 &&
				Ember.typeOf(record.get(prop)) !== 'function'
			) {
				props[prop] = record[prop];
			}
		}

		return props;
	}
});
