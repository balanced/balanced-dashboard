import Ember from "ember";
import ENV from "balanced-dashboard/config/environment";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";
import Auth from "balanced-dashboard/auth";
import Utils from "balanced-dashboard/lib/utils";
import ErrorsLogger from "balanced-dashboard/lib/errors-logger";
import DisputeDocument from "balanced-dashboard/models/dispute-document";

import ModalBaseView from "./modal-base";
import Full from "./mixins/full-modal-mixin";
import Form from "./mixins/form-modal-mixin";
import DisplayModelErrors from "./mixins/display-model-errors-modal-mixin";

var EvidencePortalModalView = ModalBaseView.extend(Full, Form, DisplayModelErrors, {
	templateName: 'modals/evidence-portal-modal',
	title: 'Provide dispute evidence',
	description: 'Balanced will invoice you immediately for the transaction amount and dispute fee. If the dispute is won, Balanced will credit back the transaction amount to your account.',
	elementId: 'evidence-portal',
	maxDocumentCount: 50,
	beforeSubmitText: 'You will not be able to add or modify files once you submit.',

	documents: Ember.computed.readOnly('model.documents'),
	documentsToUpload: function() {
		return [];
	}.property(), // Ember.computed.readOnly('model.documents_to_upload'),

	fileUploadText: function() {
		var message = '';
		var requirements = ['Tracking information for goods that are physically delivered, such as a FedEx/UPS tracking number',
			'Email exchanges between yourself and the customer where you remind them of the initial charge',
			'Order receipts emailed to the cardholder upon completion of the purchase process'
		];

		requirements.forEach(function(requirement) {
			message += '<li>%@</li>'.fmt(requirement);
		});

		message = '<p>The following types of documentation can help you win a dispute:</p><ul>%@</ul>'.fmt(message);

		return Utils.safeFormat(message).htmlSafe();
	}.property(),

	trackingCodeText: 'Balanced will generate a screenshot of the delivery information based on the tracking number provided.',

	noteText: 'Describe your attached documents. If a dispute was refunded, please provide the transaction ID for the refund.',

	validDocumentCount: function() {
		var documentsToUpload = this.get('documentsToUpload');
		if (!documentsToUpload) {
			return 0;
		}
		return documentsToUpload.filter(function(doc, index, arr) {
			return !(doc.get('isUploading') || doc.get('isError'));
		}).length || 0;
	}.property('model', 'documentsToUpload', 'documentsToUpload.@each'),

	isNoteEmpty: function() {
		return Ember.isEmpty(this.get('model.note'));
	}.property('model.note'),

	notificationCenter: function() {
		return this.get('controller.controllers.modal_notification_center');
	},

	addFiles: function(files) {
		var documentsToUpload = this.get('documentsToUpload');
		var errorCount = 0;

		_.each(files, function(file) {
			// Dont add documents we've already seen
			if (file.uuid) {
				return;
			}
			// To remember the documents
			file.uuid = _.uniqueId('DD');
			var documentHasErrors = DisputeDocument.hasErrors(file);

			if (documentHasErrors) {
				errorCount++;
			} else {
				var doc = DisputeDocument.create({
					file_name: file.name,
					file_size: file.size,
					uuid: file.uuid,
					file: file
				});
				documentsToUpload.pushObject(doc);
			}
		}, this);

		if (errorCount > 0) {
			var invalidFileMessage = (errorCount === 1) ? '%@ file is invalid. ' : '%@ files are invalid. ';
			invalidFileMessage = invalidFileMessage.fmt(errorCount) + 'Please only attach .pdf or .jpeg files less than 10 MB.';

			this.get('model').setProperties({
				displayErrorDescription: true,
				errorDescription: invalidFileMessage
			});

			this.notificationCenter().clearAlerts();
			this.notificationCenter().alertError(invalidFileMessage);

			this.trackCollectionEvent("EvidencePortal: Files upload failed (client)", {
				error: invalidFileMessage
			});
		} else {
			this.trackCollectionEvent("EvidencePortal: File added", {
				documentCount: this.get('documentsToUpload').length
			});
		}

		this.reposition();
	},

	uploadError: function(data, status, jqxhr) {
		this.get('model').setProperties({
			displayErrorDescription: true,
			errorDescription: data.responseJSON.message.htmlSafe()
		});

		this.notificationCenter().clearAlerts();
		this.notificationCenter().alertError(data.responseJSON.message.htmlSafe());

		this.trackCollectionEvent("EvidencePortal: File upload failed (server)", {
			error: data.responseJSON.message.htmlSafe()
		});

		ErrorsLogger.captureMessage("BalancedApp.EvidencePortalModalView#uploadError", {
			extra: {
				validationMessages: data.responseJSON.message
			}
		});
	},

	uploadSuccess: function(data, status, jqxhr) {
		this.trackCollectionEvent("EvidencePortal: Upload completed");

		this.get('model').reload();
		this.close();
	},

	uploadAlways: function(data, status, jqxhr) {

		var documents = this.get('documents');
		var doc = documents.findBy('uuid', data.files[0].uuid);
		if (!doc) {
			return;
		}

		doc.set('isUploading', false);
	},

	open: function(container) {
		this.trackCollectionEvent("EvidencePortal: Modal opened");
		return this._super(container);
	},

	close: function() {
		this.trackCollectionEvent("EvidencePortal: Modal closed");
		return this._super();
	},

	trackCollectionEvent: function(message, extra) {
		var attributes = {
			email: Auth.get('user.email_address')
		};
		_.extend(attributes, extra);
		AnalyticsLogger.trackEvent(message, attributes);
	},

	change: function(event) {
		this._super(event);
		this.send('fileSelectionChanged', this.$("#fileupload").get(0).files);
	},

	drop: function(event) {
		this._super(event);
		this.send('fileSelectionChanged', event.dataTransfer.files);
	},

	didInsertElement: function() {
		// Safari check
		if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
			$('#fileupload').removeAttr("multiple");
		}
	},

	actions: {
		fileSelectionChanged: function(droppedFiles) {
			var files = (droppedFiles) ? droppedFiles : this.$("#fileupload").get(0).files;
			this.addFiles(files);
		},

		remove: function(doc) {
			if (!doc) {
				return;
			}

			this.get('documentsToUpload').removeObject(doc);
			this.trackCollectionEvent("EvidencePortal: File removed", {
				document: doc
			});
		},

		reload: function() {
			this.get('documentsToUpload').reload();
		},

		save: function() {
			this.get('model').validate();
			if (this.get('model').get("isValid")) {
				var formData = new FormData();
				formData.append('note', this.get('model.note'));

				var tracking_number = this.get('model.tracking_number');
				if (tracking_number) {
					formData.append('tracking_number', tracking_number);
				}

				var marketplaceId = BalancedApp.currentMarketplace.get('id');
				var userMarketplace = Auth.get('user').user_marketplace_for_id(marketplaceId);
				var secret = userMarketplace.get('secret');
				var auth = Utils.encodeAuthorization(secret);

				var documentsToUpload = this.get('documentsToUpload');
				documentsToUpload.mapBy('file').forEach(function(file, index) {
					formData.append("documents[%@]".fmt(index), file);
				});
				$.ajax(ENV.BALANCED.JUSTITIA + this.get('model.dispute_uri'), {
					headers: {
						'Authorization': auth
					},
					type: 'post',
					data: formData,
					processData: false,
					contentType: false,
					success: _.bind(this.uploadSuccess, this),
					error: _.bind(this.uploadError, this),
					always: _.bind(this.uploadAlways, this)
				});
			} else {
				return Ember.RSVP.reject();
			}
		}
	}
});

EvidencePortalModalView.reopenClass({
	open: function(dispute) {
		return this.create({
			model: dispute
		});
	}
});

export default EvidencePortalModalView;
