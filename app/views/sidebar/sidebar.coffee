`import Ember from "ember";`

SidebarView = Ember.View.extend(
	templateName: "sidebar/sidebar"

	items: (->
		[]
	).property()

	dropdownDisplayLabel: (->
		if @get("marketplace")
			@get("marketplace.name")
		else
			"Marketplaces"
	).property("marketplace", "marketplace.name")
)

`export default SidebarView;`
