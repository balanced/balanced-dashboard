IndexRoute = Balanced.AuthRoute.extend
  redirect: ->
    sessions = @controllerFor("sessions")

    if sessions.get("isUserRegistered")
      @transitionTo('marketplaces')
    else
      @transitionTo("login")

`export default IndexRoute;`
