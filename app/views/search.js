//  time in ms to throttle between key presses for search
Balanced.THROTTLE = 400;

Balanced.BaseSearchView = Balanced.View.extend({
    overlayClass: 'overlaid'
});

Balanced.SearchView = Balanced.BaseSearchView.extend({
    templateName: 'search',

    didInsertElement: function () {
        $(document).on('click.balanced-click-outside', $.proxy(this.clickOutsideSearchBox, this));

        this.get('controller').addObserver('content', this, this._highlightResults);
        this.get('controller').addObserver('displayResults', this, this._toggleDisplayResults);

        this.reset();
    },

    willDestroyElement: function() {
        this.get('controller').removeObserver('content', this, this._highlightResults);
        this.get('controller').removeObserver('displayResults', this, this._toggleDisplayResults);

        $(document).off('click.balanced-click-outside');
    },

    clickOutsideSearchBox: function (e) {
        var $target = $(e.target);
        // sometimes ember likes to remove nodes from the dom when you click on
        // them so the body check will make sure it's legit.
        if ($target.closest('#search').length === 0 && $target.closest('body').length > 0) {
            this.get('controller').send('closeSearch');
        }
    },

    reset: function () {
        $('#q').val('');
        this.hideResultsOverlay();

        this.get('filtersView').reset();

        this.get('transactionsView').reset();
        this.get('customersView').reset();
        this.get('fundingInstrumentsView').reset();

        this.get('controller').send('reset');
    },

    showResultsOverlay: function() {
        $('body').addClass(this.overlayClass);
    },

    hideResultsOverlay: function () {
        $('body').removeClass(this.overlayClass);
    },

    onChangeSearchType: function (e, searchType) {
        var $t = $(e.currentTarget);

        var typeToClass = {
            'transaction': 'transactions',
            'account': 'accounts',
            'funding_instrument': 'funding-instruments'
        };
        var typeToSelect = typeToClass[searchType] || searchType;

        $t.closest('nav').find(' > li').removeClass('selected');
        $t.closest('li').addClass('selected');

        this.get('controller').send('changeTypeFilter', searchType);
    },

    filterResultType: function (e, filter, label) {
        var $t = $(e.currentTarget);

        $t.parents('nav').find('li.selected').removeClass('selected');
        $t.parents('li.filter').addClass('selected');

        this.get('controller').send('changeTypeFilter', filter);
    },

    _toggleDisplayResults: function() {
        if(this.get('controller.displayResults')) {
            this.showResultsOverlay();
            this._highlightResults();
        } else {
            this.reset();
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

    keyUp: function(e) {
        // Hide search results on escape key
        if (e.keyCode === Balanced.KEYS.ESCAPE) {
            this.get('controller').send('closeSearch');
            return;
        }
    },

    focusIn: function (e) {
        $('#search').addClass('focus');
    },

    focusOut: function (e) {
        $('#search').removeClass('focus');
    },
});

Balanced.SearchTypeView = Balanced.BaseSearchView.extend({
    tagName: 'a',
    attributeBindings: ['href'],
    href: '#',

    click: function (e) {
        e.preventDefault();
        this.get('parentView').get('parentView').onChangeSearchType(e, this.searchType);
    }
});

Balanced.SearchFilterResultView = Balanced.BaseSearchView.extend({
    tagName: 'a',
    attributeBindings: ['href'],
    href: '#',

    click: function (e) {
        e.preventDefault();
        this.get('parentView').get('parentView').filterResultType(e, this.filter, this.label);
    }
});
