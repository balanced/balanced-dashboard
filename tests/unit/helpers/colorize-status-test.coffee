`import colorizeStatus from "balanced-dashboard/helpers/colorize-status";`

module "Helper - colorize-status"

test "colorize-status", ->
  value = "200"
  rendered = colorizeStatus._rawFunction(value)
  equal(rendered.string, "<span class=\"status-ok\">200</span>")
