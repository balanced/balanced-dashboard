`import FixtureAdapter from "balanced-dashboard/adapters/fixture"`

adapter = FixtureAdapter.create()
adapter.asyncCallbacks = true

files = "registration dispute-documents disputes invoices marketplace marketplace-users user".split(" ")

for file in files
	fixtures = require("balanced-dashboard/tests/fixtures/#{file}").default
	adapter.addFixtures(fixtures)

`export default adapter`
