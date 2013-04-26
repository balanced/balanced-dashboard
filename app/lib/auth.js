Auth.Config.reopen({
  baseUrl: ENV.BALANCED.AUTH,
  tokenCreateUrl: '/logins',
  tokenDestroyUrl: '/logins/current',

  tokenKey: 'id',
  idKey: 'user_id',
  userModel: Balanced.User,

  // We're using the cookie, so Ember Auth doesn't need to worry about the token
  requestTokenLocation: 'none',

  rememberMe: false,

  authRedirect: true,
  signInRoute: 'login',
  smartSignInRedirect: true,
  signInRedirectFallbackRoute: 'index'
});
