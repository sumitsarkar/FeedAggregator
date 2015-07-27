Feeds = new Mongo.Collection('feeds');

var Schemas = {};

Schemas.Feed = new SimpleSchema({
	url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url
	}
});

Feeds.attachSchema(Schemas.Feed);


// Deny all client side operations

Feeds.deny({
	insert: function (userId, doc) {
	    return true;
	},
	update: function (userId, doc, fields, modifier) {
		// update not allowed
		return true;
	},
	remove: function (userId, doc) {
		// remove not allowed
		return true;
	}
});

Meteor.methods({
	addFeed: function(feedObject) {
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
			url: feedObject.url
		});

		// Check for existent feed
		if (!feed) {
			// Make call to feedparser API to get metadata and articles.

			// Update the object with the metadata and insert it into the collection.
		} else {
			// Do nothing. Subscribe user to the collection.
		}
	}
})