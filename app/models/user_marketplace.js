Balanced.UserMarketplace = Balanced.Model.extend({
	production: function () {
		return this.get('uri').indexOf('TEST') === -1;
	}.property('uri'),

	marketplace: function() {
		return Balanced.Marketplace.find(this.get('uri'));
	}.property('uri')
});

Balanced.TypeMappings.addTypeMapping('user_marketplace', 'Balanced.UserMarketplace');
