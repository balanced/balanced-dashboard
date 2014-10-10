class BaseErrorHandler
	addErrorMessage: (key, message) ->
		@model.get("validationErrors").add(key, "serverError", null, message)

	clear: ->
		@model.get("validationErrors").clear()

`export default BaseErrorHandler;`
