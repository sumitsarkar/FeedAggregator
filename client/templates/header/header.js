Template.header.helpers({
	getFeed: function () {
		var feedId = FlowRouter.getParam('feedId');
		return Feeds.findOne({_id: feedId});
	}
})