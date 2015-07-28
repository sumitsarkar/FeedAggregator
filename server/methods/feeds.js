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
			
			feedparser.fetchMeta();
			console.log('meta lene ko bola');

			eventBus.on('metaDownloaded', Meteor.bindEnvironment(function(meta) {
				var feedId;
				console.log('mil gaya re meta');

				// Insert the feed meta into the Feeds collection
				feedId = Feeds.insert(meta);

				// Add the feedId to the UserSubscriptions collection
				// 
				// 
				// 
				
				// Emit and event on the client eventBus to allow the user to subscribe to the feed 
				// 
				// 
				// 
			}, function() {
				console.log('Failed to bind environment');
			}));

			return "ghanta";

			// Update the object with the metadata and insert it into the collection.
		} else {
			// Do nothing. Subscribe user to the collection.

			return "bhag sala. nahi hua";
		}
	}
})