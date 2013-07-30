Balanced.LoginView = Balanced.View.extend({
    templateName: 'login',
    didInsertElement: function () {
        $('body').addClass('light-bg');
        $('footer').css('display', 'none');
        $('#content').addClass('no-min-height');
        $('input[name=email]').focus();

        // Remove cookie used for welcome transition which is now removed
        $.removeCookie('suppressWelcome');
    },
    willDestroyElement: function () {
        $('body').removeClass('light-bg');
        $('footer').css('display', 'block');
        $('#content').removeClass('no-min-height');
    }
});
