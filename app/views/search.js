Balanced.SearchView = Balanced.View.extend({
	templateName: 'search',

	overlayClass: 'overlaid',

	didInsertElement: function() {
		$(document).on('click.balanced-click-outside', $.proxy(this.clickOutsideSearchBox, this));

		this.get('controller').addObserver('displayResults', this, this._toggleDisplayResults);
		this._super();
	},

	willDestroyElement: function() {
		this.get('controller').removeObserver('displayResults', this, this._toggleDisplayResults);

		$(document).off('click.balanced-click-outside');
		this._super();
	},

	clickOutsideSearchBox: function(e) {
		if (this.get('controller.displayResults')) {
			var $target = $(e.target);
			// sometimes ember likes to remove nodes from the dom when you click on
			// them so the body check will make sure it's legit.
			if ($target.closest('#search').length === 0 && $target.closest('body').length > 0) {
				this.get('controller').send('closeSearch');
			}
		}
	},

	showResultsOverlay: function() {
		$('body').addClass(this.overlayClass);
	},

	hideResultsOverlay: function() {
		$('body').removeClass(this.overlayClass);
	},

	_toggleDisplayResults: function() {
		if (this.get('controller.displayResults')) {
			this.showResultsOverlay();
		} else {
			this.hideResultsOverlay();
		}
	}
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
