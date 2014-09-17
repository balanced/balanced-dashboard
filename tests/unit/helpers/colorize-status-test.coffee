test "colorize-status", ->
  value = "200"
  rendered = Ember.Handlebars.helpers.colorizeStatus._rawFunction(value)
  console.log(rendered)
  equal(rendered, "")
