var forEach = Ember.ArrayPolyfills.forEach;

function coerceId(id) {
	return id == null ? null : id+'';
}

Balanced.RawTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	}
});

DS.BalancedSerializer = DS.JsonApiSerializer.extend({

	normalizePayload: function(type, payload) {
		if(payload.marketplaces) {
			payload.marketplace_models = payload.marketplaces;
			delete payload.marketplaces;
		}
		if(payload.customers) {
			payload.customer_models = payload.customers;
			delete payload.customers;
		}
		if(payload.bank_accounts) {
			payload.bank_account_models = payload.bank_accounts;
			delete payload.bank_accounts;
		}
		return this._super(type, payload);
	}

});

Balanced.ApplicationAdapter = DS.JsonApiAdapter.extend({

	defaultSerializer: 'DS/balanced',
	host: 'https://api-pm.balancedpayments.com',

	headers: {
		'Accept': 'application/vnd.balancedpayments+json; version=1.1, */*; q=0.01'
	},

	buildURL: function(type, id) {
		if(type === 'bank_account_model') { type = 'bank_account'; }
		if(type === 'marketplace_model') { type = 'marketplaces'; }
		if(type === 'customer_model') { type = 'customers'; }
		return this._super(type, id);
	},

	ajax: function(url, type, hash) {
		hash = hash || {};
		hash.headers = hash.headers || {};

		var apiKey = Balanced.get('API_KEY');
		if(!!apiKey) {
			hash.headers.Authorization = Balanced.Utils.encodeAuthorization(apiKey);
		}
		return this._super(url, type, hash);
	}

});
