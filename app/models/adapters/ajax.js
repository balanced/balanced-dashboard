Balanced.AjaxAdapter = Balanced.BaseAdapter.extend({
  initAdapter: function() {
    this.hostsByType = {};
  },

  get: function(type, uri, success) {
    var host = ENV.BALANCED.API;
    if(this.hostsByType[type]) {
      host = this.hostsByType[type];
    }
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
  },

  registerHostForType: function(type, host) {
    this.hostsByType[type] = host;
  }
});
