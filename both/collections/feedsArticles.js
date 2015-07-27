FeedsArticles = new Mongo.Collection('feedsArticles');

var Schema =  {};

Schema.FeedsArticle = new SimpleSchema({
	feedId: {
		type: String
	}

});

FeedsArticles.deny({
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