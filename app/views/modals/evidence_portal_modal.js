Balanced.EvidencePortalModalView = Balanced.ModalView.extend({
	templateName: 'modals/evidence_portal_modal',
	controllerEventName: 'openEvidencePortalModal',
	modalElement: '#evidence-portal',
	dispute: null,

	didInsertElement: function() {
		console.log(this.get('controller'), this.get('target'), this.get('view'));
		this._super();
	},

	open: function(model) {
		return this._super(model || this.get('dispute'));
	}
});
