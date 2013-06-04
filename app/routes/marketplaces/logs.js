Balanced.LogsLogRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + '/logs/' + params.log_id + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
  }
});
