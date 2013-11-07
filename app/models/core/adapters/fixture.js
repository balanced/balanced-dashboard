Balanced.FixtureAdapter = Balanced.BaseAdapter.extend({
	// Set this to true for all callbacks to be executed in an async callback.
	// This is the preferred way to operate, since it will catch computed
	// property / async bugs.
	// Defaulting to false for now because all hell will break loose with the tests
	// otherwise. Brand new tests should set this to true like this:
	// Balanced.Adapter.asyncCallbacks = true;
	asyncCallbacks: false,

	initAdapter: function() {
		this.dataMap = {};

		this.fetches = [];
		this.creates = [];
		this.updates = [];
		this.deletes = [];
	},

	get: function(type, uri, success, error) {
		this._checkParams(type, uri);

		var json = this.dataMap[uri];

		if (!json) {
			Ember.Logger.warn("Couldn't retrieve fixture for [" + type + "].\n\tURI =>  " + uri);
		}
		this.fetches.push({
			type: type,
			uri: uri
		});

		// cloning in case people modify this later, don't want to screw up our fixtures!
		var clonedJson = this._cloneObject(json);

		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	create: function(type, uri, data, success, error) {
		this._checkParams(type, uri);

		this.creates.push({
			type: type,
			uri: uri,
			data: data
		});

		// cloning to prevent weird data errors
		var clonedJson = this._cloneObject(data);
		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	update: function(type, uri, data, success, error) {
		this._checkParams(type, uri);

		this.updates.push({
			type: type,
			uri: uri,
			data: data
		});

		// cloning to prevent weird data errors
		var clonedJson = this._cloneObject(data);
		this._executeCallback(function() {
			success(clonedJson);
		});
	},

	delete: function(type, uri, success, error) {
		this._checkParams(type, uri);

		this.deletes.push({
			type: type,
			uri: uri
		});

		this._executeCallback(function() {
			success();
		});
	},

	addFixture: function(json) {
		this.dataMap[json.href || json.uri] = json;
	},

	addFixtures: function(jsonArray) {
		_.each(jsonArray, _.bind(this.addFixture, this));
	},

	_executeCallback: function(callbackExecutionFunction) {
		if (this.asyncCallbacks) {
			setTimeout(function() {
				Ember.run(function() {
					callbackExecutionFunction();
				});
			});
		} else {
			callbackExecutionFunction();
		}
	},

	_cloneObject: function(obj) {
		if (obj !== undefined && obj !== null) {
			return JSON.parse(JSON.stringify(obj));
		} else {
			return obj;
		}
	}
});
