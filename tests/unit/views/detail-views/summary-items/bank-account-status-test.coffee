`import { test, moduleFor } from "ember-qunit";`

moduleFor("view:detail-views/summary-items/bank-account-status", "View - BankAccountStatusView")

test "#verificationRestartDate", ->
	s = this.subject()
	s.set("model", {
		verification: {
			updated_at: "2015-01-30T18:48:13.072962Z"
		}
	})
	deepEqual(s.get("verificationRestartDate"), new Date("2015-02-02T18:48:13.072Z"))

test "#description", ->
	s = this.subject()

	t = (statusValue, expectedText) ->
		s.set("model.status", statusValue)
		deepEqual(s.get("description"), expectedText)

	s.set "model",
		status: "--------"
		verification:
			updated_at: "2015-01-30T18:48:13.072962Z"

	t("xxxxx", null)
	t("pending", 'Two deposits have been made to your bank account. Confirm verification by entering the amounts.')
	t("unverified", "You may only credit to this bank account. You must verify this bank account to debit from it.")
	t("unverifiable", "You may only credit to this bank account. This bank account is unverifiable because it's not associated with a customer.")
	t("failed", "We could not verify your bank account. You may restart the verification process after Feb 2, 2015.")
