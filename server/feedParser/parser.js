feedParser = function(feedUrl, callback) {
	var FeedParser = Meteor.npmRequire('feedparser');
	var request = Meteor.npmRequire('request');
	var Future = Meteor.npmRequire('fibers/future');

	var future = new Future;

	var meteorBindedMethod = Meteor.bindEnvironment(function(article, CollectionMethod) {
		Meteor.call(CollectionMethod, article, function(err, res) {});
	}, "Failed to bindEnvironment");


	var req = request(feedUrl, {timeout: 10000, pool: false});
	var feedParser = new FeedParser({
		addMeta: false
	})
	req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
    req.setHeader('accept', 'text/html,application/xhtml+xml');

    req.on('error', function(error) {
		future.throw(error);
	});

	req.on('response', function(response) {
		var stream = this;
		if (response.statusCode != 200)
			return this.emit('error', new Error('Bad status code'));
		else
			stream.pipe(feedParser);
	});

	feedParser.on('error', function(error) {
		future.throw(error)
	});

	feedParser.on('readable', Meteor.bindEnvironment(function() {
		meta = feedParser.meta;
		stream = feedParser;
		var newFeedMeta = {
			title: meta.title,
			description: meta.description,
			link: meta.link,
			xmlurl: meta.xmlurl,
			date: meta.date,
			pubdate: meta.pubdate
		};

		// Check for duplicate
		var dupFeedId = checkDuplicateFeed(newFeedMeta.link);
				
		if (dupFeedId) {
			Meteor.call("userSubscriptions_insert", dupFeedId);
			future.return({feedId: dupFeedId, duplicate: true});
		} else {
			// Inserting meta into the Feeds collection
			var feedId = Feeds.insert(newFeedMeta);

			Meteor.call("userSubscriptions_insert", feedId);

			while (item = stream.read()) {
				var article = {
					feedId: feedId,
					title: item.title,
					description: item.description,
					summary: item.summary,
					link: item.link,
					origlink: item.origlink,
					date: item.date,
					pubdate: item.pubdate,
					author: item.author,
					guid: item.guid
				}
				//	Inserting the article
				FeedsArticles.insert(article);
			}

			future.return({feedId: feedId, duplicate: false});
		}
	}), "Failed to bind environment.");

	return future;
		
};