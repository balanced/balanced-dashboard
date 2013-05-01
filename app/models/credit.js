Balanced.Credit = Balanced.Transaction.extend({
    typeName: function() {
        return "Credit"
    }.property()
});

Balanced.Credit.sync = {
    find: function(id, load) {
        Balanced.BasicAdapter.ajax(ENV.BALANCED.API + id, "GET").then(function(json) {
            load(DS.process(Balanced.Credit.deserialize(json)));
        });
    }
};

Balanced.Credit.deserialize = function(json) {
    return Balanced.Transaction.deserialize(json);
};
