Template.article.helpers({
	getArticle: function() {
		//var feedId = FlowRouter.params('feedId');
		var articleId = FlowRouter.getParam('articleId')
		return FeedsArticles.findOne({_id: articleId}, {sort: {date: -1}});
	},

	getDateString: function(date) {
		return moment(date).format("Do MMM YY");
	}
});

Template.article.onRendered(function() {
	var x = document.getElementsByTagName('*');
	removeStyle(x);
});