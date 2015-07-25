Template.sidebar.events({
	"click .js-logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	"click .js-addChannel": function(event) {
		$('.ui.modal').modal('setting', 'closable', false).modal({
			blurring: true
		})
		.modal('show');
	}
})