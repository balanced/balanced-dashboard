
test("a Marketplace has access to the localStore store", function () {
    var marketplace = Balanced.Marketplace.create();
    ok(marketplace.get('store') instanceof Balanced.Store, "marketplace's store is a Store");
});

test("when a Marketplace's name changes it automatically saves", function () {
    var marketplace = Balanced.Marketplace.create();
    var update = sinon.stub(marketplace.get('store'), 'update');

    Ember.run(function () {
        marketplace.set('name', 'a new name');
    });

    ok(update.calledOnce);

    update.restore();
});

test("the Marketplace constructor has access to the store", function () {
    ok(Balanced.Marketplace.store instanceof Balanced.Store, "Marketplace store is a Store");
});

test("creating a Marketplace proxies to the store", function () {
    var create = sinon.stub(Balanced.Marketplace.store, 'createRecord'),
        properties = {title: 'hi'};
    Balanced.Marketplace.createRecord(properties);

    ok(create.calledOnce);
    create.restore();
});

test("destroying a Marketplace proxies to the store", function () {
    var destroy = sinon.stub(Balanced.Marketplace.store, 'destroy'),
        marketplace = Balanced.Marketplace.createRecord();

    Balanced.Marketplace.destroy(marketplace);
    ok(destroy.calledOnce);
    destroy.restore();
});

test("asking for all marketplaces proxies to the store", function () {
    var all = sinon.stub(Balanced.Marketplace.store, 'all');
    Balanced.Marketplace.all();

    ok(all.calledOnce);
    all.restore();
});
