checkDuplicateFeed = function(link) {
	var dupFeed = Feeds.findOne({
		link: link
	});

	if (!!dupFeed)
		return dupFeed._id;
	else 
		return false;
}