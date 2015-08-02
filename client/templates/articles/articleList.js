Template.articleList.helpers({
	getArticlesList: function() {
		return FeedsArticles.find({}, {sort: {date: -1}});
	},

	getDateString: function(date) {
		return moment(date).format("Do MMM YY");
	}
});