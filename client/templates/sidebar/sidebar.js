Template.sidebar.events({
	"click .js-logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
	}
})