/*   
   We are registering a global subscriptions as soon as the user logs in. We'll move to a different pattern later. Maybe something with FlowRouter?
*/

Meteor.startup(function() {
	Session.set('userSubscriptionsReady', false);
	Session.set("feedsReady", false);
});


Accounts.onLogin(function(err, user) {
	Meteor.subscribe("userSubscriptions", function() {
		Session.set("userSubscriptionsReady", true);
	});

	Meteor.subscribe("feeds", function() {
		Session.set("feedsReady", true);
	})
});