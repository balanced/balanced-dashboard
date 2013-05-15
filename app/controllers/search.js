Balanced.SearchController = Balanced.ObjectController.extend({
    needs: ["marketplace"],

    search: '',
    latestRequestTimeStamp: null,

    minDate: null,
    maxDate: null,
    sortField: null,
    sortOrder: null,

    isLoading: false,

    getLabel: function (labelMapping, acceptedTypes, type) {
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

    query: function (callback) {
        ////
        // Helper function
        ////
        function getParamByName(uri, name) {
            name = name.replace(/[\[]/, "\\\\[").replace(/[\]]/, "\\\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(uri);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        var query = this.get('search');
        var marketplaceUri = this.get('controllers').get('marketplace').get('uri');

        if (!query.trim()) {
            return;
        }

        var _this = this;
        this.set('isLoading', true);

        ////
        // onSearch Callback
        ////
        var onceLoaded = function (search, property) {
            var requestTimeStamp = getParamByName(search.uri, "requestTimeStamp");

            ////
            // Debugging
            ////
            // console.log("SEARCH => " + getParamByName(search.uri, "q"));
            // console.log("LASTEST TIMESTAMP => " + _this.get('latestRequestTimeStamp'));
            // console.log("REQUEST TIMESTAMP => " + requestTimeStamp);

            if(+(requestTimeStamp) < +(_this.get('latestRequestTimeStamp'))) {
                ////
                // Debugging
                ////
                // console.log("DISCARDING - OLD REQUEST");
                // console.log("=====================================");

                return;
            }

            ////
            // Debugging
            ////
            // console.log("USING - LATEST REQUEST");
            // console.log("=====================================");

            _this.set('content', search);
            _this.set('isLoading', false);
            if (callback && 'function' === typeof callback) {
                callback();
            }
        };

        var requestTimeStamp = new Date().getTime();
        this.set('latestRequestTimeStamp', requestTimeStamp);

        var search = Balanced.SearchQuery.search(
            marketplaceUri,
            {
                query: query,
                minDate: this.get('minDate'),
                maxDate: this.get('maxDate'),
                sortField: this.get('sortField'),
                sortOrder: this.get('sortOrder'),
                type: this.get('type'),
                requestTimeStamp: requestTimeStamp
            },
            {
                observer: onceLoaded
            }
        );
    },

    changeDateFilter: function (minDate, maxDate) {
        this.set('minDate', minDate);
        this.set('maxDate', maxDate);
        this.query();
    },

    changeSortOrder: function (field, sortOrder) {
        this.set('sortField', field);
        this.set('sortOrder', sortOrder);
        this.query();
    },

    changeTypeFilter: function (type) {
        this.set('type', type || 'transactions');
    },

    selectSearchResult: function (uri) {
        window.location.hash = "#" + Balanced.Utils.uriToDashboardFragment(uri);
    },

    totalTransactionsHeader: function () {
        if (this.get('content')) {
            return "Transactions (" + this.get('content').get('total_transactions') + ")";
        } else {
            return "Transactions (0)";
        }

    }.property('content.total_transactions'),

    totalFundingInstrumentsHeader: function () {
        if (this.get('content')) {
            return "Cards & Bank Accounts (" + this.get('content').get('total_funding_instruments') + ")";
        } else {
            return "Cards & Bank Accounts (0)";
        }

    }.property('content.total_funding_instruments')
});
