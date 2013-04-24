Auth.Config.reopen({
  baseUrl: ENV.BALANCED.AUTH,
  tokenCreateUrl: '/logins',
  // TODO
  tokenDestroyUrl: '/users/sign_out',

  tokenKey: 'id',
  idKey: 'id',
  userModel: Balanced.User,

  authRedirect: true,
  signInRoute: 'login',
  smartSignInRedirect: true,
  signInRedirectFallbackRoute: 'index'
});
