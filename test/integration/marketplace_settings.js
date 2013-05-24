module("Marketplaces Settings");

test("can update marketplace info", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();
    // click the button to edit marketplace info
    $(".marketplace-info a.edit").click();
    // change the text for marketplace name
    $("#edit-marketplace-info .modal-body input").first().val("TEST").trigger('keyup');
    // click save
    $("#edit-marketplace-info .modal-footer button")[1].click();

    // Marketplace name should have changed
    equal($(".marketplace-info div.control-group:nth-child(2) .inline-label").text().trim(), "TEST");
});

test("can create bank accounts", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();

    equal($(".bank-account-info .sidebar-items li").length, 0);

    // click the button to add a bank account
    $(".bank-account-info a.add").click();
    // fill out information
    $("#add-bank-account .modal-body input").eq(0).val("TEST").trigger('keyup');
    $("#add-bank-account .modal-body input").eq(1).val("123").trigger('keyup');
    $("#add-bank-account .modal-body input").eq(2).val("123123123").trigger('keyup');
    $("#add-bank-account .modal-body input").eq(3).val("checking").trigger('keyup');

    // click save
    $("#add-bank-account .modal-footer button")[1].click();

    // check that the bank account is displayed
    equal($(".bank-account-info .sidebar-items li").length, 1);
});

test("shows webhooks", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();
    equal($("ul.webhooks li").length, 2);
});

test("can delete webhooks", function () {
    $("#marketplaces ul a:contains('Test Marketplace')").click();
    equal($("ul.webhooks li").length, 2);
    // click the link to delete the webhook
    $("ul.webhooks li").first().find("a").click();
    // click OK
    $("#delete-callback .modal-footer button")[1].click();

    // now there should only be one
    equal($("ul.webhooks li").length, 1);
});
