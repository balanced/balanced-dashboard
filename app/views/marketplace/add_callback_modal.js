Balanced.AddCallbackModalView = Balanced.View.extend({
  templateName: 'modals/add_callback',

  urlError: false,

  url: "",

  save: function() {
    var self = this;

    var callback = Balanced.Callback.create({
      uri: this.get('marketplace').get('callbacks_uri'),
      url: this.get('url.value')
    });

    callback.one('didCreate', function() {
      $('#add-callback').modal('hide');
      self.get('marketplace').get('callbacks').addObject(callback);
    });
    callback.on('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.set('urlError', jsonObject.description.indexOf("url") != -1);
    });
    callback.create();
  }
});
