import ModalView from "../modal";
import Download from "balanced-dashboard/models/download";

var CARD_HOLD_REGEX = /card_hold/g;

var DownloadModalView = ModalView.extend({
	templateName: 'modals/download/download-modal',
	noURI: false,
	type: function() {
		var type = this.get("controller.type");
		return type === "dispute" ?
			"disputes" : "transactions";
	}.property("controller.type"),

	controllerEventName: false,

	afterSave: function() {
		this.confirmDownload();
	},

	beforeSave: function() {
		if (!this.get('model.email_address')) {
			return false;
		}
	},

	getSearchUri: function() {
		return window.location.hash.substr(1);
	},

	confirmDownload: function() {
		var message = "We're processing your request. We will email you once the exported data is ready to view.";
		this.get('controller.controllers.notification_center').alertSuccess(message);
	},

	actions: {
		open: function() {
			var download;
			var type = this.get("type");

			if (this.get('noURI')) {
				download = Download.create({
					email_address: null,
					type: type
				});
			} else {
				var uri = this.get('controller.results_uri') || this.getSearchUri();

				// HACK - download service doesn't support rev1 URIs, so convert them to rev0 URIs
				uri = '/v1' + uri;
				uri = uri.replace(CARD_HOLD_REGEX, 'hold');

				download = Download.create({
					uri: uri,
					email_address: null,
					type: type
				});
			}

			this._super(download);
		}
	}
});

export default DownloadModalView;
