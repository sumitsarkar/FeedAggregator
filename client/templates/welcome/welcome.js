Template.welcome.onRendered(function() {
	
});


Template.welcome.events({
	'click .js-login': function(event) {
		event.preventDefault();

		Meteor.loginWithGoogle({
			requestPermissions: ['email'],
			loginStyle: "popup"
		}, function(err) {
			if (err) {
				console.log(err);
			}
		});
	}
})