module("TitledKeyValuesSectionView");

test("#getFieldValue", function(assert) {
	var subject = Balanced.TitledKeyValuesSectionView.create({
		model: {
			createdAt: moment('2011-04-01').startOf('day').toDate(),
			id: "GG123123123"
		}
	});
	assert.deepEqual(subject.getFieldValue("createdAt"), "April 1 2011, 12:00 AM");
	assert.deepEqual(subject.getFieldValue("id"), "GG123123123");
});
