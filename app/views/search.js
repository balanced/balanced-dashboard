//  time in ms to throttle between key presses for search
Balanced.THROTTLE = 400;

Balanced.BaseSearchView = Balanced.View.extend({
    overlayClass: 'overlaid'
});

Balanced.SearchView = Balanced.BaseSearchView.extend({
    templateName: 'search',

    resultsClass: 'with-results',

    didInsertElement: function () {
        var self = this;
        $(document).on('click', $.proxy(this.clickOutsideSearchBox, this));

        this.get('controller').addObserver('content', function() {
            self.toggleResults();
            self._highlightResults();
        });

        this.get('controller').addObserver('displayResults', function() {
            if(!self.get('controller.displayResults')) {
                self.reset();
            }
        });

        this.reset();
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
        this.resetHeader();
        this.hideResults();
        this.get('controller').send('reset');
        this.get('dateTimePicker').resetDateTimePicker();
    },

    resetHeader: function () {
        this.resetSelectedTab();
        this.get('transactionsView').reset();
        this.get('customersView').reset();
        this.get('fundingInstrumentsView').reset();
        this.resetDateTimePicker();
    },

    resetSelectedTab: function() {
        $('#search nav > li').removeClass('selected');
        $('#search nav > li.transactions').addClass('selected');
        $('#search .items').removeClass('selected');
        $('#search .items.transactions').addClass('selected');
    },

    hideResults: function () {
        $('#search').removeClass(this.resultsClass);
        $('body').removeClass(this.overlayClass);
    },

    resetDateTimePicker: function () {
        var $dps = $('#search .dp'),
            $sets = $('#search .set-times li');

        $sets.removeClass('selected');
        $dps.val('');
        $('#search .timing > .dropdown-toggle > span').text('Any time');
    },

    onQueryChange: function (e) {
        var self = this;
        var query = $('#q').val();
        if (query.length === 0) {
            self.toggleResults();
            return;
        }

        //  HACK: how do we do this from the controller?
        if (query.indexOf('OHM') === 0 && query.length > 30) {
            this.get('controller').send('redirectToLog', query);
            return;
        }
    },

    onChangeSearchType: function (e, searchType) {
        var $t = $(e.currentTarget);

        ////
        // Don't re-run query if already on selected
        ////
        if ($t.closest('li').hasClass('selected')) {
            return;
        }

        var typeToClass = {
            'transaction': 'transactions',
            'account': 'accounts',
            'funding_instrument': 'funding-instruments'
        };
        var typeToSelect = typeToClass[searchType] || searchType;

        $t.closest('nav').find(' > li').removeClass('selected');
        $t.closest('li').addClass('selected');
        $('#search .items').removeClass('selected');
        $('#search .items.' + typeToSelect).addClass('selected');

        this.get('controller').send('changeTypeFilter', searchType);
    },

    filterResultType: function (e, filter, label) {
        var $t = $(e.currentTarget);

        $t.parents('nav').find('li.selected').removeClass('selected');
        $t.parents('li.filter').addClass('selected');

        ////
        // Switch to the correct items table
        ////
        if ($t.parents('nav li.filter').hasClass('transactions')) {
            $('#search .items').removeClass('selected');
            $('#search .items.transactions').addClass('selected');
        } else if ($t.parents('nav li.filter').hasClass('funding-instruments')) {
            $('#search .items').removeClass('selected');
            $('#search .items.funding-instruments').addClass('selected');
        }

        this.get('controller').send('changeTypeFilter', filter);
    },

    toggleResults: function () {
        var $q = $('#q');
        var $searchArea = $('#search');
        var $body = $('body');
        var fn = $q.val() ? $searchArea.addClass : $searchArea.removeClass;
        var bodyFn = $q.val() ? $body.addClass : $body.removeClass;

        fn.call($searchArea, this.resultsClass);
        bodyFn.call($body, this.overlayClass);
    },

    _highlightResults: function () {
        var query = $('#q').val();

        //  remove empty words
        $('#search .results tbody').highlightWords(query);
    }
});

Balanced.SearchQueryInputView = Balanced.Forms.TextField.extend({
    attributeBindings: ['autocomplete'],

    didInsertElement: function () {
        var self = this;
        self.keyUp = _.throttle(function (e) {
            var parentView = this.get('parentView');
            // Hide search results on escape key
            if (e.keyCode === Balanced.KEYS.ESCAPE) {
                this.get('controller').send('closeSearch');
                return;
            }

            parentView.onQueryChange(e);

        }, Balanced.THROTTLE);
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
        this.get('parentView').onChangeSearchType(e, this.searchType);
    }
});

Balanced.SearchFilterResultView = Balanced.BaseSearchView.extend({
    tagName: 'a',
    attributeBindings: ['href'],
    href: '#',

    click: function (e) {
        e.preventDefault();
        this.get('parentView').filterResultType(e, this.filter, this.label);
    }
});
