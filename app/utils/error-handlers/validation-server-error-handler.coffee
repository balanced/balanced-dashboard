`import BaseErrorHandler from "./base";`

class ValidationServerErrorHandler extends BaseErrorHandler
	constructor: (@model, @response) ->

	getServerExtraKeyMapping: (key) ->
		switch key
			when "incorporation_date" then "business.incorporation_date"
			when "tax_id" then "business.tax_id"
			when "dob" then "person.dob"
			else key

	execute: ->
		errorsList = @response.errors || []

		_.each errorsList, (error) =>
			if _.keys(error.extras).length > 0
				_.each error.extras, (message, key) =>
					key = @getServerExtraKeyMapping(key)
					@addErrorMessage(key, message)
			else if error.additional
				@addErrorMessage(undefined, error.additional)
			else if error.description
				if error.description.indexOf(" - ") > 0
					message = error.description.split(" - ")[1]
				else
					message = error.description
				@addErrorMessage("", message)
			else
				@addErrorMessage("", error[0])

`export default ValidationServerErrorHandler;`
