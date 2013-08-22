Balanced.CardsController = Balanced.ObjectController.extend(
    Ember.Evented,
    Balanced.DownloadControllerMixin,
    Balanced.ResultsTable,
    Balanced.TransactionsTable,
    {
        needs: ['marketplace'],

        sortField: 'created_at',
        sortOrder: 'desc',

        baseClassSelector: "#card",

        results_base_uri: function () {
            return this.get('content.transactions_uri');
        }.property('content.transactions_uri'),

        openDebitFundingInstrumentModal: function () {
            this.trigger('openDebitFundingInstrumentModal');
        },

        openHoldCardModal: function () {
            this.trigger('openHoldCardModal');
        }
    }
);
