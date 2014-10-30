`import Ember from "ember";`
`import DisplayModelErrors from "balanced-dashboard/views/modals/mixins/display-model-errors-modal-mixin";`

FormModalMixin = Ember.Mixin.create DisplayModelErrors,
	layoutName: "modals/form-modal-layout"

`export default FormModalMixin;`
