Balanced.WelcomeTransitionView = Balanced.View.extend({
    templateName: 'welcome_transition',

    didInsertElement: function () {
        // HACK: never hard-code the cookie key directly, only doing this to
        // limit scope of migration changes
        if ($.cookie('existing') && !$.cookie('suppressWelcome')) {
            setTimeout(function () {
                $('#welcome-transition').modal('show');
            }, 100);
        }
    },

    hideWelcome: function () {
        $.cookie('suppressWelcome', 1);
        $.removeCookie('existing');
        $('#welcome-transition').modal('hide');
    }
});
