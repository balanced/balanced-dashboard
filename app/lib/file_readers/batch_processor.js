// Ember port of https://github.com/jprichardson/node-batchflow
Balanced.BatchProcessor = Ember.Object.extend({

	limit: 1,
	finished: 0,
	total: 0,
	eachCallback: undefined,

	errorCallback: function(err) {
		throw err;
	},

	each: function(callback) {
		var self = this;
		this.eachCallback = function() {
			try {
				callback.apply(self, arguments);
			} catch (err) {
				this.errorCallback(err);
			}
		};
		return this;
	},

	error: function(error) {
		this.error = error;
		return this;
	},


	parallel: function(limit) {
		this.limit = limit || Math.pow(2, 53); //2^53 is the largest integer
		return this;
	},

	sequential: function() {
		this.limit = 1;
		return this;
	},

	end: function(endCallback) {
		var self = this,
			collection = this.get("collection"),
			running = 0,
			started = 0,
			results = [];

		this.total = collection.length;
		endCallback = endCallback || function() {};

		if (this.total === 0) {
			return endCallback([]);
		}

		function handleClientResult(err, result) {
			self.finished += 1;
			if (err instanceof Error) {
				self.errorCallback(err);
			} else {
				result = err; //not an error, but the result
			}

			if (result) {
				results.push(result);
			}
		}

		function fireNext(idx, callback) {
			//after process.nextTick was added to doneCallback below in 0.3.2, this line might be able to be removed, tests pass with and without it
			//if (running + self.finished >= self.total) return //this is critical to fix a regression bug, fireNext may get fired more times than needed

			running += 1;
			started += 1;
			self.eachCallback(idx, collection[idx], callback);
		}

		function doneCallback(err, result) {
			setTimeout(function() {
				handleClientResult(err, result);
				running -= 1;

				if (self.finished < self.total) {
					if (started < self.total && running < self.limit) {
						fireNext(started, doneCallback);
					}
				} else if (self.finished === self.total) {
					endCallback(results);
				}
			}, 0);
		}

		var max = self.limit > self.total ? self.total : self.limit;
		for (var i = 0; i < max; ++i) {
			fireNext(i, doneCallback);
		}

		return this;
	}

});
