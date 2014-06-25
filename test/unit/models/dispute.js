module('Balanced.Dispute');

test('#numberFormat', function(assert) {
	var filesize = [1073741824];
	assert.equal(numberFormat(filesize / 1073741824, 2, '.', ''), 1);
});
