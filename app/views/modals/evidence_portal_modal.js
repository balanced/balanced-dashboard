Balanced.EvidencePortalModalView = Balanced.ModalView.extend({
	templateName: 'modals/evidence_portal_modal',
	controllerEventName: 'openEvidencePortalModal',
	modalElement: '#evidence-portal',

	maxDocumentCount: 50,

	documentCount: Ember.computed.readOnly('model.documents.length'),
	documents: Ember.computed.readOnly('model.documents'),

	didInsertElement : function(){
		this._super();
		this.loadUploadScript();

		Ember.run.scheduleOnce('afterRender', this, this.bindUpload);
	},

	loadUploadScript: function() {
		if ($.fn.fileupload) {
			return;
		}

		var scripts = [
			'js/fileupload.js'
		];

		var exts = _.map(scripts, function(val) {
			return $.ajax({
				url: val,
				dataType: 'script',
				cache: true
			});
		});

		return Ember.RSVP.all(exts).then(_.bind(this.bindUpload, this), _.bind(this.loadUploadScript, this));
	},

	bindUpload: function() {
		if (!this.get('model.dispute_documents_uri')) {
			return;
		}

		if (!$.fn.fileupload) {
			this.loadUploadScript();
			return;
		}

		console.log('http://localhost:3000' + this.get('model.dispute_documents_uri'));
		$('#fileupload').fileupload({
			url: 'http://localhost:3000' + this.get('model.dispute_documents_uri'),
			autoUpload: true,
			done: _.bind(this.fileUploadDone, this),
			add: _.bind(this.fileUploadAdd, this),
			fail: _.bind(this.fileUploadFail, this),
			always: _.bind(this.fileUploadAlways, this)
		});
	}.observes('model'),

	fileUploadFail: function(e, data) {
		console.log('fail', e, data);

		var documents = this.get('model.documents');
		var doc = documents.findBy('uuid', data.files[0].uuid);
		documents.removeObject(doc);
	},

	fileUploadAdd: function(e, data) {
		console.log('add', e, data);
		var documents = this.get('model.documents');

		// To remember the documents
		data.files[0].uuid = _.uniqueId('DD');

		var doc = Balanced.DisputeDocument.create({
			file_name: data.files[0].name,
			file_size: data.files[0].size,
			isUploading: true,
			uuid: data.files[0].uuid
		});

		documents.pushObject(doc);
	},

	fileUploadDone: function(e, data) {
		console.log('done', e, data);
	},

	fileUploadAlways: function(e, data) {
		console.log('always', e, data);
		var documents = this.get('model.documents');
		var doc = documents.findBy('uuid', data.files[0].uuid);
		if (!doc) {
			return;
		}

		doc.set('isUploading', false);
	}
});
