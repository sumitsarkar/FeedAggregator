Meteor.publish("userSubscriptions", function() {
	var userId = this.userId;
	if (userId)
		return UserSubscriptions.find({userId: userId});
});


/*
	The `feeds` publication should be reactive to the changes of the `UserSubscriptions` collection. Hence, the use of `observeChanges`. See API docs for more descriptive example.
 */
Meteor.publish("feeds", function() {
	var sub = this;
	var userId = this.userId;
	var userSubscriptionsHandle;

	if (!userId)
		return ;
	
	function publishFeeds(feeds) {
		var feedCursor = Feeds.find({_id: {$in: feeds}});;
		Mongo.Collection._publishCursor(feedCursor, sub, 'feeds');
	}


	// Publish feeds when user first opens the app.
	var userSubsObject = UserSubscriptions.findOne({userId: userId});
	if (userSubsObject.feeds)
		publishFeeds(userSubsObject.feeds);


	userSubscriptionsHandle = UserSubscriptions.find({userId: userId}).observeChanges({
		changed: function(id, fields) {
			publishFeeds(fields.feeds);
			sub.changed('userSubscriptions', id, fields)
		}
	});

	sub.ready();
});

/*
	Publication for articles
*/

Meteor.publish('feedsArticles', function(feedId) {
	var userId = this.userId;
	var subs = UserSubscriptions.findOne({userId: userId}).feeds;
	if (subs.indexOf(feedId) > -1)
		return FeedsArticles.find({feedId: feedId});
});