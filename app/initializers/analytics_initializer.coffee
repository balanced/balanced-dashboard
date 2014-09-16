`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger"`

AnalyticsInitializer =
  name: "analytics"
  initialize: ->
    AnalyticsLogger.init(ENV.BALANCED)

`export default AnalyticsInitializer`
