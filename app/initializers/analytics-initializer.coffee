`import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger"`

Initializer =
  name: "analytics"
  initialize: ->
    AnalyticsLogger.init(ENV.BALANCED)

`export default Initializer`
