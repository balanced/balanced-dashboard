Balanced.AuthCreateController = Ember.ObjectController.extend({
    login: function (data) {
        console.log('logging in ', data);
//        Balanced.Auth.
        $.post('http://www.balancedpayments.dev:8000/logins/', data).success(function (r) {
            console.log(r);
        });
    }
});
