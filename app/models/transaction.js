Balanced.Transaction = Balanced.Model.extend({
    uri: DS.attr('string'),
    description: DS.attr('string'),
    amount: DS.attr('number'),

    web_uri: function() {
        return Balanced.MigrationUtils.convertApiUriIntoWebUri(this.get('uri'));
    }.property('uri'),

    embedded_iframe_url: function() {
        return this.get('web_uri') + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
    }.property('web_uri')
});

Balanced.Transaction.deserialize = function(json) {
    json.balancedId = json.id;
    json.id = json.uri;
    json.type = json._type;
    return json;
};
