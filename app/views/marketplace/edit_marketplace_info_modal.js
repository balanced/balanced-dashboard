Balanced.EditMarketplaceInfoModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/edit_marketplace_info',

  formProperties: ['name', 'support_email_address', 'domain_url', 'support_phone_number'],

  open: function() {
    this.reset(this.content);
    $('#edit-marketplace-info').modal('show');
  },

  save: function() {
    var self = this;

    var clonedObj = Ember.copy(this.content, true);
    this.updateObjectFromFormFields(clonedObj);

    clonedObj.one('didUpdate', function() {
      self.content.updateFromModel(clonedObj);
      $('#edit-marketplace-info').modal('hide');
    });
    clonedObj.one('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    clonedObj.update();
  }
});
