window.mixpanel = window.mixpanel || [];
window._gaq = window._gaq || [];


Balanced.Analytics = (function () {
    var analytics = {};

    // This page will almost always be over https, so can just load this directly.
    $.getScript("https://ssl.google-analytics.com/ga.js", { cache: true });

    // mixpanel init script as it did not want to load through jquery
    (function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);
b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);


    mixpanel.init('991598fc644dd5d0894e6cb070154330');

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
	mixpanel.track_pageview(page+location.hash);
    }, 500);

    analytics.trackEvent = function(name, data) {
	data = filter(data);
	mixpanel.track(name, data);
    };


    analytics.trackAjax = function(data) {
	if(data.type == 'GET' || !data.data) return;
	var dat = JSON.parse(data.data);
	dat._type = data.type;
	dat = analytics.filter(dat);
	_gaq.push(['_trackEvent', 'dashboard', dat._type, data.url]);
	mixpanel.track(dat._type, dat);
    };

    analytics.trackLogin = function trackLogin (email) {
	// links the current id with this specific id
	mixpanel.alias(email);
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
	mixpanel.track('Click '+tt, values);
	_gaq.push(['_trackEvent', 'dashboard', 'Click '+tt]);
    });

    return analytics;

})();
