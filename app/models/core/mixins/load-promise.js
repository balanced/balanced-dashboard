import Ember from "ember";

var Evented = Ember.Evented, // ember-runtime/mixins/evented
	Deferred = Ember.DeferredMixin, // ember-runtime/mixins/evented
	run = Ember.run, // ember-metal/run-loop
	get = Ember.get, // ember-metal/accessors
	set = Ember.set;

var PENDING = void 0;
var SEALED = 0;
var FULFILLED = 1;
var REJECTED = 2;

var LoadPromise = Ember.Mixin.create(Evented, Deferred, {
	init: function() {
		this._super.apply(this, arguments);

		_.each(['didLoad', 'didCreate'], function(name) {
			this.one(name, this, function() {
				run(this, 'resolve', this);
			});
		}, this);

		_.each(['becameError', 'becameInvalid'], function(name) {
			this.one(name, this, function() {
				run(this, 'reject', this);
			});
		}, this);

		if (get(this, 'isLoaded')) {
			this.trigger('didLoad');
		}
	},

	resolveOn: function(successEvent) {
		var model = this;
		var deferred = Ember.RSVP.defer();

		function success(args) {
			resetEventHandlers();
			deferred.resolve(args || model);
		}

		function error(args) {
			resetEventHandlers();
			deferred.reject(args || model);
		}

		function resetEventHandlers() {
			_.each(['becameError', 'becameInvalid'], function(name) {
				this.off(name, error);
			}, model);

			_.each(['didLoad', 'didCreate'], function(name) {
				this.off(name, success);
			}, model);
		}

		model._resetPromise();
		model.one(successEvent, success);
		model.one('becameError', error);
		model.one('becameInvalid', error);

		return deferred.promise;
	},

	_resetPromise: function() {
		// once a promise is resolved it doesn't not seem possible to get it
		// to "reset". we emulate that capability here by creating a new
		// promise if it has already been rejected which can happen during
		// model object validation.
		var resolved = this.get('_deferred');

		// RSVP got rid of isRejected and uses _state to maintain a promise's state
		if (resolved && resolved.promise && resolved.promise._state === REJECTED) {
			set(this, '_deferred', Ember.RSVP.defer());
		}
	}
});

export default LoadPromise;
