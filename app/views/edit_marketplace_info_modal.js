Balanced.EditMarketplaceInfoModalView = Balanced.View.extend({
  templateName: 'modals/edit_marketplace_info',

  save: function() {
    this.content.set('name', this.get('name.value'));
    this.content.set('support_email_address', this.get('support_email_address.value'));
    this.content.set('domain_url', this.get('domain_url.value'));
    this.content.set('support_phone_number', this.get('support_phone_number.value'));

    this.content.one('didUpdate', function() {
      $('#edit-marketplace-info').modal('hide');
    })
    this.content.update(['name', 'support_email_address', 'domain_url', 'support_phone_number']);
  }
});
