class ValidationServerErrorHandler
	constructor: (@model, @response) ->

	addErrorMessage: (key, message) ->
		@model.get("validationErrors").add(key, "serverError", null, message)

	clear: ->
		console.log(@model.get("validationErrors"))
		@model.get("validationErrors").clear()

	getServerExtraKeyMapping: (key) ->
		if key == "incorporation_date"
			key = "business.incorporation_date"
		else if key == "tax_id"
			key = "business.tax_id"
		else if key == "dob"
			key = "person.dob"
		return key

	execute: ->
		errorsList = @response.errors || [];

		_.each errorsList, (error) =>
			if _.keys(error.extras).length > 0
				_.each error.extras, (message, key) =>
					key = @getServerExtraKeyMapping(key)
					@addErrorMessage(key, message)
			else if error.description
				if error.description.indexOf(" - ") > 0
					message = error.description.split(" - ")[1]
				else
					message = error.description;
				@addErrorMessage("", message)
			else
				@addErrorMessage("", error[0])

`export default ValidationServerErrorHandler`
