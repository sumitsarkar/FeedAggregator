Template.sidebar.events({
	"click .js-logout" : function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	// A tightly coupled form. We'll move it to a separate `submit` event later. For now let's focus on rapid delivery.

	"click .js-addChannel": function(event) {
		event.preventDefault();
		$(".js-rssUrl").parent().removeClass('error')
		$('.ui.modal').modal({
			closable: false,
			blurring: true,
			onApprove: function() {
				var userInput = $(".js-rssUrl").val();
				if (validateUrl(userInput)) {
					var feedObject = {
						url: userInput
					}

					// Call Meteor method to insert the document.
					// 
					// 
				} else {
					$(".js-rssUrl").parent().addClass('error');
					return false;
				}				
			}
		})
		.modal('show');
	}
});
