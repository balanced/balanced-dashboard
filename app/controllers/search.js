Balanced.SearchController = Balanced.ObjectController.extend({
  needs: ["marketplace"],

  search: '',

  minDate: null,
  maxDate: null,
  sortField: null,
  sortOrder: null,

    getLabel: function(labelMapping, acceptedTypes, type) {
        var label = labelMapping[type];
        if (!label && acceptedTypes.indexOf(type) > -1) {
            label = type.substr(0, 1).toUpperCase() + type.substr(1) + 's';
        }
        return (label) ? label : labelMapping.DEFAULT;
    },

  type: 'transactions',
    transaction_type: function () {
        var types = ['debit', 'credit', 'hold', 'refund', 'transactions'];
        return types.indexOf(this.type) > -1 ? 'transactions' : null;
    }.property('content.type'),
    transaction_type_label: function () {
        var typesToLabels = {
            DEFAULT: 'Transactions'
        };
        var types = ['debit', 'credit', 'hold', 'refund'];
        return this.getLabel(typesToLabels, types, this.type);
    }.property('content.type'),

    funding_instrument_type_label: function () {
        var typesToLabels = {
            DEFAULT: 'Cards & Bank Accounts'
        };
        var types = ['bank_account', 'card'];
        return this.getLabel(typesToLabels, types, this.type);
    }.property('content.type'),

  query: function() {
    var query = this.get('search');

    var marketplaceUri = this.get('controllers').get('marketplace').get('uri');
      var search = Balanced.SearchQuery.search(
          marketplaceUri,
          query,
          this.get('minDate'),
          this.get('maxDate'),
          this.get('sortField'),
          this.get('sortOrder'),
          this.get('type')
      );
    this.set('content', search);
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

  changeTypeFilter: function(type) {
      this.set('type', type || 'transactions');
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

  }.property('content.total_funding_instruments')
});
