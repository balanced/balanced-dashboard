`import Hold from "balanced-dashboard/models/hold";`

module('Model - Hold')

test "#status", ->
	s = Hold.create()
	t = (expected) ->
		deepEqual s.get("status"), expected

	t "created"

	s.set "__json", status: "failed"
	t "failed"

	s.set "is_expired", true
	t "expired"

	s.set "voided_at", "Some value"
	t "voided"

	s.set "debit", "Some value"
	t "captured"
