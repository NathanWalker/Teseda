/*
Static Text Service
returns an object of key/value pairs for all the text you could ever want

Example Usage: <p data-ng-bind-html="statictext.nearby.search"></p>
*/
angular.module("StaticText", []).factory("StaticTextService", function() {
  var bindDefaults, statictext;

  statictext = {
    accountSettings: {
      defaultName: "Unnamed Account",
      updated: 'Your account info has been updated.',
      thirdPartyNotice: 'Warning: You have disabled all connected networks. If you do not know your username and password, please set them now.'
    },
    errors: {
      general: "An error occurred."
    },
    login: {
      errorMsg: "You must enter a valid username and password.",
      errorUnauthorized: "Please login first."
    },
    sidebar: {
      wraps: "Wraps",
      createwrap: "Make another wrap",
      findwraps: "Nearby",
      bindable: {}
    },
    share: {
      title: 'Share via...'
    },
    offline: {
      notice: "You are offline right now. Try again later."
    },
    appCache: {
      updateReady: "An update is available. Would you like to refresh the page and load it now?"
    },
    formTermsAndConditionsAgreement: "By confirming with any option above, you agree to our <a data-static-bind-click=\"showTerms:true\">Terms and Conditions</a>.",
    validation: {
      account: {
        loginBlank: "Your username cannot be blank.",
        loginSpace: "Your username cannot contain a space.",
        loginMatch: "If you're going to use an email address as your username, it must match your email address here.",
        loginAlreadyTaken: function(type) {
          return "That " + (type === 'email' ? 'email address' : 'login') + " is already being used.";
        },
        passwordBlank: "Your password cannot be blank.",
        passwordMatch: "Passwords must match.",
        passwordLength: "Your password must be at least 6 characters.",
        passwordNeedNumber: "Your password must have at least 1 number."
      }
    }
  };
  bindDefaults = {};
  _.defaults(statictext, bindDefaults);
  return statictext;
});
