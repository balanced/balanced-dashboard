Balanced.DeleteMarketplaceModalView = Balanced.View.extend({
    templateName: 'modals/delete_marketplace',

    didInsertElement: function () {
        this.get('controller').on('openDeleteMarketplaceModal', this, this.open);
    },

    willDestroyElement: function () {
        this.get('controller').off('openDeleteMarketplaceModal', this, this.open);
    },

    open: function (marketplace) {
        //  let's construct a uri even tho that's a little horrid. the reason
        // for doing so is we generally (except for this single case), deal
        // with api based uris
        var user = Balanced.Auth.get('user');
        var uri = Balanced.Utils.combineUri(user.get('marketplaces_uri'), marketplace.get('id'));
        var self = this;
        var model = Balanced.UserMarketplace.create({
            uri: uri,
            isLoaded: true
        });
        this.set('model', model);
        $('#delete-marketplace').modal('show');
    },

    deleteMarketplace: function () {
        if (this.get('model.isSaving')) {
            return;
        }

        this.get('model').delete().then(function () {
            $('#delete-marketplace').modal('hide');

            var user = Balanced.Auth.get('user');
            user.reload();
        });
    }
});
