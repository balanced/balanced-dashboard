`import ENV from 'balanced-dashboard/config/environment';`
`import Auth from 'balanced-dashboard/auth';`

window.mixpanel = window.mixpanel || []
window._gaq = window._gaq || []

isMixpanelLoaded = !Ember.isBlank(ENV.BALANCED.MIXPANEL)
isGoogleAnalyticsLoaded = !Ember.isBlank(ENV.BALANCED.GOOGLE_ANALYTICS)

if isGoogleAnalyticsLoaded
	# This page will almost always be over https, so can just load this directly.
	$.getScript('https://ssl.google-analytics.com/ga.js',
		cache: true
	)

trackLogin = (email) ->
	try
		if isMixpanelLoaded
			window.mixpanel.identify(email)

		Raven.setUser(email: email)
	catch err

trackPage = (page) ->
	currentLocation = page + window.location.hash

	if isGoogleAnalyticsLoaded
		window._gaq.push(['_trackPageview', currentLocation])

	if isMixpanelLoaded
		window.mixpanel.track_pageview(currentLocation)

AnalyticsLogger =
	init: ->
		if isMixpanelLoaded
			window.mixpanel.init(settings.MIXPANEL)

		if isGoogleAnalyticsLoaded
			window._gaq.push(['_setAccount', settings.GOOGLE_ANALYTICS])
			window._gaq.push(['_setDomainName', 'balancedpayments.com'])
			window._gaq.push(['_trackPageview'])

		Auth.on 'signInSuccess', =>
			@trackEvent('login-success', remembered: false)
			user = Auth.get('user')
			trackLogin(user.get('email_address'))

		Auth.on 'signInError', =>
			@trackEvent('login-error')

		$(document).bind "ajaxComplete", (evt, jqxhr, ajaxOptions) =>
			if jqxhr && jqxhr.status >= 400
				@trackEvent('ajax-error',
					status: jqxhr.status,
					ajaxUrl: ajaxOptions.url,
					type: ajaxOptions.type,
					responseText: jqxhr.responseText
				)

		$(document).on 'click', 'a,.btn,button', =>
			@trackEvent("click #{$.trim $(this).text()}", {})

	trackPage: _.debounce(trackPage, 500)

	trackEvent: (name, data={}) ->
		mp = Balanced.currentMarketplace
		if mp
			data.marketplaceId = mp.get('id')
			data.marketplaceName = mp.get('name')

		filteredData = Balanced.Utils.filterSensitivePropertiesMap(data)
		if isMixpanelLoaded
			window.mixpanel.track(name, filteredData)

		if isGoogleAnalyticsLoaded
			window._gaq.push(['_trackEvent', 'dashboard', name])

`export default AnalyticsLogger;`
