module("Balanced.BatchProcessor");

asyncTest("processing", 1, function(assert) {
	var processor = Balanced.BatchProcessor.create({
		collection: [10, 20, 30]
	});

	processor.parallel(10)
		.each(function(i, num, done) {
			done(i + num);
		})
		.end(function(results) {
			assert.deepEqual(processor.results, [10, 21, 32]);
			start();
		});
});
