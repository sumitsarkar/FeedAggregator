Feeds = new Mongo.Collection('feeds');

var Schemas = {};

Schemas.Feed = new SimpleSchema({
	url: {
		type: String,
		regEx: SimpleSchema.RegEx.Url
	}
});

Feeds.attachSchema(Schemas.Feed);

Meteor.methods({
	addFeed: function() {
		
	}
})