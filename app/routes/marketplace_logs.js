Balanced.LogsLogRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/logs/" + params.log_id + "?embedded=1";
  }
});