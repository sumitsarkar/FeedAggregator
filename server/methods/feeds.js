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
			xmlurl: feedObject.url
		});

		// Check for existent feed
		if (!feed) {
			// Make call to feedparser API to get metadata and articles.
			var feedparser = new FetchFeed(feedObject.url);
			
			var meta = feedparser.fetchMeta().wait();

			feedId = Feeds.insert(meta);

			// Should we start the article fetch too? :\ Let's do it for now. We'll find a better pattern later!
			
			feedparser.fetchArticles(feedId);
			

			// Update the object with the metadata and insert it into the collection.
			// 
			
			// Return feedId to the client so it can subscribe to the publication.
			return feedId;
		} else {
			// Do nothing. Subscribe user to the collection.

			return "bhag sala. nahi hua";
		}
	}
})