`import Ember from "ember";`

ModalsContainerView = Ember.ContainerView.extend
	didInsertElement: ->
		@get("controller").registerContainer(@)

`export default ModalsContainerView;`
