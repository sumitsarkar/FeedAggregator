Meteor.methods({
	// We shall use a different method for updating feeds. Since hitting the DB everytime to check duplicates is a no-brainer. That's a waste of time for adding new articles. Instead we'll push them in directly.
	feedsArticles_insert: function(article) {
		return FeedsArticles.insert(article);
	},

	feedsArticles_update: function(article) {
		
	}
})