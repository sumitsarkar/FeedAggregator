Template.appContent.onCreated(function() {
	var self = this;
	self.autorun(function() {
		var feedId = FlowRouter.getParam('feedId');
		self.subscribe('feedsArticles', feedId);
	});
});