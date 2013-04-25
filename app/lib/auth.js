Auth.Config.reopen({
  baseUrl: ENV.BALANCED.AUTH,
  tokenCreateUrl: '/sign_in',
  tokenDestroyUrl: '/sign_out',

  tokenKey: 'token',
  idKey: 'user_id',
  userModel: Balanced.User,

  requestTokenLocation: 'authHeader',
  requestHeaderKey: 'Basic',

  rememberMe: true,
  rememberTokenKey: 'remember_token',
  rememberPeriod: 14,
  rememberAutoRecall: true,
  rememberAutoRecallRouteScope: 'both',

  authRedirect: true,
  signInRoute: 'login',
  smartSignInRedirect: true,
  signInRedirectFallbackRoute: 'index'
});
