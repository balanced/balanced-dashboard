Balanced.SearchView = Balanced.View.extend({
    templateName: 'search',

    overlayClass: 'overlaid',

    didInsertElement: function () {
        $(document).on('click.balanced-click-outside', $.proxy(this.clickOutsideSearchBox, this));

        this.get('controller').addObserver('content', this, this._highlightResults);
        this.get('controller').addObserver('displayResults', this, this._toggleDisplayResults);
    },

    willDestroyElement: function () {
        this.get('controller').removeObserver('content', this, this._highlightResults);
        this.get('controller').removeObserver('displayResults', this, this._toggleDisplayResults);

        $(document).off('click.balanced-click-outside');
    },

    clickOutsideSearchBox: function (e) {
        if (this.get('controller.displayResults')) {
            var $target = $(e.target);
            // sometimes ember likes to remove nodes from the dom when you click on
            // them so the body check will make sure it's legit.
            if ($target.closest('#search').length === 0 && $target.closest('body').length > 0) {
                this.get('controller').send('closeSearch');
            }
        }
    },

    showResultsOverlay: function () {
        $('body').addClass(this.overlayClass);
    },

    hideResultsOverlay: function () {
        $('body').removeClass(this.overlayClass);
    },

    _toggleDisplayResults: function () {
        if (this.get('controller.displayResults')) {
            this.showResultsOverlay();
            this._highlightResults();
        } else {
            this.hideResultsOverlay();
        }
    },

    _highlightResults: function () {
        var query = $('#q').val();

        //  remove empty words
        $('#search .results tbody').highlightWords(query);
    }
});

Balanced.SearchQueryInputView = Balanced.Forms.TextField.extend({
    attributeBindings: ['autocomplete'],

    keyUp: function (e) {
        // Hide search results on escape key
        if (e.keyCode === Balanced.KEYS.ESCAPE) {
            this.get('controller').send('closeSearch');
            this.$().blur();
            return;
        }
    },

    focusIn: function (e) {
        $('#search').addClass('focus');
        this.get('controller').send('openSearch');
    },

    focusOut: function (e) {
        $('#search').removeClass('focus');
    },
});
