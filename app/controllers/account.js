Balanced.AccountController = Balanced.ObjectController.extend({
  needs: ["marketplace"]
});

Balanced.AccountIndexController = Balanced.ObjectController.extend({
  needs: ["account"]
});

Balanced.AccountCreditsController = Balanced.ObjectController.extend({
  needs: ["account"]
});