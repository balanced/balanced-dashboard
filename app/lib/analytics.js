window.mixpanel = window.mixpanel || [];
window._gaq = window._gaq || [];


Balanced.Analytics = (function () {
    var analytics = {};

    // This page will almost always be over https, so can just load this directly.
    $.getScript("https://cdn.mxpnl.com/libs/mixpanel-2.2.min.js", { cache: true });
    $.getScript("https://ssl.google-analytics.com/ga.js", { cache: true });

    mixpanel.push(['init', '991598fc644dd5d0894e6cb070154330']);

    _gaq.push(['_setAccount', 'UA-30733850-1']);
    _gaq.push(['_setDomainName', 'balancedpayments.com']);
    _gaq.push(['_trackPageview']);

    // filters any number that is in the form of a string and longer than 4 digits (bank codes, ccard numbers etc)
    analytics.filter = function filter (text) {
	if(typeof text == "string") {
	    return text.replace(/([0-9])[\s+\-]([0-9])/g, '$1$2').replace(/([0-9]*)([0-9]{4})/g, 'XX-HIDE-XX-$2');
	}
	var ret = {};
	for(var name in text) {
	    // fields to exclude
	    if( name == "security_code" ||
	        name == "password" ) continue;
	    ret[name] = filter(text[name]);
	}
	return ret;
    };


    analytics.trackPage = _.debounce(function(page) {
	_gaq.push(['_trackPageview', page+location.hash]);
	mixpanel.push(['track_pageview', page+location.hash]);
    }, 500);

    analytics.trackEvent = function(name, data) {
	data = filter(data);
	mixpanel.push(['track', name, data]);
    };


    analytics.trackAjax = function(data) {
	if(data.type == 'GET' || !data.data) return;
	var dat = JSON.parse(data.data);
	dat._type = data.type;
	dat = analytics.filter(dat);
	_gaq.push(['_trackEvent', 'dashboard', dat._type, data.url]);
	mixpanel.push(['track', dat._type, dat]);
    };

    analytics.trackLogin = function trackLogin (email) {
	// links the current id with this specific id
	mixpanel.push(['alias', email]);
    }



    ////////////////////////////////////
    // Bindings to events
    ////////////////////////////////////
    $(function() {
	Balanced.Auth.on('signInSuccess', _.debounce(function () {
	    var user = this.get('_session').get('user');
	    analytics.trackLogin(user.email_address);
	}, 450));
    });

    // can't find an good way to track all events in ember atm
    // hack to track all click events
    $(document).on('click', 'a,.btn,button', function () {
	var e = $(this);
	// trims text contained in element
	var tt = e.text().replace(/^\s*([\S\s]*?)\s*$/, '$1');
	var values = {};
	for(var a = 0; a < e[0].attributes.length; a++) {
	    values[e[0].attributes[a].nodeName] = e[0].attributes[a].nodeValue;
	}
	mixpanel.push(['track', 'Click '+tt, values]);
	_gaq.push(['_trackEvent', 'dashboard', 'Click '+tt]);
    });

    return analytics;

})();
