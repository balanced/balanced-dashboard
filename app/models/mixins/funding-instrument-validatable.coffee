`import ValidationServerErrorHandler from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";`

FundingInstrumentValidatable = Ember.Mixin.create(
	tokenizeAndCreate: (customerId) ->
		@set('isSaving', true)

		tokenizationToPromise = (data) =>
			deferred = Ember.RSVP.defer()
			@getTokenizingObject().create data, (response) ->
				if response.errors
					deferred.reject(response)
				else
					deferred.resolve(response)
			return deferred.promise

		# Tokenize the bank account using the balanced.js library
		tokenizationToPromise(@getTokenizingData())
			.then (response) =>
				@constructor.fetch(@getTokenizingResponseHref(response))
			.then (object) =>
				object.set('links.customer', customerId)
				object.save()
			.then (fundingInstrument) =>
				@setProperties(
					isSaving: false
					isNew: false
					isLoaded: true
				)
				@updateFromModel(fundingInstrument)
				@trigger('didCreate')
				return @
			.catch (response) =>
				errorHandler = new ValidationServerErrorHandler(@, response)
				errorHandler.execute()
				@set("isSaving", false)
				@notifyPropertyChange("validationErrors")
				Ember.RSVP.reject(@)
)

`export default FundingInstrumentValidatable;`
