Balanced.Log = Balanced.Model.extend({
    logs: function() {
        return this.get('items');
    }.property('items')
});

Balanced.Log.reopenClass({
    constructUri: function(id) {
        if(id) {
            return '/v1/logs/' + id;
        } else {
            return '/v1/logs';
        }
    }
});

Balanced.TypeMappings.addTypeMapping('log', 'Balanced.Log');