FeedsArticles = new Mongo.Collection('feedsArticles');

var Schema =  {};

Schema.FeedsArticle = new SimpleSchema({
	feedId: {
		type: String
	}

})