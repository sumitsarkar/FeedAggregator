Feeds = new Mongo.Collection('feeds');

var Schemas = {};

Schemas.Feed = new SimpleSchema({
	url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url
	}
});

//Feeds.attachSchema(Schemas.Feed);


// Deny all client side operations

Feeds.deny({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fields, modifier) {
		// update not allowed
		return true;
	},
	remove: function(userId, doc) {
		// remove not allowed
		return true;
	}
});

