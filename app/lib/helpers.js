(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

Balanced.Helpers = (function () {

    // example of how to parse and format iso8601 dates. will parse the
    // specified format and then attach the original unparsed date as a title
    // attribute. may not be needed since we don't render the time info on the
    // server.
    function parseDateTime() {
        var $t = $(this);
        var dt = $t.attr('datetime');
        var format = $t.data('format');
        if (!dt || dt.indexOf('T') === -1) {
            return;
        }
        var x = Date.parseISO8601(dt).strftime(format);
        if (x.toUpperCase().indexOf('UNDEFINED') === -1 && x.toUpperCase().indexOf('NAN') === -1) {
            $t.text(x);
            if (!$t.attr('title')) {
                $t.attr('title', dt);
            }
        }
    }

    return {
        init: function () {
            $('time[data-format]').each(parseDateTime);
        }
    };
})();
