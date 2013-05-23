Balanced.EditOwnerInfoModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/edit_owner_info',

  formProperties: ['name', 'email', 'address.address', 'address.postal_code', 'address.country', 'phone'],

  open: function() {
    this.reset(this.content);
    $('#edit-owner-info').modal('show');
  },

  save: function() {
    var self = this;

    var clonedObj = Ember.copy(this.content, true);
    if(!clonedObj.get('address')) {
      clonedObj.set('address', {});
    }
    this.updateObjectFromFormFields(clonedObj);

    clonedObj.one('didUpdate', function() {
      self.content.updateFromModel(clonedObj);
      $('#edit-owner-info').modal('hide');
    });
    clonedObj.one('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    clonedObj.update();
  }
});
