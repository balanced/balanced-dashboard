import { test, moduleFor } from 'ember-qunit';

moduleFor("view:detail-views/description-lists/titled-key-values-section", "View - TitledKeyValuesSection");

test("#getFieldValue", function() {
	var subject = this.subject({
		model: {
			created_at: moment('2011-04-01').startOf('day').toDate(),
			id: "GG123123123"
		}
	});
	deepEqual(subject.getFieldValue("created_at"), "Apr 1, 2011, 12:00 AM");
	deepEqual(subject.getFieldValue("id"), "GG123123123");
});
