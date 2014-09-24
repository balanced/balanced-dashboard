module "helper - colorize-status"

test "colorize-status", ->
  value = "200"
  rendered = Ember.Handlebars.helpers.colorizeStatus._rawFunction(value)
  equal(rendered, "")
