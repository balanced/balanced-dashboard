require('app/components/modal');

Balanced.ApiKeyDeleteModalComponent = Balanced.ModalComponent.extend({
    moreWarning: false,

    init: function() {
        var secret = this.get('key').secret;
        if(secret === this.get('marketplaceSecret')) {
            this.set('moreWarning', true);
        }
        this._super();
    },

    actions: {
        confirm: function() {
            this.sendAction('action', this.get('key'));
            this.hide();
        }
    }
});