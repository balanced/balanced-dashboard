`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`

module('balanced-dashboard/utils/analytics_logger')

test "#flattenEventData", ->

	data = AnalyticsLogger.flattenEventData(
		serie: "Donkey Kong Country"
		games: ["Donkey Kong Country", "Donkey Kong Country 2: Diddy Kong's Quest"]
		form:
			name: "King K. Rool"
			email: "king@example.com"
			names:
				japan: "Kingu Kururu"
				french: "Roi K. Rool"
				dutch: "Koning Wreed"
				german: "King Kroko"


	)

	deepEqual(data,
		"serie": "Donkey Kong Country"
		"games.0": "Donkey Kong Country"
		"games.1": "Donkey Kong Country 2: Diddy Kong's Quest"
		"form.name": "King K. Rool"
		"form.email": "king@example.com"
		"form.names.japan": "Kingu Kururu"
		"form.names.french": "Roi K. Rool"
		"form.names.dutch": "Koning Wreed"
		"form.names.german": "King Kroko"
	)
