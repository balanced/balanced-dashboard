var CARD_HOLD_REGEX = /card_hold/g;

Balanced.DownloadModalView = Balanced.ModalView.extend({
	templateName: 'modals/download',
	noURI: false,
	type: 'transactions',
	controllerEventName: false,

	afterSave: function() {
		self.confirmDownload();
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
		this.get('controller').send('alert', {
			message: "We're processing your request. We will email you once the exported data is ready to view.",
			persists: false,
			type: 'success'
		});
	},

	actions: {
		open: function() {
			var download;

			if (this.get('noURI')) {
				download = Balanced.Download.create({
					email_address: null,
					type: this.type
				});
			} else {
				var uri = this.get('controller.results_uri') || this.getSearchUri();

				// HACK - download service doesn't support rev1 URIs, so convert them to rev0 URIs
				uri = '/v1' + uri;
				uri = uri.replace(CARD_HOLD_REGEX, 'hold');

				download = Balanced.Download.create({
					uri: uri,
					email_address: null,
					type: this.type
				});
			}

			this._super(download);
		}
	}
});

Balanced.InvoiceDownloadModalView = Balanced.DownloadModalView.extend({
	templateName: 'modals/invoices_download',
	type: 'invoices',
	noURI: true
});

Balanced.DisputeDownloadModalView = Balanced.DownloadModalView.extend({
	templateName: 'modals/disputes_download',
	type: 'disputes',
	noURI: true
});
