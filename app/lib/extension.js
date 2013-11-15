Balanced.Extension = Ember.Namespace.create({

	// cache extensions here
	_extensions: Ember.A(),

	/**
	  An extension must implement two methods: `init` and `destroy`.
	  Ideally, calling destroy will revert the application into a
	  state before init was called.

	  @param {String} [name]
	  @param {Object} hash
	  @return this
	 */
	register: function(name, hash) {
		if(typeof name === 'object') {
			name = undefined;
			hash = name;
		}

		Ember.assert('Balanced extension should implement "init" method', typeof hash.init === 'function');
		Ember.assert('Balanced extension should implement "destroy" method', typeof hash.destroy === 'function');

		hash._name = name;
		hash._loaded = false;
		_extensions.pushObject(hash);
		return this;
	},

	/**
	  Load an extension, either by name, or by first one that isn't loaded.

	  @param {String} [name]
	  @return this
	 */
	load: function(name) {
		var extension = name ? this._extensions.find(function(extension) {
			return extension._name === name;
		}) : this._extensions.filter(function(extension) {
			return extension._loaded === false;
		}).get('firstObject');

		Ember.assert('Extension is already loaded', extension._loaded === false);

		extension.init();
		extension._loaded = true;
		this._extensions = this._extensions.without(extension);
		this._extensions.unshiftObject(extension);
		this._rerender();
		return this;
	},

	/**
	  Unload an extension, either by name, or by last one loaded.

	  @param {String} [name]
	  @return this
	 */
	unload: function(name) {
		var extension = name ? this._extensions.find(function(extension) {
			return extension._name === name;
		}) : this._extensions.filter(function(extension) {
			return extension._loaded === true;
		}).get('firstObject');

		Ember.assert('Extension you are trying to unload is not the last loaded extension', this._extensions.indexOf(extension) > 0);
		Ember.assert('Extension is has not been loaded', extension._loaded === true);

		extension.destroy();
		extension._loaded = false;
		this._extensions = this._extensions.without(extension);
		this._extensions.pushObject(extension);
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
