Meteor.methods({
	feeds_addFeed: function(feedObject) {
		check(feedObject.url, String);
		if (!validateUrl(feedObject.url))
			return false;
		/* 
		 * Check if the feed already exists in the Feeds Collection. If it does, don't do an insert. 
		 * Then add that feedId to the UserSubscriptions Collection.
		 * Make a call to the feedparser API to get the metadata.
		 * Update that metadata into the feed document.
		 * Make a call to the feedparser API to get the articles.
		 */

		var feed = Feeds.findOne({
			xmlurl: feedObject.url.split('?')[0]
		});

		var sub = UserSubscriptions.findOne({
			userId: Meteor.userId()
		});

		// Check for existent feed
		if (!feed) {
			// Make call to feedparser API to get metadata and articles.
			try {
				var feedObj = feedParser(feedObject.url).wait();
				return feedObj;
			} catch (e) {
				throw new Meteor.Error("Your URL caused an error.", "Please check if it's a valid RSS feed.");
			}
			
		} else if (sub.feeds.indexOf(feed._id) === -1 ){
			// Do nothing. Subscribe user to the collection.
			Meteor.call("userSubscriptions_insert", feed._id);
			return {feedId: feed._id, duplicate: false};
		} else{
			return {feedId: feed._id, duplicate: true};
		}
	}
})