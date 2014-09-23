import DownloadModalView from "./download-modal";

var InvoiceDownloadModalView = DownloadModalView.extend({
	templateName: 'modals/download/invoices-download-modal',
	type: 'invoices',
	noURI: true
});

export default InvoiceDownloadModalView;
