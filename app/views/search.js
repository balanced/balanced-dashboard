Balanced.SearchView = Balanced.View.extend({
  templateName: 'search',

  resultsClass: 'with-results',
  sorts: ['unsorted', 'ascending', 'descending'],

  // TODO - Do we need these here? Seems like they're mirroring the controller...
  sortOrder: null,

  didInsertElement: function() {
    $(document).on('click', $.proxy(this.shouldCloseSearch, this));
  },

  selectSearchResult: function(uri) {
    this.reset();
    this.get('controller').send('selectSearchResult', uri);
  },

  closeSearch: function() {
    this.reset();
  },

  shouldCloseSearch: function(e) {
    if ($(e.target).closest('#search').length === 0) {
      $('#search').removeClass(this.resultsClass);
    }
  },

  reset: function() {
    var $q = $('#q');
    var $searchArea = $('#search');
    $searchArea.removeClass(this.resultsClass);
    $q.val('').focus();
    this.resetSortOrder();
    this.resetDateTimePicker();
  },

  resetSortOrder: function() {
    this.sortOrder = null;
    var allSorts = $('#search .sortable');
    allSorts.removeClass(this.sorts.join(' '));
  },

  resetDateTimePicker: function() {
    var $dps = $('#search .dp'),
      $sets = $('#search .set-times li');

    $sets.removeClass('selected');
    $dps.val('');
    $('#search .timing > .dropdown-toggle > span').text('Any time');
  },

  onQueryChange: function(e) {
    this.toggleResults();

    //  TODO: this will need to happen after search results are updated
    this.highlightResults();
  },

  onSortChange: function(e, field) {
    var $t = $(e.currentTarget);
    var sequences = {};
    this.resetSortOrder();
    for (var i = 0; i < this.sorts.length; i++) {
      sequences[this.sorts[i]] = this.sorts[(i + 1) % this.sorts.length];
    }
    var currentSort = $t.data('direction') || 'unsorted';
    var nextSort = sequences[currentSort];
    $t.data('direction', nextSort).addClass(nextSort);
    this.sortOrder = field + '-' + nextSort;
  },

  onChangeSearchType: function(e, searchType) {
    var $t = $(e.currentTarget);
    $t.closest('nav').find(' > li').removeClass('selected');
    $t.closest('li').addClass('selected');
    $('#search .items').removeClass('selected');
    $('#search .items.' + searchType).addClass('selected');
  },

  filterResultType: function(e, filter, label) {
    var $t = $(e.currentTarget);
    var label = label || $t.text();
    $t.closest('ul').find('li').removeClass('selected').closest('.filter').find('> a').text(label);
    $t.closest('li').addClass('selected');
  },

  toggleResults: function() {
    var $q = $('#q');
    var $searchArea = $('#search');
    var fn = $q.val() ? $searchArea.addClass : $searchArea.removeClass;
    fn.call($searchArea, this.resultsClass);
  },

  highlightResults: function(query) {
    var query = $('#q').val();
    //  remove empty words
    $('#search .results tbody tr').highlightWords(query);
  }
});

Balanced.SearchQueryInputView = Ember.TextField.extend({
  focusIn: function(e) {
    $('#search').addClass('focus');
  },

  focusOut: function(e) {
    $('#search').removeClass('focus');
  },

  keyUp: function(e) {
    this.get('parentView').onQueryChange(e);
  },

  change: function(e) {
    this.get('parentView').onQueryChange(e);
  },

  click: function(e) {
    this.get('parentView').onQueryChange(e);
  }
});

Balanced.SearchSortableColumnHeaderView = Balanced.View.extend({
  tagName: 'th',

  click: function(e) {
    this.get('parentView').onSortChange(e, this.field);
  }
});

Balanced.SearchTypeView = Balanced.View.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#',

  click: function(e) {
    this.get('parentView').onChangeSearchType(e, this.searchType);
  }
});

Balanced.SearchFilterResultView = Balanced.View.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#',

  click: function(e) {
    this.get('parentView').filterResultType(e, this.filter, this.label);
  }
})