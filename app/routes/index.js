Balanced.IndexRoute = Balanced.Route.extend({
  renderTemplate: function() {
    this.render();
    this.render('header', {
      into: 'application',
      outlet: 'header'
    });
  }
});
