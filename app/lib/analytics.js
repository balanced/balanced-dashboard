window.mixpanel = window.mixpanel || [];
window._gaq = window._gaq || [];

Balanced.Analytics = (function() {
	var isMixpanelLoaded = !Ember.isBlank(ENV.BALANCED.MIXPANEL);
	var isGoogleAnalyticsLoaded = !Ember.isBlank(ENV.BALANCED.GOOGLE_ANALYTICS);


	if (isGoogleAnalyticsLoaded) {
		// This page will almost always be over https, so can just load this directly.
		$.getScript('https://ssl.google-analytics.com/ga.js', {
			cache: true
		});
	}

	// links the current id with this specific id
	function trackLogin(email) {
		try {
			if (isMixpanelLoaded) {
				window.mixpanel.identify(email);
			}

			Raven.setUser({
				email: email
			});
		} catch (err) {}
	}

	return {
		init: function(settings) {

			if (isMixpanelLoaded) {
				window.mixpanel.init(settings.MIXPANEL);
			}

			if (isGoogleAnalyticsLoaded) {
				window._gaq.push(['_setAccount', settings.GOOGLE_ANALYTICS]);
				window._gaq.push(['_setDomainName', 'balancedpayments.com']);
				window._gaq.push(['_trackPageview']);
			}

			Balanced.Auth.on('signInSuccess', function() {
				Balanced.Analytics.trackEvent('login-success', {
					remembered: false
				});

				var user = Balanced.Auth.get('user');
				trackLogin(user.get('email_address'));
			});

			Balanced.Auth.on('signInError', function() {
				Balanced.Analytics.trackEvent('login-error');
			});

			$(document).bind("ajaxComplete", function(evt, jqxhr, ajaxOptions) {
				if (jqxhr && jqxhr.status >= 400) {
					Balanced.Analytics.trackEvent('ajax-error', {
						status: jqxhr.status,
						ajaxUrl: ajaxOptions.url,
						type: ajaxOptions.type,
						responseText: jqxhr.responseText
					});
				}
			});

			// HACK: can't find an good way to track all events in ember atm
			// to track all click events
			$(document).on('click', 'a,.btn,button', function() {
				var e = $(this);
				// trims text contained in element
				var tt = e.text().replace(/^\s*([\S\s]*?)\s*$/, '$1');
				var eventName = 'click ' + tt;

				Balanced.Analytics.trackEvent(eventName, {});
			});
		},
		trackPage: _.debounce(function(page) {
			var currentLocation = page + location.hash;

			if (isGoogleAnalyticsLoaded) {
				window._gaq.push(['_trackPageview', currentLocation]);
			}
			if (isMixpanelLoaded) {
				window.mixpanel.track_pageview(currentLocation);
			}
		}, 500),
		trackEvent: function(name, data) {
			data = data || {};

			if (Balanced.currentMarketplace) {
				data.marketplaceId = Balanced.currentMarketplace.get('id');
				data.marketplaceName = Balanced.currentMarketplace.get('name');
			}

			var filteredData = Balanced.Utils.filterSensitivePropertiesMap(data);
			if (isMixpanelLoaded) {
				window.mixpanel.track(name, filteredData);
			}

			if (isGoogleAnalyticsLoaded) {
				window._gaq.push(['_trackEvent', 'dashboard', name]);
			}
		}
	};

})();
