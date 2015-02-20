`import Base from "./base-status";`
`import Utils from "balanced-dashboard/lib/utils";`

BankAccountStatus = Base.extend(
	description: Ember.computed("model.status", "verificationRestartDate", ->
		switch @get("model.status")
			when "pending"
				'Two deposits have been made to your bank account. Confirm verification by entering the amounts.'
			when "unverified"
				'You may only credit to this bank account. You must verify this bank account to debit from it.'
			when "unverifiable"
				 'You may only credit to this bank account. This bank account is unverifiable because it\'s not associated with a customer.'
			when "failed"
				date = Utils.humanReadableDate @get('verificationRestartDate')
				"We could not verify your bank account. You may restart the verification process after #{date}."
			else
				null
	)

	verificationRestartDate: Ember.computed "model.verification.updated_at", ->
		updatedAtDate = @get("model.verification.updated_at")
		moment(new Date(updatedAtDate)).add(3, "days").toDate()

	buttonModalArgument: Ember.computed.reads("model")
	buttonModal: Ember.computed "model.status", ->
		switch @get("model.status")
			when "unverified"
				@get("container").lookupFactory("view:modals/verify-bank-account-modal")
			when "failed"
				if new Date() > @get("verificationRestartDate")
					@get("container").lookupFactory("view:modals/verify-bank-account-modal")
			when "pending"
				@get("container").lookupFactory("view:modals/bank-account-verification-confirm-modal")

	buttonModalText: Ember.computed "model.status", ->
		status = @get('model.status')
		if ["failed", "unverified", "pending"].contains(status)
			return "Verify"
)

`export default BankAccountStatus;`
