module('Balanced.computed');

test('Balanced.computed.sum', function(assert) {
	var TestObject = Ember.Object.extend({
		part: Balanced.computed.sum('full', 'amount'),
	});

	var t = TestObject.create();
	assert.equal(t.get('part'), 0);

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
	assert.equal(t.get('part'), ARRAY_LENGTH * AMOUNT);

	t.get('full').pushObject(Credit.create());
	assert.equal(t.get('part'), (ARRAY_LENGTH + 1) * AMOUNT);

	t.get('full').pushObject(Credit.create({
		amount: 0
	}));
	assert.equal(t.get('part'), (ARRAY_LENGTH + 1) * AMOUNT);

	t = TestObject.create({
		full: {}
	});
	assert.equal(t.get('part'), 0);

	t = TestObject.create({
		full: []
	});
	assert.equal(t.get('part'), 0);

	t = TestObject.create({
		full: null
	});
	assert.equal(t.get('part'), 0);

	t = TestObject.create({
		full: true
	});
	assert.equal(t.get('part'), 0);
});

test('Balanced.computed.sumAll', function(assert) {
	var TestObject = Ember.Object.extend({
		total: Balanced.computed.sumAll('subtotal', 'tip', 'tax'),
	});

	var t = TestObject.create();
	assert.equal(t.get('total'), 0);

	Ember.run(function() {
		t.set('subtotal', 5);
	});
	assert.equal(t.get('total'), 5);

	Ember.run(function() {
		t.set('tax', 1);
	});
	assert.equal(t.get('total'), 6);

	Ember.run(function() {
		t.set('tip', 1);
	});
	assert.equal(t.get('total'), 7);

	t = TestObject.create({
		subtotal: 3,
		tip: 1,
		tax: 0.01
	});
	assert.equal(t.get('total'), 4.01);
});

test('Balanced.computed.slice', function(assert) {
	var TestObject = Ember.Object.extend({
		part: Balanced.computed.slice('full', 1),
		partWay: Balanced.computed.slice('full', 1, 3),
	});

	var t = TestObject.create();
	assert.equal(t.get('part').length, 0);
	assert.equal(t.get('partWay').length, 0);


	t = TestObject.create({
		full: [1, 2, 3, 4, 5]
	});
	assert.equal(t.get('part').length, 4);
	assert.equal(t.get('partWay').length, 2);
	assert.deepEqual(t.get('part'), [2, 3, 4, 5]);
	assert.deepEqual(t.get('partWay'), [2, 3]);
});

test('Balanced.computed.concat', function(assert) {
	var TestObject = Ember.Object.extend({
		flippedHref: Balanced.computed.concat('id', '/test/'),
		href: Balanced.computed.concat('id', '/test/', true)
	});

	var t = TestObject.create();
	assert.equal(t.get('href'), '/test/');
	assert.equal(t.get('flippedHref'), '/test/');

	t = TestObject.create({
		id: 1
	});
	assert.equal(t.get('href'), '/test/1');
	assert.equal(t.get('flippedHref'), '1/test/');

	Ember.run(function() {
		t.set('id', '8');
	});
	assert.equal(t.get('href'), '/test/8');
	assert.equal(t.get('flippedHref'), '8/test/');
});

test('Balanced.computed.fmt', function(assert) {
	var TestObject = Ember.Object.extend({
		starred: Balanced.computed.fmt('value', '** %@ **'),
		labeled: Balanced.computed.fmt('label', 'value', '%@: %@')
	});

	var t = TestObject.create({
		value: 'test'
	});
	assert.equal(t.get('starred'), '** test **', 'injects the value into the format-string');
	assert.equal(t.get('labeled'), ': test', 'injects single value into the format-string');

	t = TestObject.create({
		label: 'Name',
		value: 'Kaylee'
	});
	assert.equal(t.get('starred'), '** Kaylee **', 'injects the value into the format-string');
	assert.equal(t.get('labeled'), 'Name: Kaylee', 'injects multiple values into the format-string');

	Ember.run(function() {
		t.set('label', 'First Name');
	});

	assert.equal(t.get('labeled'), 'First Name: Kaylee', 'recomputes');

	t = TestObject.create();
	assert.equal(t.get('starred'), '**  **', 'injects empty string values into the format-string');
	assert.equal(t.get('labeled'), ': ', 'injects empty string values into the format-string');
});

test('Balanced.computed.orProperties', function(assert) {
	var TestObject = Ember.Object.extend({
		id: Balanced.computed.orProperties('id_1', 'id_2'),
	});

	var t = TestObject.create();
	assert.equal(t.get('id'), undefined);

	t = TestObject.create({
		id_2: 1
	});
	assert.equal(t.get('id'), 1);

	Ember.run(function() {
		t.set('id_1', '8');
	});
	assert.equal(t.get('id'), '8');

	Ember.run(function() {
		t.set('id_1', true);
	});
	assert.equal(t.get('id'), true);
});

test('Balanced.computed.transform', function(assert) {
	var TestObject = Ember.Object.extend({
		count: Balanced.computed.transform('length', 'plusOne'),
		plusOne: function(length) {
			return length + 1;
		}
	});

	var t = TestObject.create();
	assert.ok(_.isNaN(t.get('count')));

	t = TestObject.create({
		length: 1
	});
	assert.equal(t.get('count'), 2);

	Ember.run(function() {
		t.set('length', 0);
	});
	assert.equal(t.get('count'), 1);

	var TestObject2 = Ember.Object.extend({
		count: Balanced.computed.transform('length', 'plusOne'),
		plusOne: function(length) {
			assert.ok(this instanceof TestObject2);
			return length + 1;
		}
	});

	t = TestObject2.create({
		length: 1
	});
	assert.equal(t.get('count'), 2);
});

test('Balanced.computed.ifThisOrThat', function(assert) {
	var TestObject = Ember.Object.extend({
		text: Balanced.computed.ifThisOrThat('length', 'has some', 'has none'),
	});

	var t = TestObject.create();
	assert.equal(t.get('text'), 'has none');

	t = TestObject.create({
		length: 1
	});
	assert.equal(t.get('text'), 'has some');

	Ember.run(function() {
		t.set('length', false);
	});
	assert.equal(t.get('text'), 'has none');

	var TestObject = Ember.Object.extend({
		text: Balanced.computed.ifThisOrThat('length', 'has some', 'has none', true),
	});

	var t = TestObject.create();
	assert.equal(t.get('text'), 'has some');

	t = TestObject.create({
		length: 1
	});
	assert.equal(t.get('text'), 'has none');
});
