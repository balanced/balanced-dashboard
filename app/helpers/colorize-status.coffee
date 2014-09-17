`import Ember from 'ember';`

colorizeStatus = (status) ->
	statusClass = if status.match(/2\d\d/) then 'ok' else 'error'
	string = '<span class="status-%@">%@</span>'.fmt(statusClass, status)
	return new Ember.Handlebars.SafeString(string)

`export default Ember.Handlebars.makeBoundHelper(colorizeStatus);`
