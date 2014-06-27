Balanced.DisputeDocument = Balanced.Model.extend({
	uri: '/dispute_documents',
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),
	isUploading: false,
	file_size: Balanced.computed.transform('size', Balanced.Utils.formatFileSize)
});

Balanced.DisputeDocument.reopenClass({
	hasErrors: function(file) {
		if (file.size > Balanced.DISPUTE_DOCUMENTS.MAX_FILE_SIZE_BYTES || Balanced.DISPUTE_DOCUMENTS.ACCEPTED_MIME_TYPES.indexOf(file.type) < 0) {
			return true;
		}
		return false;
	}
});

Balanced.Adapter.registerHostForType(Balanced.DisputeDocument, ENV.BALANCED.JUSTITIA);

Balanced.TypeMappings.addTypeMapping('dispute_documents', 'Balanced.DisputeDocument');
