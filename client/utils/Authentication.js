var ServerRequests = require('./ServerRequests');
var Login = require('../routes/Login');

var Authentication = {
	statics: {
		willTransitionTo: function(transition){
			console.log("Authentication");

			console.log(ServerRequests.currentUser());

			if(!ServerRequests.loggedIn()){
				Login.attemptedTransition = transition;
				transition.redirect('/login');

				ServerRequests.refreshUser();
			}
		}
	}
};

module.exports = Authentication;