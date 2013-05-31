// code in here is only used during the migration from the old to the new dashboard.


// http://stackoverflow.com/a/5908806/6084
// NB: this will not work between different domains, need to document in README
// that this requires running local example and hacking your hosts file
$('#migration-frame').each(function () {
    var $frame = $(this);
    var height = $frame[0].contentWindow.document.body.scrollHeight;
    $frame.attr('height', height);
});

// xdomain hack
if (document.domain.indexOf('balancedpayments.com') >= 0) {
    document.domain = 'balancedpayments.com';
}

Balanced.MigrationUtils = {
    EMBEDDED_QUERY_APPEND: "?embedded=1",

    convertApiUriIntoWebUri: function (apiUri) {
        // have to strip off the API version
        return ENV.BALANCED.WWW + apiUri.substring(3);
    },

    convertApiURIToIframeURI: function (apiUri) {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(apiUri) + '?embedded=1';
    }
};
