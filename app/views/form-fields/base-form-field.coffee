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

	didInsertElement: ->
		makeShowValidationErrors = =>
			if !(@get('isDestroyed') || @get('isDestroying'))
				@set("isCanShowValidationErrors", true)

		$el = @$()
		$el.hover (event) =>
			@displayAlertErrors()
		$el.find(':input').focus (event) =>
			@displayAlertErrors()
		$el.find(":input").blur (event) ->
			makeShowValidationErrors()

		$el.closest("form").submit ->
			makeShowValidationErrors()

	isLegacyModel: Ember.computed.none("model.errors")

	errorMessages: Ember.computed.reads("errorMessagesIndirectionHandler.messages")
	isOneError: Ember.computed.equal("errorMessages.length", 1)
	errorMessagesIndirectionHandler: Ember.computed("model", "field", ->
		fieldName = @get("field")
		model = @get("model")

		if !@get("isLegacyModel")
			errorsListKeyName = "model.errors.#{fieldName}"
		else
			errorsListKeyName = "model.validationErrors.#{fieldName}.fullMessages"

		Ember.Object.extend(
			messages: Ember.computed.reads(errorsListKeyName)
		).create(model: model)
	)

	isCanShowValidationErrors: false
	isError: Ember.computed "isCanShowValidationErrors", "errorMessages.length",  ->
		(@get("errorMessages.length") > 0) && @get("isCanShowValidationErrors")

`export default BaseFormFieldView;`
