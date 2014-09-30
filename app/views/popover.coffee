`import Ember from "ember";`

PopoverView = Ember.View.extend
	tagName: 'a'
	attributeBindings: ['class', 'data-toggle', 'data-placement', 'data-original-title', 'data-content', 'data-html', 'data-trigger']
	'data-toggle': 'popover'

	didInsertElement: ->
		@$().popover()
		@_super()

`export default PopoverView;`
