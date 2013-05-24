Balanced.EditOwnerInfoModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/edit_owner_info',

  formProperties: ['name', 'email', 'phone'],

  open: function() {
    var customer = Ember.copy(this.content, true);
    this.set('model', customer);
    this.reset(customer);
    $('#edit-owner-info').modal('show');
  },

  save: function() {
    var self = this;

    var customer = this.get('model');

    customer.one('didUpdate', function() {
      self.content.updateFromModel(customer);
      $('#edit-owner-info').modal('hide');
    });
    customer.one('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject);
    });
    customer.update();
  }
});
