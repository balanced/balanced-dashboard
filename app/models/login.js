Balanced.Login = Balanced.Model.extend({
	uri: '/logins'
});

Balanced.Adapter.registerHostForType(Balanced.User, ENV.BALANCED.AUTH);
