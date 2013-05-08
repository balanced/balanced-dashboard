Balanced.ForgotPasswordView = Balanced.View.extend({
  templateName: 'forgotPassword',
  didInsertElement: function() {
    $("body").addClass("light-bg");
    $("input[name=email]").focus();
  },
  willDestroyElement: function() {
    $("body").removeClass("light-bg");
  }
});