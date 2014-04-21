Balanced.DisputeDocument = Balanced.Model.extend({
	uri: '/dispute_documents',
	dispute: Balanced.Model.belongsTo('dispute', 'Balanced.Dispute'),
	isUploading: false,

	name: Ember.computed.readOnly('file_name'),
	size: Balanced.computed.transform('file_size', 'formatSize')
});

// Copied from https://github.com/milanvrekic/JS-humanize/blob/master/humanize.js
function number_format( number, decimals, dec_point, thousands_sep ) {
	// http://kevin.vanzonneveld.net
	// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
	// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

	var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
	var d = typeof dec_point === 'undefined' ? ',' : dec_point;
	var t = typeof thousands_sep === 'undefined' ? '.' : thousands_sep, s = n < 0 ? '-' : '';
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '', j = (j = i.length) > 3 ? j % 3 : 0;

	return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}

Balanced.DisputeDocument.reopenClass({
	formatSize: function(filesize) {
		if (filesize >= 1073741824) {
			filesize = number_format(filesize / 1073741824, 2, '.', '') + ' Gb';
		} else {
			if (filesize >= 1048576) {
				filesize = number_format(filesize / 1048576, 2, '.', '') + ' Mb';
			} else {
				if (filesize >= 1024) {
					filesize = number_format(filesize / 1024, 0) + ' Kb';
				} else {
					filesize = number_format(filesize, 0) + ' bytes';
				}
			}
		}

		return filesize;
	}
});

Balanced.Adapter.registerHostForType(Balanced.DisputeDocument, 'http://localhost:3000');

Balanced.TypeMappings.addTypeMapping('dispute_documents', 'Balanced.DisputeDocument');
