Balanced.LoginView = Balanced.View.extend({
  templateName: 'login',
  didInsertElement: function() {
    $("body").addClass("light-bg");
    $("input[name=email]").focus();
  },
  willDestroyElement: function() {
    $("body").removeClass("light-bg");
  }
});