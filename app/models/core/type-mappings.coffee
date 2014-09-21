`import Ember from "ember"`

TypeMapping = Ember.Object.extend
	init: ->
		@typesMap = {}

	addTypeMapping: (typeCode, className) ->
		@typesMap[typeCode] = className

	classForType: (typeCode) ->
		mappedType = @typesMap[typeCode]
		if !mappedType
			Ember.Logger.warn "Couldn't map typeCode %@".fmt(typeCode)
		return @typeClass(mappedType)

	typeClass: (type) ->
		typeClass = type

		a = eval
		if _.isString(type)
			typeClass = a(type)

		return typeClass

Balanced.TypeMappings = TypeMappings = TypeMapping.create()

`export default TypeMappings`
