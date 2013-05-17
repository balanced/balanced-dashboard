Balanced.EditMarketplaceInfoModalView = Balanced.View.extend({
  templateName: 'modals/edit_marketplace_info',

  nameError: false,
  supportEmailAddressError: false,
  domainUrlError: false,
  supportPhoneNumberError: false,

  save: function() {
    var self = this;
    this.content.set('name', this.get('name.value'));
    this.content.set('support_email_address', this.get('support_email_address.value'));
    this.content.set('domain_url', this.get('domain_url.value'));
    this.content.set('support_phone_number', this.get('support_phone_number.value'));

    this.content.one('didUpdate', function() {
      $('#edit-marketplace-info').modal('hide');

      self.set('nameError', false);
      self.set('supportEmailAddressError', false);
      self.set('domainUrlError', false);
      self.set('supportPhoneNumberError', false);
    })
    this.content.on('becameInvalid', function(json) {
      var jsonObject = JSON.parse(json);
      self.set('nameError', jsonObject.description.indexOf("name") != -1);
      self.set('supportEmailAddressError', jsonObject.description.indexOf("support_email_address") != -1);
      self.set('domainUrlError', jsonObject.description.indexOf("domain_url") != -1);
      self.set('supportPhoneNumberError', jsonObject.description.indexOf("support_phone_number") != -1);
    });
    this.content.update();
  }
});
