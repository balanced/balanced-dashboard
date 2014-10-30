import Model from "./core/model";
import LinkedModelArray from "./core/linked-model-array";
import Constants from "balanced-dashboard/utils/constants";

var DisputeDocument = Model.extend({
	dispute: Model.belongsTo('dispute', 'dispute'),
	isUploading: false
});

DisputeDocument.reopenClass({
	loadFromUri: function(uri) {
		return LinkedModelArray.newArrayLoadedFromUri(uri, this, "documents");
	},

	hasErrors: function(file) {
		if (file.size > Constants.DISPUTE_DOCUMENTS.MAX_FILE_SIZE_BYTES || Constants.DISPUTE_DOCUMENTS.ACCEPTED_MIME_TYPES.indexOf(file.type) < 0) {
			return true;
		}
		return false;
	}
});

export default DisputeDocument;
