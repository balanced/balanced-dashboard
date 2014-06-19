Balanced.SearchBarView = Balanced.View.extend({
	layoutName: "search_bar_layout",

	overlayClass: 'overlaid',
	isHighlight: false,

	mouseEnter: function(evt) {
		this.set("isHighlight", true);
	},
	mouseLeave: function(evt) {
		this.set("isHighlight", false);
	},
});
