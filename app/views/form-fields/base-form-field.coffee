`import Ember from "ember";`

BaseFormFieldView = Ember.View.extend
	layoutName: "form-fields/form-field-layout"
	templateName: "form-fields/base-form-field"
	classNameBindings: [":form-group", "isError:has-error"]
	inputName: Ember.computed "field", ->
		@get("field").replace(/\./, "_")

	value: Ember.computed "model", "field", (a, value) ->
		model = @get("model")
		field = @get("field")

		# setter
		if arguments.length > 1 && model
			model.set(field, value)

		if model
			return model.get(field)

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
	errorMessagesIndirectionHandler: Ember.computed "isLegacyModel", "model", "field", ->
		fieldName = @get("field")
		model = @get("model")

		if !@get("isLegacyModel")
			errorsListKeyName = "model.errors.#{fieldName}"
		else
			errorsListKeyName = "model.validationErrors.#{fieldName}.messages"
		Ember.Object.extend(
			messages: Ember.computed.reads(errorsListKeyName)
		).create(model: model)

	isCanShowValidationErrors: false

	isError: Ember.computed "isCanShowValidationErrors", "isLegacyModel", "errorMessages.length",  ->
		length = @get("errorMessages.length")
		if @get("isLegacyModel")
			length > 0
		else
			(length > 0) && @get("isCanShowValidationErrors")

`export default BaseFormFieldView;`
