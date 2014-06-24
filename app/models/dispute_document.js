Balanced.DisputeDocument = Balanced.Model.extend({
	uri: '/dispute_documents',
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),
	isUploading: false,

	name: Ember.computed.readOnly('file_name'),
	size: Balanced.computed.transform('file_size', 'formatSize')
});

var ACCEPTED_MIME_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg"];
var MAX_FILE_SIZE_BYTES = 10485760;

// Copied from https://github.com/milanvrekic/JS-humanize/blob/master/humanize.js
function numberFormat(number, decimals, dec_point, thousands_sep) {
	// http://kevin.vanzonneveld.net
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var n = number,
		c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	var d = typeof dec_point === 'undefined' ? ',' : dec_point;
	var t = typeof thousands_sep === 'undefined' ? '.' : thousands_sep,
		s = n < 0 ? '-' : '';
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
		j = (j = i.length) > 3 ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

Balanced.DisputeDocument.reopenClass({
	formatSize: function(filesize) {
		if (filesize >= 1073741824) {
			return numberFormat(filesize / 1073741824, 2, '.', '') + ' gb';
		}
		if (filesize >= 1048576) {
			return numberFormat(filesize / 1048576, 2, '.', '') + ' mb';
		}
		if (filesize >= 1024) {
			return numberFormat(filesize / 1024, 0) + ' kb';
		}

		return numberFormat(filesize, 0) + ' bytes';
	},

	hasErrors: function(file) {
		if (file.size > MAX_FILE_SIZE_BYTES || ACCEPTED_MIME_TYPES.indexOf(file.type) < 0) {
			return true;
		}
		return false;
	}
});

Balanced.Adapter.registerHostForType(Balanced.DisputeDocument, 'http://localhost:3000');

Balanced.TypeMappings.addTypeMapping('dispute_documents', 'Balanced.DisputeDocument');
