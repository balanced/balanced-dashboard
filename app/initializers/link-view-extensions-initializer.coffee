`import Ember from "ember";`

Initializer =
  name: "LinkViewExtensions"
  initialize: ->
    Ember.LinkView.reopen(
      attributeBindings: ['data-track-event']
    )

`export default Initializer`
