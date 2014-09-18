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

	getFullErrorMessagesFor: (fieldName) ->
		@get("model.validationErrors.#{fieldName}.fullMessages") || []

	errorMessages: ( ->
		return @getFullErrorMessagesFor(@get("field"))
	).property("model.validationErrors.allMessages.length")

	isOneError: Ember.computed.equal("errorMessages.length", 1)

	isError: Ember.computed.gt("errorMessages.length", 0)

	didInsertElement: ->
		$('.form-group').hover( (event) ->
			$('.alert-error').css('display', 'none')
			$(event.currentTarget).find('.alert-error').css('display', 'inline')
		)

		$('.form-group input').focus( (event) ->
			$('.alert-error').css('display', 'none')
			$(event.currentTarget).parents('.form-group').find('.alert-error').css('display', 'inline')
		)

`export default BaseFormFieldView;`
