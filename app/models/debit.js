Balanced.Debit = Balanced.Transaction.extend({
    typeName: function() {
        return "Debit"
    }.property()
});

Balanced.Debit.sync = {
    find: function(id, load) {
        Balanced.BasicAdapter.ajax(ENV.BALANCED.API + id, "GET").then(function(json) {
            load(DS.process(Balanced.Debit.deserialize(json)));
        });
    }
};

Balanced.Debit.deserialize = function(json) {
    return Balanced.Transaction.deserialize(json);
};
