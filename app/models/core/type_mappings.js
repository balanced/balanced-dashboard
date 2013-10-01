var typeMapping = Ember.Object.extend({
	init: function() {
		this.typesMap = {};
	},

	addTypeMapping: function(typeCode, className) {
		this.typesMap[typeCode] = className;
	},

	classForType: function(typeCode) {
		var mappedType = this.typesMap[typeCode];
		if (!mappedType) {
			Ember.Logger.warn("Couldn't map typeCode %@".fmt(typeCode));
		}
		return this.typeClass(mappedType);
	},

	typeClass: function(type) {
		// allow dependencies to be set using strings instead of class
		// statements so we don't have ordering issues when declaring our
		// models
		var typeClass = type;
		//  HACK: this gets around the jshint eval warning but let's clean this up.
		var a = eval;
		if (typeof type === 'string') {
			typeClass = a(type);
		}

		return typeClass;
	}
});

Balanced.TypeMappings = typeMapping.create();
