var isTriggersSearchBoxClose = function(element) {
	var target = $(element);

	var isOutsideSearch = target.closest("#search").length === 0;
	var isInsideTable = true;
	return target.closest("body").length > 0 && (isOutsideSearch || isInsideTable);
};

Balanced.SearchView = Balanced.View.extend({
	templateName: 'search',

	overlayClass: 'overlaid',

	didInsertElement: function() {
		var self = this;

		$(document).on('click.balanced-click-outside', function(event) {
			if (isTriggersSearchBoxClose(event.target)) {
				self.get('controller').send('closeSearch');
			}
		});

		var iconSearch = this.$('.icon-search');

		this.$('#search').hover(function() {
			iconSearch.toggleClass('search-highlight');
		});

		this._super();
	},

	willDestroyElement: function() {
		$(document).off('click.balanced-click-outside');
		this._super();
	},

	showResultsOverlay: function() {
		$(document.body).addClass(this.overlayClass);
	},

	hideResultsOverlay: function() {
		$(document.body).removeClass(this.overlayClass);
	},

	_toggleDisplayResults: function() {
		if (this.get('controller.isResultsOpen')) {
			this.showResultsOverlay();
		} else {
			this.hideResultsOverlay();
		}
	}.observes("controller.isResultsOpen")
});


Balanced.SearchQueryInputView = Balanced.Forms.TextField.extend({
	attributeBindings: ['autocomplete'],

	keyUp: function(e) {
		// Hide search results on escape key
		if (e.keyCode === Balanced.KEYS.ESCAPE) {
			this.get('targetObject').send('closeSearch');
			this.$().blur();
			return;
		}
	},

	focusIn: function(e) {
		$('#search').addClass('focus');
		this.get('targetObject').send('openSearch');
	},

	focusOut: function(e) {
		$('#search').removeClass('focus');
	},
});
