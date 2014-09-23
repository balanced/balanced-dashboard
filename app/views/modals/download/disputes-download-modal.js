import DownloadModalView from "./download-modal";

var DisputesDownloadModalView = DownloadModalView.extend({
	templateName: 'modals/download/disputes-download',
	type: 'disputes',
	noURI: true
});

export default DisputesDownloadModalView;
