`import Ember from "ember";`
`import ENV from 'balanced-dashboard/config/environment';`
`import Utils from 'balanced-dashboard/lib/utils';`

window.mixpanel = window.mixpanel || []
window._gaq = window._gaq || []

isMixpanelLoaded = !Ember.isBlank(ENV.BALANCED.MIXPANEL)
isGoogleAnalyticsLoaded = !Ember.isBlank(ENV.BALANCED.GOOGLE_ANALYTICS)

if isGoogleAnalyticsLoaded
	# This page will almost always be over https, so can just load this directly.
	$.getScript('https://ssl.google-analytics.com/ga.js',
		cache: true
	)

trackPage = (page) ->
	currentLocation = page + window.location.hash

	if isGoogleAnalyticsLoaded
		window._gaq.push(['_trackPageview', currentLocation])

	if isMixpanelLoaded
		window.mixpanel.track_pageview(currentLocation)

AnalyticsLogger =
	init: ->
		if isMixpanelLoaded
			window.mixpanel.init(ENV.BALANCED.MIXPANEL)

		if isGoogleAnalyticsLoaded
			window._gaq.push(['_setAccount', ENV.BALANCED.GOOGLE_ANALYTICS])
			window._gaq.push(['_setDomainName', 'balancedpayments.com'])
			window._gaq.push(['_trackPageview'])

		$(document).bind "ajaxComplete", (evt, jqxhr, ajaxOptions) =>
			if jqxhr && jqxhr.status >= 400
				@trackEvent('ajax-error',
					status: jqxhr.status,
					ajaxUrl: ajaxOptions.url,
					type: ajaxOptions.type,
					responseText: jqxhr.responseText
				)

		$(document).on 'click', 'a,.btn,button', (event) =>
			target = $(event.target).closest("a, .btn, button")
			eventText = target.attr("data-track-event")
			if Ember.isBlank(eventText)
				eventText = "click #{$.trim target.text()}"
			@trackEvent(eventText, {})

	trackPage: _.debounce(trackPage, 500)

	identify: (user) ->
		userProperties =
			"$first_name": user.get("email_address")
			"$created": user.get("created_at")
			"$email": user.get("email_address")

		try
			Raven.setUser(email: user.get("email_address"))
			window.mixpanel.identify(user.get("id"))
			window.mixpanel.people.set(userProperties)
		catch error

	flattenEventData: (data) ->
		result = {}

		flattenObject = (object, prefix) ->
			for key, value of object
				switch Ember.typeOf(value)
					when "array"
						for arrayValue, index in value
							result["#{prefix}#{key}.#{index}"] = arrayValue
					when "object"
						flattenObject(value, "#{prefix}#{key}.")
					else
						result["#{prefix}#{key}"] = value
		flattenObject(data, "")
		result

	trackEvent: (name, data={}) ->
		if (window.BalancedApp && window.BalancedApp.currentMarketplace)
			mp = window.BalancedApp.currentMarketplace

		if mp
			data.marketplaceId = mp.get('id')
			data.marketplaceName = mp.get('name')
			data.createdAt = mp.get("created_at")

		filteredData = Utils.filterSensitivePropertiesMap(data)
		if isMixpanelLoaded
			window.mixpanel.track(name, filteredData)

		if isGoogleAnalyticsLoaded
			window._gaq.push(['_trackEvent', 'dashboard', name])

`export default AnalyticsLogger;`
