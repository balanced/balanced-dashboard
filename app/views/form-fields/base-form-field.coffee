`import Ember from "ember";`

BaseFormFieldView = Ember.View.extend
	layoutName: "form-fields/form-field-layout"
	templateName: "form-fields/base-form-field"
	classNameBindings: [":form-group", "isError:has-error"]
	inputName: (->
		return @get("field").replace(/\./, "_")
	).property("field")

	setModelValue: (value) ->
		model = @get("model")
		field = @get("field")
		if (model)
			model.set(field, value)
		else
			null

	getModelValue: ->
		model = @get("model")
		field = @get("field")
		if model
			return model.get(field)
		else
			null

	value: ( (a, value) ->
		if arguments.length > 1
			@setModelValue(value)
		return @getModelValue()
	).property("model", "field")

	displayAlertErrors: ->
		$('.alert-error').hide()
		@$('.alert-error').css('display', 'inline')

	bindUpdateErrorMessages: ->
		fieldName = @get("field")
		if !@get("isLegacyModel")
			errorsListKeyName = "model.errors.#{fieldName}"
		else
			errorsListKeyName = "model.validationErrors.#{fieldName}.fullMessages"

		updateErrorMessages = =>
			errorsList = @get(errorsListKeyName) || []
			@set("errorMessages", errorsList)
		updateErrorMessages()
		@addObserver(errorsListKeyName, updateErrorMessages)


	# Since we don't know the name of the property to
	# observe ahead of time, create the observer when
	# inserted into the DOM (we'll have the key then).
	didInsertElement: ->
		$el = @$()
		$el.hover (event) =>
			@displayAlertErrors()
		$el.find('input').focus (event) =>
			@displayAlertErrors()

		@bindUpdateErrorMessages()

	isLegacyModel: Ember.computed.none("model.errors")

	errorMessages: Ember.computed(-> [])
	isOneError: Ember.computed.equal("errorMessages.length", 1)
	isError: Ember.computed.gt("errorMessages.length", 0)

`export default BaseFormFieldView;`
