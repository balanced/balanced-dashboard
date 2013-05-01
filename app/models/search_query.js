/*
 * This wraps the results of a search query. The ID is the URI that we used to make
 * the search.
 */
Balanced.SearchQuery = Balanced.Model.extend({
    uri: DS.attr('string'),
    total: DS.attr('number'),
    accounts: DS.hasMany('Balanced.Account'),
    transactions: DS.hasMany('Balanced.Transaction', {polymorphic: true})
});

Balanced.SearchQuery.sync = {
    find: function(id, load) {
        var uri = ENV.BALANCED.API + id;
        Balanced.BasicAdapter.ajax(uri, "GET").then(function(result) {
            if(result.uri !== id) {
                console.log("We were looking for URI " + id + " but found URI " + result.uri);
            }

            load(DS.process(Balanced.SearchQuery.deserialize(result)));
        });
    }
};

Balanced.SearchQuery.deserialize = function(json) {
    json.id = json.uri;

    json.accounts = _.chain(json.items)
        .filter(function(item) { return item._type === "account"; })
        .map(function(account) { return Balanced.Account.deserialize(account) })
        .value();

    json.transactions = _.chain(json.items)
        .filter(function(item) { return item._type === "credit" || item._type === "debit"; })
        .map(function(transaction) {
            switch(transaction._type) {
                case "credit":
                    return Balanced.Credit.deserialize(transaction);
                case "debit":
                    return Balanced.Debit.deserialize(transaction);
                default:
                    return Balanced.Transaction.deserialize(transaction);;
            }
        })
        .value();

    return json;
};
