Balanced.EvidencePortalModalView = Balanced.ModalView.extend({
	templateName: 'modals/evidence_portal_modal',
	controllerEventName: 'openEvidencePortalModal',
	modalElement: '#evidence-portal',

	dispute: null,

	maxDocumentCount: 50,

	documentCount: 1,
	documents: [],

	didInsertElement : function(){
		this._super();
		this.loadUploadScript();

		Ember.run.scheduleOnce('afterRender', this, this.bindUpload);
	},

	loadUploadScript: function() {
		if ($.fn.fileupload) {
			return;
		}

		var scripts = ['//cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.2/jquery.fileupload-jquery-ui.min.js', '//cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.2/jquery.iframe-transport.min.js', '//cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.5.2/jquery.fileupload.min.js'];

		return Ember.RSVP.all(scripts).then(_.bind(this.bindUpload, this), _.bind(this.loadUploadScript, this));
	},

	bindUpload: function() {
		if (!$.fn.fileupload) {
			this.loadUploadScript();
		}

		$('#fileupload').fileupload({
			url: this.get('model').get('dispute_documents_uri'),
			dataType: 'json',
			done: function (e, data) {
				console.log('done', e, data);
			}
		});
	},

	open: function(model) {
		return this._super(model || this.get('dispute'));
	},
});
