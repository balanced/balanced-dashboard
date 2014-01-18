// Ember port of https://github.com/jprichardson/node-batchflow
Balanced.BatchProcessor = Ember.Object.extend({
	results: [],

	limit: 1,
	finished: 0,

	length: function() {
		return this.collection.length;
	}.property("collection"),

	each: function(callback) {
		var self = this;
		this.eachCallback = function() {
			callback.apply(self, arguments);
		};
		return this;
	},

	parallel: function(limit) {
		// 2^53 is the largest integer
		this.set("limit", limit || Math.pow(2, 53));
		return this;
	},

	end: function(endCallback) {
		var self = this,
			running = 0,
			started = 0,
			total = this.collection.length;

		endCallback = endCallback || function() {};

		if (total === 0) {
			return endCallback(this.results);
		}

		function handleClientResult(result) {
			if (arguments.length) {
				self.results.pushObject(result);
			}
		}

		function fireNext(index, callback) {
			running += 1;
			started += 1;
			if (self.eachCallback) {
				self.eachCallback(index, self.collection[index], callback);
			}
		}

		function doneCallback(result) {
			setTimeout(function() {
				handleClientResult(result);
				running -= 1;
				self.set("finished", self.finished + 1);

				if (self.finished < total) {
					if (started < total && running < self.limit) {
						fireNext(started, doneCallback);
					}
				} else if (self.finished === total) {
					endCallback(self.results);
				}
			}, 0);
		}

		var max = self.limit > total ? total : self.limit;
		for (var i = 0; i < max; ++i) {
			fireNext(i, doneCallback);
		}

		return this;
	}

});
