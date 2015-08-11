Template.articleList.onCreated(function() {
	var self = this;
	self.autorun(function() {
		var feedId = FlowRouter.getParam('feedId');
		self.subscribe('feedsArticlesList', feedId);
	});
});

Template.articleList.helpers({
	getArticlesList: function() {
		var feedId = FlowRouter.getParam('feedId');
		return FeedsArticles.find({feedId: feedId});
	},

	getDateString: function(date) {
		return moment(date).format("Do MMM YY");
	}
});