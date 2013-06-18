Balanced.MarketplaceInitialDepositController = Balanced.ObjectController.extend(
    {
        needs: ['marketplace'],
        isLoading: false,
        expirationError: false,
        loadingMessage: 'Verifying...',

        expirationMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

        expirationYears: function () {
            var start = new Date().getFullYear();
            var years = Ember.A();
            for (var i = 0; i < 10; i++) {
                years.push(start + i);
            }
            return years;
        }.property(),

        initialAmounts: [
            {amount: 10, formatted: '$10.00'},
            {amount: 25, formatted: '$25.00'},
            {amount: 50, formatted: '$50.00'},
            {amount: 100, formatted: '$100.00'}
        ],

        submit: function () {
            var model = this.get('content');
            this.set('expirationError', false);
            this.send('passAlertMessage');

            if (model.validate()) {
                this.set('isLoading', true);
                var cardData = this._extractCardPayload();
                balanced.card.create(cardData, $.proxy(this.onCardTokenized, this));
            }
        },

        onCardTokenized: function (response) {
            var self = this;
            switch (response.status) {
                case 400:
                    if (response.error.expiration) {
                        self.set('expirationError', true);
                    }
                    _.each(response.error, function (value, key) {
                        self.get('validationErrors').add(key, 'invalid', null, value);
                    });
                    self.set('isLoading', false);
                    break;
                case 402:
                    self.send('passAlertMessage', 'error',
                        'Sorry, there was an error tokenizing this card.');
                    self.set('isLoading', false);
                    break;
                case 201:
                    this.associateAndDebitCard(response.data);
                    break;
            }
        },

        onDebitFailed: function (unparsedJson) {
            this.set('isLoading', false);
            this.send('passAlertMessage', 'error',
                'Sorry, there was an error charging this card.');
        },

        associateAndDebitCard: function (card) {
            var cardAssociation = Balanced.Card.create({
                card_uri: card.uri
            }), debit = Balanced.Debit.create({
                amount: this.get('initial_amount') * 100
            });
            var proxy = $.proxy(this.onDebitFailed, this);
            cardAssociation.one('becameInvalid', proxy);
            cardAssociation.one('becameError', proxy);
            debit.one('becameInvalid', proxy);
            debit.one('becameError', proxy);
            this.send('onCardDebit', {
                debit: debit,
                card: cardAssociation
            });
        },

        _extractCardPayload: function () {
            var cardData = {
                card_number: this.get('card_number'),
                expiration_month: this.get('expiration_month'),
                expiration_year: this.get('expiration_year'),
                security_code: this.get('security_code')
            };
            return cardData;
        },

        skip: function () {
            this.send('onSkip');
        }
    }
);
