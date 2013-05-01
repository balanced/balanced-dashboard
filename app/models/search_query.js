/*
 * This wraps the results of a search query.
 */
Balanced.SearchQuery = Balanced.Model.extend({
});

Balanced.SearchQuery.search = function(marketplaceId, query) {
    var uri = '/v1/marketplaces/' + marketplaceId + '/search?q=' + query + '&limit=10&offset=0';
    var searchResults = Balanced.SearchQuery.create({uri: uri});
    Balanced.Model.ajax(ENV.BALANCED.API + uri, "GET").then(function(json) {
        json.accounts = _.chain(json.items)
            .filter(function(item) { return item._type === "account"; })
            .map(function(account) { return Balanced.Account.create(account) })
            .value();

        json.transactions = _.chain(json.items)
            .filter(function(item) { return item._type === "credit" || item._type === "debit"; })
            .map(function(transaction) {
                switch(transaction._type) {
                    case "credit":
                        return Balanced.Credit.create(transaction);
                    case "debit":
                        return Balanced.Debit.create(transaction);
                    default:
                        return null;
                }
            })
            .value();

        searchResults.setProperties(json);
    });
    return searchResults;
};
