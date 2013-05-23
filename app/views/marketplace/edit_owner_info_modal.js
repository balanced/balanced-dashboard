Balanced.EditOwnerInfoModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/edit_owner_info',

  formProperties: ['name', 'email', 'phone'],

  open: function() {
    this.reset(this.content);
    $('#edit-owner-info').modal('show');
  },

  save: function() {
    var self = this;

    var clonedObj = Ember.copy(this.content, true);
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
