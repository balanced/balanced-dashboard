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