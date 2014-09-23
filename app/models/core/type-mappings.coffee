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
		if _.isString(type)
			return @classForType(type)
		else
			return type

TypeMappings = TypeMapping.create()

`export default TypeMappings`
