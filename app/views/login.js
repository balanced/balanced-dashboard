Balanced.LoginCreateView = Balanced.View.extend({
    click: function(evt) {
        var data = $('#auth-form').serializeObject();
        this.get('controller').send('login', data);
    }
});


Balanced.LoginDestroyView = Balanced.View.extend({
    click: function(evt) {
        this.get('controller').send('logout');
    }
});
