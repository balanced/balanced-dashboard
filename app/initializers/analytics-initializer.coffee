`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";`
`import ENV from "balanced-dashboard/config/environment";`

Initializer =
  name: "analytics"
  initialize: ->
    AnalyticsLogger.init(ENV.BALANCED)

`export default Initializer`
