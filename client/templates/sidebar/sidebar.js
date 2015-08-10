Template.sidebar.events({
	"click .js-logout": function(event) {
		event.preventDefault();
		Meteor.logout();
	},

	// A tightly coupled form. We'll move it to a separate `submit` event later. For now let's focus on rapid delivery.

	"click .js-addChannel": function(event) {
		event.preventDefault();
		$(".js-rssUrl").parent().removeClass('error')
		vex.dialog.open({
			message: 'Add a new feed:',
			input: '<input type="url" name="url" class="js-rssUrl" placeholder="URL" required />\n',
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, {
					text: 'Submit'
				}), $.extend({}, vex.dialog.buttons.NO, {
					text: 'Back'
				})
			],
			callback: function(data) {
				if (data === false) {
					return null;
				}

				if (!validateUrl(data.url)) {
					toastr.error("Please type a valid url.", "Invalid URL");
					return null;
				} else {
					Meteor.call("feeds_addFeed", data, function(err, result) {
						if (err) {
							toastr.error("Please type a valid url.", "Invalid URL");
							return;
						}

						if (result.duplicate === true) {
							toastr.warning("Please don't add duplicate feeds.", "Duplicate feed");
						} else if (result.duplicate === false) {
							toastr.success("Feed Added to your subscriptions.", "Success");
						}
					})
				}
			}
		});
	},

	"click .js-removeChannel": function(event) {
		event.preventDefault();
		event.stopPropagation();
		var title = $(event.target).closest('.content').text();
		var feedId = $(event.target).closest('a.js-channelItem').prop('id');
		console.log(feedId)
		vex.dialog.confirm({
			message: 'Are you absolutely sure you want to unsubscribe from the feed ' + title + ' ?',
			callback: function(value) {
				if (value) {
					Meteor.call('feeds_removeFeed', feedId, function(err,result) {
						if (err) {
							toastr.error("Woops! Something wrong happened.")
							return;
						}

						if (result) {
							toastr.success('Unsubscribed successfully.');
						}
					});
				}
			}
		});

	},

	"click .js-channelItem": function(event) {
		$(".js-channelItem").siblings().removeClass('active');
		$(event.target).closest('a.js-channelItem').addClass('active');
	}
});

Template.sidebar.helpers({
	isFeedsReady: function() {
		return Session.get("feedsReady");
	},
	isActive: function(feedId) {
		var feedIdParam = FlowRouter.getParam("feedId");
		if (feedIdParam === feedId) {
			return "active"
		}
		return "";
	},
	subscriptions: function() {
		return UserSubscriptions.find({});
	},

	feeds: function() {
		return Feeds.find({});
	}
})