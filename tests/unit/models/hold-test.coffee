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

test "#is_expired", ->
	s = Hold.create()

	date = "2015-01-01T00:46:21.554001Z"
	s.set("expires_at", date)
	deepEqual(s.get("is_expired"), true)

	date = "2025-01-01T00:46:21.554001Z"
	s.set("expires_at", date)
	deepEqual(s.get("is_expired"), false)

	date = new Date()
	date.setSeconds(date.getSeconds() - 1)
	s.set("expires_at_date", date)
	deepEqual(s.get("is_expired"), true)



test "#can_void_or_capture", ->
	s = Hold.create()
	t = (expected) ->
		deepEqual s.get("can_void_or_capture"), expected

	t true

	s.set "__json", status: "succeeded"
	t true

	s.set "is_expired", true
	t false

	s.set "voided_at", "Some value"
	t false

	s.set "debit", "Some value"
	t false
