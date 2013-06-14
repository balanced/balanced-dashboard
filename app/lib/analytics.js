window.mixpanel = window.mixpanel || [];
window._gaq = window._gaq || [];


Balanced.Analytics = (function () {
    var analytics = {};
    var old_router;

    console.log("Analytics loaded");

    /*
    $.getScript("https://cdn.mxpnl.com/libs/mixpanel-2.2.min.js", { cache: true });
    $.getScript("https://ssl.google-analytics.com/ga.js", { cache: true });
    */

    mixpanel.push(['init', '991598fc644dd5d0894e6cb070154330']);

    _gaq.push(['_setAccount', 'UA-30733850-1']);
    _gaq.push(['_setDomainName', 'balancedpayments.com']);
    _gaq.push(['_trackPageview']);

    // filters any number that is in the form of a string and longer than 4 digits (bank codes, ccard numbers)
    analytics.filter = function filter (text) {
	if(typeof text == "string") {
	    return text.replace(/([0-9])\s+([0-9])/g, '$1$2').replace(/([0-9]*)([0-9]{4})/g, 'XX-HIDE-XX-$2');
	}
	var ret = {};
	for(var name in text) {
	    // fields to exclude
	    if(name == "security_code") continue;
	    ret[name] = filter(text[name]);
	}
	return ret;
    };


    analytics.trackPage = function trackPage(page) {
	console.log("tracking page view", page);
	_gaq.push(['_trackPageview', page]);
	mixpanel.push(['track_pageview', page]);
    };

    analytics.trackEvent = function trackEvent(name, data) {
	data = filter(data);
	//_gaq.push(['_trackEvent', data._type,
	mixpanel.push(['track', name, data]);
    };

    analytics.trackAjax = function trackAjax (data) {
	if(data.type == 'GET') return;
	var dat = JSON.parse(data);
	dat._type = data.type;
	dat = filter(dat);
	//_gaq.push(['_trackEvent', 'dashboard', dat._type, dat.url]);
	//mixpanel.push(['track',


    };

    return analytics;

})();


/* Notes:
   Balanced.Router.prototype.didTransition, to get all the route changes

*/
