import Ember from "ember";

var SearchBarView = Ember.View.extend({
	layoutName: "search-bar-layout",

	overlayClass: 'overlaid',
	isHighlight: false,

	didInsertElement: function() {
		this._super();
		var self = this;
		this.$().on("click", ".results tbody a", function() {
			self.get("controller").send("closeSearch");
		});
	},

	mouseEnter: function(evt) {
		this.set("isHighlight", true);
	},
	mouseLeave: function(evt) {
		this.set("isHighlight", false);
	},
});

export default SearchBarView;
