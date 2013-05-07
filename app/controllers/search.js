Balanced.SearchController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  search: '',

  minDate: null,
  maxDate: null,
  sortField: null,
  sortOrder: null,

  query: function() {
    var query = this.get('search');

    var marketplaceId = this.get('controllers').get('marketplace').get('id');

    if(marketplaceId === undefined) {
      // TODO - For testing only - TAKE THIS OUT BEFORE MERGING
      marketplaceId = 'TEST-MP5m04ORxNlNDm1bB7nkcgSY';
    }

    this.set('content', Balanced.SearchQuery.search(marketplaceId, query, this.get('minDate'), this.get('maxDate'), this.get('sortField'), this.get('sortOrder')));
  },

  changeDateFilter: function(minDate, maxDate) {
    this.set('minDate', minDate);
    this.set('maxDate', maxDate);
    this.query();
  },

  changeSortOrder: function(field, sortOrder) {
    this.set('sortField', field);
    this.set('sortOrder', sortOrder);
    this.query();
  },

  selectSearchResult: function(uri) {
    window.location.hash = "#" + Balanced.Utils.uriToDashboardFragment(uri);
  },

  totalTransactionsHeader: function() {
    if(this.get('content')) {
      return "Transactions (" + this.get('content').get('total_transactions') + ")";
    } else {
      return "Transactions (0)";
    }

  }.property('content.total_transactions'),

  totalFundingInstrumentsHeader: function() {
    if(this.get('content')) {
      return "Cards & Bank Accounts (" + this.get('content').get('total_funding_instruments') + ")";
    } else {
      return "Cards & Bank Accounts (0)";
    }

  }.property('content.total_funding_instruments'),
});
