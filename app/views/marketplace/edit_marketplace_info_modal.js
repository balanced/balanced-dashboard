Balanced.EditMarketplaceInfoModalView = Balanced.BaseFormView.extend({
  templateName: 'modals/edit_marketplace_info',

  formProperties: ['name', 'support_email_address', 'domain_url', 'support_phone_number'],

  open: function() {
    // operate on a copy so we don't mess up the original object
    var marketplace = Ember.copy(this.content, true);
    this.set('model', marketplace);
    this.reset(marketplace);
    $('#edit-marketplace-info').modal('show');
  },

  save: function() {
    var self = this;

    var marketplace = this.get('model');

    marketplace.one('didUpdate', function() {
      self.content.updateFromModel(marketplace);
      $('#edit-marketplace-info').modal('hide');
    });
    marketplace.one('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.highlightErrorsFromAPIResponse(jsonObject.description);
    });
    marketplace.update();
  }
});
