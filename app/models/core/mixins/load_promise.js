var Evented = Ember.Evented, // ember-runtime/mixins/evented
	Deferred = Ember.DeferredMixin, // ember-runtime/mixins/evented
	run = Ember.run, // ember-metal/run-loop
	get = Ember.get, // ember-metal/accessors
	set = Ember.set;

var LoadPromise = Ember.Mixin.create(Evented, Deferred, {
	init: function() {
		this._super.apply(this, arguments);

		this.one('didLoad', this, function() {
			run(this, 'resolve', this);
		});

		this.one('didCreate', this, function() {
			run(this, 'resolve', this);
		});

		this.one('becameError', this, function() {
			run(this, 'reject', this);
		});

		this.one('becameInvalid', this, function() {
			run(this, 'reject', this);
		});

		if (get(this, 'isLoaded')) {
			this.trigger('didLoad');
		}
	},

	resolveOn: function(successEvent) {
		var model = this;
		var deferred = Ember.Deferred.create();

		function success() {
			model.off('becameError', error);
			model.off('becameInvalid', error);
			deferred.resolve(model);
		}

		function error() {
			model.off(successEvent, success);
			deferred.reject(model);
		}

		model._resetPromise();
		model.one(successEvent, success);
		model.one('becameError', error);
		model.one('becameInvalid', error);

		return deferred;
	},

	_resetPromise: function() {
		// once a promise is resolved it doesn't not seem possible to get it
		// to "reset". we emulate that capability here by creating a new
		// promise if it has already been rejected which can happen during
		// model object validation.
		var resolved = this.get('_deferred');
		if (resolved && resolved.promise && resolved.promise.isRejected) {
			set(this, '_deferred', Ember.RSVP.defer());
		}
	}
});

Balanced.LoadPromise = LoadPromise;
