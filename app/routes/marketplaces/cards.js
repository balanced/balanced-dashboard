Balanced.CardsCardRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/cards/" + params.card_id + "?embedded=1";
  }
});