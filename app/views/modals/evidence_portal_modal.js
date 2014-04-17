Balanced.EvidencePortalModalView = Balanced.ModalView.extend({
	templateName: 'modals/evidence_portal_modal',
	controllerEventName: 'openEvidencePortalModal',
	modalElement: '#evidence-portal',
	dispute: null,

	open: function(model) {
		return this._super(model || this.get('dispute'));
	}
});
