Meteor.publish("userSubscriptions", function() {
	var userId = this.userId;
	return UserSubscriptions.find({userId: userId});
});

Meteor.publish("feeds", function() {
	var sub = this;
	var userId = this.userId;
	var userSubscriptionsHandle;
	//var feeds = UserSubscriptions.findOne({userId: userId});
	//return Feeds.find({_id: {$in: feeds.feeds}});

	function publishFeeds(feeds) {
		console.log(feeds);
		var feedCursor = Feeds.find({_id: {$in: feeds}});;
		Mongo.Collection._publishCursor(feedCursor, sub, 'feeds');
	}



	userSubscriptionsHandle = UserSubscriptions.find({userId: userId}).observeChanges({
		changed: function(id, fields) {
			publishFeeds(fields.feeds);
			sub.changed('userSubscriptions', id, fields)
		}
	});

	sub.ready();
});