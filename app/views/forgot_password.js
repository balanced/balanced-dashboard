Balanced.ForgotPasswordView = Balanced.View.extend({
  templateName: 'forgotPassword',
  didInsertElement: function() {
    $("body").css("background-color", "#f2f1ec");
    $("input[name=email]").focus();
  },
  willDestroyElement: function() {
    $("body").css("background-color", "#4d4b49");
  }
});