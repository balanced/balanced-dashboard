Balanced.AddCallbackModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/add_callback',

  formProperties: ['url'],


  open: function() {
    var callback = Balanced.Callback.create({
      uri: this.get('marketplace').get('callbacks_uri'),
      url: ''
    });
    this.set('model', callback)
    this.reset(callback);
    $('#add-callback').modal('show');
  },

  save: function() {
    var self = this;
    var callback = this.get('model');

    callback.one('didCreate', function() {
      self.get('marketplace').notifyPropertyChange('callbacks_uri');
      $('#add-callback').modal('hide');
    });
    callback.on('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    callback.create();
  }
});
