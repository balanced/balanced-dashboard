`import ValidationServerErrorHandler from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";`

FundingInstrumentValidatable = Ember.Mixin.create(
	tokenizeAndCreate: (customerId) ->
		@set('isSaving', true)
		deferred = Ember.RSVP.defer()

		errorCreating = (error) =>
			errorMessage = "There was an error processing your bank account. #{Ember.get(err, 'errorDescription')}"
			@set("isSaving", false)
			@get("validationErrors").add("", "serverError", null, errorMessage)
			@notifyPropertyChange("validationErrors")
			deferred.reject(@)

		# Tokenize the bank account using the balanced.js library
		@getTokenizingObject().create @getTokenizingData(), (response) =>
			if response.errors
				errorHandler = new ValidationServerErrorHandler(@, response)
				errorHandler.execute()
				@set("isSaving", false)
				@notifyPropertyChange("validationErrors")
				deferred.reject(@)
			else
				@constructor.find(@getTokenizingResponseHref(response)).then (object) =>
					object.set('links.customer', customerId)
					object.save().then (account) =>
						@setProperties(
							isSaving: false
							isNew: false
							isLoaded: true
						)
						@updateFromModel(account)
						@trigger('didCreate')
						deferred.resolve(object)
				, errorCreating
		, errorCreating

		return deferred.promise
)

`export default FundingInstrumentValidatable;`
