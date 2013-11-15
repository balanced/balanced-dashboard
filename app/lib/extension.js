Balanced.Extension = Ember.Namespace.create({

	// cache extensions here
	_registered: Ember.A(),
	_active: Ember.A(),

	/**
		An extension must implement two methods: `init` and `destroy`.
		Ideally, calling destroy will revert the application into a
		state before init was called.

		@param {String} name
		@param {Object} hash
		@return this
	 */
	register: function(name, hash) {
		Ember.assert('Extension should be named', typeof name === 'string');
		Ember.assert('Balanced extension should implement "init" method', typeof hash.init === 'function');
		Ember.assert('Balanced extension should implement "destroy" method', typeof hash.destroy === 'function');

		hash._name = name;
		this._registered.pushObject(hash);
		return this;
	},

	/**
		Load an extension by name.

		@param {String} name
		@return this
	 */
	load: function(name) {
		var extension = this._registered.find(function(extension) {
			return extension._name === name;
		});

		Ember.assert('Extension is not already loaded', this._active.indexOf(extension) < 0);

		extension.init();
		this._active.pushObject(extension);
		this._rerender();
		return this;
	},

	/**
		Unload an extension, either by name, or by last one loaded.

		@param {String} [name]
		@return this
	 */
	unload: function(name) {
		var extension = name ? this._registered.find(function(extension) {
			return extension._name === name;
		}) : this._active.get('lastObject');

		Ember.assert('Extension you are trying to unload is not the last loaded extension', this._active.indexOf(extension) > 0);
		Ember.assert('Extension has been loaded', typeof extension === 'object');

		extension.destroy();
		this._active.popObject();
		this._rerender();
		return this;
	},

	/**
		Rerender the application view. This currently doesn't work right
		due to a bug in Ember: https://github.com/emberjs/ember.js/issues/2267

		@api private
	 */
	_rerender: function() {
		//Balanced.__container__.lookup('router:main')._activeViews.application[0].rerender();
	}

});
