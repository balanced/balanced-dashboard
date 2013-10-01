Balanced.DownloadModalView = Balanced.View.extend({
	templateName: 'modals/download',

	actions: {
		open: function() {
			var uri = this.get('controller.results_uri') || this.getSearchUri();
			var download = Balanced.Download.create({
				uri: uri,
				email_address: null
			});
			this.set('model', download);

			this.$('.modal').modal({
				manager: this.$()
			});
		},

		save: function() {
			if (this.get('model.isSaving')) {
				return;
			}

			if (this.get('model.email_address')) {
				var self = this;
				this.get('model').save().then(function() {
					self.confirmDownload();
					$(".download-modal.in").modal('hide');
				});
			}
		},
	},

	getSearchUri: function() {
		return window.location.hash.substr(1);
	},

	confirmDownload: function() {
		this.get('controller').send('alert', {
			message: "We're processing your request. We will email you once the exported data is ready to view.",
			persists: false,
			type: "success"
		});
	}
});
