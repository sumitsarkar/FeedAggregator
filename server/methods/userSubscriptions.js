Meteor.methods({
	userSubscriptions_insert: function(feedId) {
		check(feedId, String);

		// Push the `feedId` into the `feeds` array of the document

		UserSubscriptions.update({
			userId: Meteor.userId()
		}, {
			$addToSet: {
				feeds: feedId
			}
		});
	},
	userSubscriptions_remove: function(feedId) {
		check(feedId, String);

		// Pull the `feedId` from the `feeds` array of the document

		UserSubscriptions.update({
			userId: Meteor.userId()
		}, {
			$pull: {
				feeds: feedId
			}
		});
	}
})