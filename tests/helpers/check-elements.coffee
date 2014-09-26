text = (element) ->
	$.trim(element.text())

html = (element) ->
	$.trim(element.html())

Ember.Test.registerHelper "text", (app, selector) ->
	find(selector).text()

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
		equal(text(element), val, "Text for #{selector}")

Ember.Test.registerHelper 'checkElements', (app, hash) ->
	_.each hash, (value, selector) ->
		check(value, selector)

`export default {};`
