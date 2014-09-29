text = (element) ->
	$.trim(element.text())

html = (element) ->
	$.trim(element.html())

Ember.Test.registerHelper "matchesProperties", (app, result, expected) ->
	for key, value of expected
		equal(result[key], value, "result[#{key}] equals #{value}")

Ember.Test.registerHelper "checkValue", (app, selector, val, message) ->
	message ||= "Value for #{selector}"
	equal(find(selector).val(), val, message)

Ember.Test.registerHelper "checkText", (app, selector, val, message) ->
	message ||= "Text for #{selector}"
	equal($.trim(find(selector).text()), val, message)

Ember.Test.registerHelper "text", (app, selector) ->
	$.trim(find(selector).text()).replace(/\s+/gm, " ")

Ember.Test.registerHelper "checkPageType", (app, text) ->
	checkText "#content .page-type", text

Ember.Test.registerHelper "checkPageTitle", (app, text) ->
	checkText "#content h1.page-title", text

Ember.Test.registerHelper "check", (app, selector, val) ->
	element = $(selector)
	if _.isObject(val)
		if val.count
			equal(element.length, val.count, "Element exists #{selector}")
		if val.text
			equal(text(element), val, "Text for #{selector}")
		if val.html
			equal(html(selector), val, "Html for #{selector}")
		if val.classNames
			if !_.isArray(val.classNames)
				val.classNames = [val.classNames]
			_.each val.classNames, (key) ->
				ok(element.hasClass(key), selector + ' has class ' + key)
		if val.attr
			_.each val.attr, (attrVal, attrName) ->
				equal(element.prop(attrName), attrVal, "#{selector} has #{attrName}=#{attrVal}")
		if val.id
			equal(element.attr('id'), val.id, "#{selector} has id=#{val.id}")
		if val.hasText
			ok(text(element).length > 0, "#{selector} has text")
		if val.hasChildren
			ok(element.children().length > 0, "#{selector} has children elements")

	else if _.isNumber(val)
		equal(element.length, val, "Element exists #{selector} #{val} times")

	else if _.isString(val)
		checkText(selector, val)

Ember.Test.registerHelper 'checkElements', (app, hash) ->
	_.each hash, (value, selector) ->
		check(selector, value)

`export default {};`
