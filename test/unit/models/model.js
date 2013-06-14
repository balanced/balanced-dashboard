module('Balanced.Model', {
    setup: function () {
        Balanced.TestModel = Balanced.Model.extend({
            basic_field: 1,
            derived_field: function () {
                return this.get('basic_field') + 1;
            }.property('basic_field')
        });

        Balanced.Adapter.addFixtures([
            {
                uri: '/v1/testobjects/1',
                basic_field: 123
            }
        ]);

        Balanced.TestFirstChildModel = Balanced.TestModel.extend({
            child_class_field: function() {
                return "first";
            }.property()
        });

        Balanced.TestSecondChildModel = Balanced.TestModel.extend({
            child_class_field: function() {
                return "second";
            }.property()
        });

        Balanced.TypeMappings.addTypeMapping('first', 'Balanced.TestFirstChildModel');
        Balanced.TypeMappings.addTypeMapping('second', 'Balanced.TestSecondChildModel');
    },

    teardown: function () {
    }
});

test('model computes embedded properties correctly', function (assert) {
    var t = Balanced.TestModel.create();
    assert.equal(t.get('basic_field'), 1);
    assert.equal(t.get('derived_field'), 2);

    t.set('basic_field', 5);
    assert.equal(t.get('basic_field'), 5);
    assert.equal(t.get('derived_field'), 6);
});

test("created models don't share state", function (assert) {
    var t = Balanced.TestModel.create();
    t.set('basic_field', 5);
    assert.equal(t.get('basic_field'), 5);
    assert.equal(t.get('derived_field'), 6);

    var s = Balanced.TestModel.create();
    s.set('basic_field', 123);
    assert.equal(s.get('basic_field'), 123);
    assert.equal(s.get('derived_field'), 124);
    assert.equal(t.get('basic_field'), 5);
    assert.equal(t.get('derived_field'), 6);
});

test('belongsTo associations work', function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
    });

    var t = TestModel2.create();

    assert.equal(t.get('my_belongs_to_field').get('basic_field'), 123);
    assert.equal(t.get('my_belongs_to_field.basic_field'), 123);

    assert.equal(t.get('my_belongs_to_field').get('derived_field'), 124);
    assert.equal(t.get('my_belongs_to_field.derived_field'), 124);
});

test("belongsTo associations don't share state", function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_other_uri_field: '/v1/testobjects/2',
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field'),
        my_other_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_other_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/2',
            basic_field: 42
        }
    ]);

    var t = TestModel2.create();

    assert.equal(t.get('my_belongs_to_field.basic_field'), 123);
    assert.equal(t.get('my_belongs_to_field.derived_field'), 124);
    assert.equal(t.get('my_other_belongs_to_field.basic_field'), 42);
    assert.equal(t.get('my_other_belongs_to_field.derived_field'), 43);

    t.get('my_belongs_to_field').set('basic_field', 8);
    t.get('my_other_belongs_to_field').set('basic_field', 23);

    assert.equal(t.get('my_belongs_to_field.basic_field'), 8);
    assert.equal(t.get('my_belongs_to_field.derived_field'), 9);
    assert.equal(t.get('my_other_belongs_to_field.basic_field'), 23);
    assert.equal(t.get('my_other_belongs_to_field.derived_field'), 24);
});

test('Embedded belongsTo associations work', function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_embedded_field', {embedded: true})
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testmodel2s/2',
            my_embedded_field: {
                basic_field: 234
            }
        }
    ]);

    var t = TestModel2.find('/v1/testmodel2s/2');

    assert.equal(t.get('my_belongs_to_field').get('basic_field'), 234);
    assert.equal(t.get('my_belongs_to_field.basic_field'), 234);

    assert.equal(t.get('my_belongs_to_field').get('derived_field'), 235);
    assert.equal(t.get('my_belongs_to_field.derived_field'), 235);
});

test('hasMany associations work', function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/1',
            items: [
                {
                    basic_field: 123
                },
                {
                    basic_field: 234
                }
            ]
        }
    ]);

    var t = TestModel2.create();

    assert.equal(t.get('my_has_many_field').get('length'), 2);
    assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
    assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("hasMany associations don't share state", function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_other_uri_field: '/v1/testobjects/2',
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field'),
        my_other_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_other_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/1',
            items: [
                {
                    basic_field: 123
                },
                {
                    basic_field: 234
                }
            ]
        },
        {
            uri: '/v1/testobjects/2',
            items: [
                {
                    basic_field: 1
                },
                {
                    basic_field: 2
                },
                {
                    basic_field: 3
                },
                {
                    basic_field: 4
                }
            ]
        }
    ]);

    var t = TestModel2.create();

    assert.equal(t.get('my_has_many_field').get('length'), 2);
    assert.equal(t.get('my_other_has_many_field').get('length'), 4);
    assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
    assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
    assert.equal(t.get('my_other_has_many_field').objectAt(0).get('derived_field'), 2);
    assert.equal(t.get('my_other_has_many_field').objectAt(1).get('derived_field'), 3);
    assert.equal(t.get('my_other_has_many_field').objectAt(2).get('derived_field'), 4);
    assert.equal(t.get('my_other_has_many_field').objectAt(3).get('derived_field'), 5);
});

test('Embedded hasMany associations work', function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_embedded_field', {embedded: true})
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testmodel2s/2',
            my_embedded_field: [
                {
                    basic_field: 123
                },
                {
                    basic_field: 234
                }
            ]
        }
    ]);

    var t = TestModel2.find('/v1/testmodel2s/2');

    assert.equal(t.get('my_has_many_field').get('length'), 2);
    assert.equal(t.get('my_has_many_field').objectAt(0).get('derived_field'), 124);
    assert.equal(t.get('my_has_many_field').objectAt(1).get('derived_field'), 235);
});

test("belongsTo returns an object even if the property hasn't been set yet", function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: null,
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field'),
        my_embedded_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
    });

    var t = TestModel2.create();
    assert.equal(t.get('my_belongs_to_field').get('basic_field'), 1);
    assert.equal(t.get('my_embedded_belongs_to_field').get('basic_field'), 1);
});

test("hasMany returns an object even if the property hasn't been set yet", function (assert) {
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: null,
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field'),
        my_embedded_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    var t = TestModel2.create();
    assert.ok(Ember.isArray(t.get('my_has_many_field')));
    assert.ok(Ember.isArray(t.get('my_embedded_has_many_field')));
    assert.equal(t.get('my_has_many_field').get('length'), 0);
    assert.equal(t.get('my_embedded_has_many_field').get('length'), 0);
});

test("models have promises that resolve when they're loaded", function (assert) {
    Ember.run(function () {
        Balanced.TestModel.find('/v1/testobjects/1').then(function (testModel) {
            assert.equal(testModel.get('basic_field'), 123);
        });
    });
});

test('models promises resolve async', function (assert) {
    expect(1);

    var t = Balanced.TestModel.create();
    Ember.run(function () {
        t.then(function (testModel) {
            assert.equal(testModel.get('basic_field'), 123);
        });

        t._updateFromJson({
            uri: '/v1/testobjects/1',
            basic_field: 123
        });
        t.trigger('didLoad');
    });
});

test("belongsTo associations have promises that resolve when they're loaded", function (assert) {
    expect(1);

    var TestModel2 = Balanced.Model.extend({
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testmodel2s/2',
            my_uri_field: '/v1/testobjects/1'
        },
        {
            uri: '/v1/testobjects/1',
            basic_field: 123
        }
    ]);

    Ember.run(function () {
        var t = TestModel2.find('/v1/testmodel2s/2').then(function (testModel2) {
            return testModel2.get('my_belongs_to_field');
        }).then(function (belongsToModel) {
            assert.equal(belongsToModel.get('basic_field'), 123);
        });
    });
});

test('belongsTo association promises resolve async', function (assert) {
    expect(1);

    var TestModel2 = Balanced.Model.extend({
        my_belongs_to_field: Balanced.Model.belongsTo('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/1',
            basic_field: 123
        }
    ]);

    var t = TestModel2.create();
    Ember.run(function () {
        t.then(function (testModel2) {
            return testModel2.get('my_belongs_to_field');
        }).then(function (belongsToModel) {
            assert.equal(belongsToModel.get('basic_field'), 123);
        });

        t.set('my_uri_field', '/v1/testobjects/1');
        t.trigger('didLoad');
    });
});

test("hasMany associations have promises that resolve when they're loaded", function (assert) {
    expect(2);

    var TestModel2 = Balanced.Model.extend({
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testmodel2s/2',
            my_uri_field: '/v1/testobjects/1'
        },
        {
            uri: '/v1/testobjects/1',
            items: [
                {
                    basic_field: 123
                },
                {
                    basic_field: 234
                }
            ]
        }
    ]);

    Ember.run(function () {
        var t = TestModel2.find('/v1/testmodel2s/2').then(function (testModel2) {
            return testModel2.get('my_has_many_field');
        }).then(function (hasManyArray) {
            assert.equal(hasManyArray.objectAt(0).get('basic_field'), 123);
            assert.equal(hasManyArray.objectAt(1).get('basic_field'), 234);
        });
    });
});

test('hasMany association promises resolve async', function (assert) {
    expect(4);

    var TestModel2 = Balanced.Model.extend({
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testmodel2s/2',
            my_uri_field: '/v1/testobjects/1hasManyResolveAsync'
        }
    ]);

    var t = TestModel2.find('/v1/testmodel2s/2');
    Ember.run(function () {
        t.then(function (testModel2) {
            return testModel2.get('my_has_many_field');
        }).then(function (hasManyArray) {
            assert.ok(Ember.isArray(hasManyArray));
            assert.equal(hasManyArray.get('length'), 2);
            assert.equal(hasManyArray.objectAt(0).get('basic_field'), 123);
            assert.equal(hasManyArray.objectAt(1).get('basic_field'), 234);
        });

        t.get('my_has_many_field').addObject(Balanced.TestModel.create({basic_field: 123}));
        t.get('my_has_many_field').addObject(Balanced.TestModel.create({basic_field: 234}));
        t.get('my_has_many_field').trigger('didLoad');
    });
});

test('models have promises for create', function (assert) {
    expect(1);
    var t = Balanced.TestModel.create();
    Ember.run(function () {
        t.create().then(function (model) {
            assert.ok(true);
        });
    });
});

test('create promises work if the model was previously invalid', function (assert) {
    expect(1);
    var t = Balanced.TestModel.create();

    t._handleError({status: 400, responseText: 'Something bad'});

    Ember.run(function () {
        t.create().then(function (model) {
            assert.ok(true);
        });
    });
});

test('models have promises for update', function (assert) {
    expect(1);
    var t = Balanced.TestModel.find('/v1/testobjects/1');
    Ember.run(function () {
        t.update().then(function (model) {
            assert.ok(true);
        });
    });
});

test('models have promises for delete', function (assert) {
    expect(1);
    var t = Balanced.TestModel.find('/v1/testobjects/1');
    Ember.run(function () {
        t.delete().then(function (model) {
            assert.ok(true);
        });
    });
});

test('models have promises for refresh', function (assert) {
    expect(1);
    var t = Balanced.TestModel.find('/v1/testobjects/1');
    Ember.run(function () {
        t.refresh().then(function (model) {
            assert.ok(true);
        });
    });
});

test('hasMany creates correct types for polymorphic associations', function(assert) {
    expect(3);
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/10'
        },
        {
            uri: '/v1/testobjects/1',
            items: [
                {
                    basic_field: 123,
                    _type: 'first'
                },
                {
                    basic_field: 234,
                    _type: 'second'
                }
            ]
        }
    ]);

    Ember.run(function () {
        TestModel2.find('/v1/testobjects/10').then(function(testModel) {
            return testModel.get('my_has_many_field');
        }).then(function(hasManyArray) {
            assert.equal(hasManyArray.get('length'), 2);
            assert.equal(hasManyArray.objectAt(0).get('child_class_field'), 'first');
            assert.equal(hasManyArray.objectAt(1).get('child_class_field'), 'second');
        });
    });
});

test('belongsTo creates correct types for embedded polymorphic associations', function(assert) {
    expect(2);

    var TestModel2 = Balanced.Model.extend({
        my_belongs_to_field1: Balanced.Model.belongsTo('Balanced.TestModel', 'my_first_obj', {embedded: true}),
        my_belongs_to_field2: Balanced.Model.belongsTo('Balanced.TestModel', 'my_second_obj', {embedded: true})
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/0',
            my_first_obj: {
                uri: '/v1/testobjects/1',
                basic_field: 123,
                _type: 'first'
            },
            my_second_obj: {
                uri: '/v1/testobjects/2',
                basic_field: 123,
                _type: 'second'
            }
        }
    ]);

    var t = TestModel2.find('/v1/testobjects/0');

    Ember.run(function () {
        TestModel2.find('/v1/testobjects/0').then(function(testModel) {
            return testModel.get('my_belongs_to_field1');
        }).then(function(belongsToField) {
            assert.equal(belongsToField.get('child_class_field'), 'first');
        });

        TestModel2.find('/v1/testobjects/0').then(function(testModel) {
            return testModel.get('my_belongs_to_field2');
        }).then(function(belongsToField) {
            assert.equal(belongsToField.get('child_class_field'), 'second');
        });
    });
});

test('hasMany pagination works', function(assert) {
    expect(6);
    var TestModel2 = Balanced.Model.extend({
        my_uri_field: '/v1/testobjects/1',
        my_has_many_field: Balanced.Model.hasMany('Balanced.TestModel', 'my_uri_field')
    });

    Balanced.Adapter.addFixtures([
        {
            uri: '/v1/testobjects/10'
        },
        {
            uri: '/v1/testobjects/1',
            items: [
                {
                    basic_field: 123,
                    _type: 'first'
                },
                {
                    basic_field: 234,
                    _type: 'second'
                }
            ],
            next_uri: '/v1/testobjects/1?page=2'
        },
        {
            uri: '/v1/testobjects/1?page=2',
            items: [
                {
                    basic_field: 123,
                    _type: 'first'
                },
                {
                    basic_field: 234,
                    _type: 'second'
                }
            ],
            next_uri: '/v1/testobjects/1?page=3'
        },
        {
            uri: '/v1/testobjects/1?page=3',
            items: [
                {
                    basic_field: 123,
                    _type: 'first'
                }
            ],
            next_uri: null
        }
    ]);

    Ember.run(function () {
        TestModel2.find('/v1/testobjects/10').then(function(testModel) {
            return testModel.get('my_has_many_field');
        }).then(function(hasManyArray) {
            assert.equal(hasManyArray.get('length'), 2);
            assert.ok(hasManyArray.get('hasNextPage'));

            return hasManyArray.loadNextPage();
        }).then(function(hasManyArray) {
            assert.equal(hasManyArray.get('length'), 4);
            assert.ok(hasManyArray.get('hasNextPage'));

            return hasManyArray.loadNextPage();
        }).then(function(hasManyArray) {
            assert.equal(hasManyArray.get('length'), 5);
            assert.ok(!hasManyArray.get('hasNextPage'));
        });
    });
});