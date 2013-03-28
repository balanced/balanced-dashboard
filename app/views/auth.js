Balanced.AuthCreateView = Ember.View.extend({
    click: function(evt) {
        var data = $('#auth-form').serializeObject();
        this.get('controller').send('login', data);
    }

});
