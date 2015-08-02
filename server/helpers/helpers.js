checkDuplicateFeed = function(link) {
	var dupFeed = Feeds.findOne({
		link: link
	});

	if (!!dupFeed)
		return dupFeed._id;
	else 
		return false;
};

checkExistingSubcription = function(feedId) {
	var sub = UserSubscriptions.findOne({
		userId: Meteor.userId()
	});

	if(sub.feeds.indexOf(feedId) > -1 ) {
		return true
	} else {
		return false
	}
}