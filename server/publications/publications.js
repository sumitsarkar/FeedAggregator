Meteor.publish("userSubscriptions", function() {
	var userId = this.userId;
	return UserSubscriptions.find({userId: userId});
});


/*
	The `feeds` publication should be reactive to the changes of the `UserSubscriptions` collection. Hence, the use of `observeChanges`. See API docs for more descriptive example.
 */
Meteor.publish("feeds", function() {
	var sub = this;
	var userId = this.userId;
	var userSubscriptionsHandle;
	
	function publishFeeds(feeds) {
		var feedCursor = Feeds.find({_id: {$in: feeds}});;
		Mongo.Collection._publishCursor(feedCursor, sub, 'feeds');
	}


	// Publish feeds when user first opens the app.
	var feeds = UserSubscriptions.findOne({userId: userId}).feeds;
	publishFeeds(feeds);


	userSubscriptionsHandle = UserSubscriptions.find({userId: userId}).observeChanges({
		changed: function(id, fields) {
			publishFeeds(fields.feeds);
			sub.changed('userSubscriptions', id, fields)
		}
	});

	sub.ready();
});