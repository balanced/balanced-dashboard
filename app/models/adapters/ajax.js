Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
  get: function(uri, success) {
    var host = ENV.BALANCED.API;
    this.ajax(host + uri, "GET").then(function(json) {
      success(json);
    });
  },

  ajax: function(url, type, settings) {
    settings = settings || {};
    settings.url = url;
    settings.type = type;
    settings.context = this;
    return Balanced.Auth.send(settings);
  }
});
