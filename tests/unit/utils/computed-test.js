import Computed from "balanced-dashboard/utils/computed";

module('balanced-dashboard/utils/computed');

test('.sum', function() {
	var TestObject = Ember.Object.extend({
		part: Computed.sum('full', 'amount'),
	});

	var t = TestObject.create();
	equal(t.get('part'), 0);

	var ARRAY_LENGTH = 10,
		AMOUNT = 5;

	var Credit = Ember.Object.extend({
		amount: AMOUNT
	});

	var creditArr = [];
	for (var i = ARRAY_LENGTH; i > 0; i--) {
		creditArr.pushObject(Credit.create());
	}

	t = TestObject.create({
		full: creditArr
	});
	equal(t.get('part'), ARRAY_LENGTH * AMOUNT);

	t.get('full').pushObject(Credit.create());
	equal(t.get('part'), (ARRAY_LENGTH + 1) * AMOUNT);

	t.get('full').pushObject(Credit.create({
		amount: 0
	}));
	equal(t.get('part'), (ARRAY_LENGTH + 1) * AMOUNT);

	t = TestObject.create({
		full: {}
	});
	equal(t.get('part'), 0);

	t = TestObject.create({
		full: []
	});
	equal(t.get('part'), 0);

	t = TestObject.create({
		full: null
	});
	equal(t.get('part'), 0);

	t = TestObject.create({
		full: true
	});
	equal(t.get('part'), 0);
});

test('.sumAll', function() {
	var TestObject = Ember.Object.extend({
		total: Computed.sumAll('subtotal', 'tip', 'tax'),
	});

	var t = TestObject.create();
	equal(t.get('total'), 0);

	Ember.run(function() {
		t.set('subtotal', 5);
	});
	equal(t.get('total'), 5);

	Ember.run(function() {
		t.set('tax', 1);
	});
	equal(t.get('total'), 6);

	Ember.run(function() {
		t.set('tip', 1);
	});
	equal(t.get('total'), 7);

	t = TestObject.create({
		subtotal: 3,
		tip: 1,
		tax: 0.01
	});
	equal(t.get('total'), 4.01);
});

test('.slice', function() {
	var TestObject = Ember.Object.extend({
		part: Computed.slice('full', 1),
		partWay: Computed.slice('full', 1, 3),
	});

	var t = TestObject.create();
	equal(t.get('part').length, 0);
	equal(t.get('partWay').length, 0);


	t = TestObject.create({
		full: [1, 2, 3, 4, 5]
	});
	equal(t.get('part').length, 4);
	equal(t.get('partWay').length, 2);
	deepEqual(t.get('part'), [2, 3, 4, 5]);
	deepEqual(t.get('partWay'), [2, 3]);
});

test('.concat', function() {
	var TestObject = Ember.Object.extend({
		flippedHref: Computed.concat('id', '/test/'),
		href: Computed.concat('id', '/test/', true)
	});

	var t = TestObject.create();
	equal(t.get('href'), '/test/');
	equal(t.get('flippedHref'), '/test/');

	t = TestObject.create({
		id: 1
	});
	equal(t.get('href'), '/test/1');
	equal(t.get('flippedHref'), '1/test/');

	Ember.run(function() {
		t.set('id', '8');
	});
	equal(t.get('href'), '/test/8');
	equal(t.get('flippedHref'), '8/test/');
});

test('.fmt', function() {
	var TestObject = Ember.Object.extend({
		starred: Computed.fmt('value', '** %@ **'),
		labeled: Computed.fmt('label', 'value', '%@: %@')
	});

	var t = TestObject.create({
		value: 'test'
	});
	equal(t.get('starred'), '** test **', 'injects the value into the format-string');
	equal(t.get('labeled'), ': test', 'injects single value into the format-string');

	t = TestObject.create({
		label: 'Name',
		value: 'Kaylee'
	});
	equal(t.get('starred'), '** Kaylee **', 'injects the value into the format-string');
	equal(t.get('labeled'), 'Name: Kaylee', 'injects multiple values into the format-string');

	Ember.run(function() {
		t.set('label', 'First Name');
	});

	equal(t.get('labeled'), 'First Name: Kaylee', 'recomputes');

	t = TestObject.create();
	equal(t.get('starred'), '**  **', 'injects empty string values into the format-string');
	equal(t.get('labeled'), ': ', 'injects empty string values into the format-string');
});

test('.orProperties', function() {
	var TestObject = Ember.Object.extend({
		id: Computed.orProperties('id_1', 'id_2'),
	});

	var t = TestObject.create();
	equal(t.get('id'), undefined);

	t = TestObject.create({
		id_2: 1
	});
	equal(t.get('id'), 1);

	Ember.run(function() {
		t.set('id_1', '8');
	});
	equal(t.get('id'), '8');

	Ember.run(function() {
		t.set('id_1', true);
	});
	equal(t.get('id'), true);
});

test('.transform', function() {
	var TestObject = Ember.Object.extend({
		count: Computed.transform('length', 'plusOne'),
		plusOne: function(length) {
			return length + 1;
		}
	});

	var t = TestObject.create();
	ok(_.isNaN(t.get('count')));

	t = TestObject.create({
		length: 1
	});
	equal(t.get('count'), 2);

	Ember.run(function() {
		t.set('length', 0);
	});
	equal(t.get('count'), 1);

	var TestObject2 = Ember.Object.extend({
		count: Computed.transform('length', 'plusOne'),
		plusOne: function(length) {
			ok(this instanceof TestObject2);
			return length + 1;
		}
	});

	t = TestObject2.create({
		length: 1
	});
	equal(t.get('count'), 2);
});

test('.ifThisOrThat', function() {
	var TestObject = Ember.Object.extend({
		text: Computed.ifThisOrThat('length', 'has some', 'has none'),
	});

	var t = TestObject.create();
	equal(t.get('text'), 'has none');

	t = TestObject.create({
		length: 1
	});
	equal(t.get('text'), 'has some');

	Ember.run(function() {
		t.set('length', false);
	});
	equal(t.get('text'), 'has none');

	TestObject = Ember.Object.extend({
		text: Computed.ifThisOrThat('length', 'has some', 'has none', true),
	});

	t = TestObject.create();
	equal(t.get('text'), 'has some');

	t = TestObject.create({
		length: 1
	});
	equal(t.get('text'), 'has none');
});

test(".subtract", function() {
	var TestObject = Ember.Object.extend({
		difference: Computed.subtract('num1', 'num2'),
	});

	var t = TestObject.create({
		num1: 10,
		num2: 6
	});
	equal(t.get("difference"), 4);

	t = TestObject.create({
		num1: 6,
		num2: 10
	});
	equal(t.get("difference"), -4);
});
