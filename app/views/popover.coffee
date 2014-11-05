`import Ember from "ember";`

PopoverView = Ember.View.extend
	tagName: 'a'
	attributeBindings: ['class', 'data-toggle', 'data-placement', 'data-original-title', 'data-content', 'data-html', 'data-trigger', 'data-template']
	'data-toggle': 'popover'
	selector: '[rel="popover"]'

	didInsertElement: ->
		@$().popover().parent().on 'click', '.close', (e) =>
    		$(e.target).parents(".popover").popover('hide')

		@_super()

`export default PopoverView;`
