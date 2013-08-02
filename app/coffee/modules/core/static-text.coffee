
###
Static Text Service
returns an object of key/value pairs for all the text you could ever want

Example Usage: <p data-ng-bind-html="statictext.nearby.search"></p>
###
angular.module("StaticText", []).factory "StaticTextService", ->
  statictext =

    accountSettings:
      defaultName: "Unnamed Account"
      updated:'Your account info has been updated.'
      thirdPartyNotice:'Warning: You have disabled all connected networks. If you do not know your username and password, please set them now.'

    errors:
      general: "An error occurred."

    login:
      errorMsg: "You must enter a valid username and password."
      errorUnauthorized: "Please login first."

    offline:
      notice: "You are offline right now. Try again later."

    appCache:
      updateReady: "An update is available. Would you like to refresh the page and load it now?"

  bindDefaults = {}


  # include bind default
  _.defaults statictext, bindDefaults
  statictext
