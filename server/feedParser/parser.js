feedParser = function(feedUrl, callback) {
	var FeedParser = Meteor.npmRequire('feedparser');
	var request = Meteor.npmRequire('request');
	var Future = Meteor.npmRequire('fibers/future');

	var future = new Future;
	var startReading = false;
	var feedId;

	var fetchMeta = _.once(function(meta) {
		var newFeedMeta = {
			title: meta.title,
			description: meta.description,
			link: meta.link,
			xmlurl: meta.xmlurl ? meta.xmlurl : feedUrl,
			date: meta.date,
			pubdate: meta.pubdate
		};

		// Check for duplicate
		var dupFeedId = checkDuplicateFeed(newFeedMeta.link);
		var duplicate = checkExistingSubcription(dupFeedId);

		if (!!dupFeedId && duplicate) {
			Meteor.call("userSubscriptions_insert", dupFeedId);
			future.return({
				feedId: dupFeedId,
				duplicate: true
			});
			return {
				duplicate: true
			}
		} else if (!!dupFeedId && !duplicate) {
			Meteor.call("userSubscriptions_insert", dupFeedId);
			future.return({
				feedId: dupFeedId,
				duplicate: false
			});
			return {
				duplicate: false
			}
		} else {
			// Inserting meta into the Feeds collection
			feedId = Feeds.insert(newFeedMeta);
			Meteor.call("userSubscriptions_insert", feedId);
			future.return({
				feedId: feedId,
				duplicate: false
			});
			return {
				feedId: feedId,
				duplicate: false
			}
		}
	});

	var meteorBindedMethod = Meteor.bindEnvironment(function(article, CollectionMethod) {
		Meteor.call(CollectionMethod, article, function(err, res) {});
	}, "Failed to bindEnvironment");


	var req = request(feedUrl, {
		timeout: 10000,
		pool: false
	});
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

		var result = fetchMeta(meta);
		if (!!result.feedId) {
			while (item = stream.read()) {
				var article = {
					feedId: result.feedId,
					title: item.title,
					description: item.description,
					summary: item.summary,
					image: item.image,
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
		}
	}, "Failed to bind environment."));

	return future;
};


/*

The feedUpdate will itself be a job which will in trun add more jobs to the job queue to get the latest feeds, update old feeds etc.

*/



feedUpdate = function() {
	// Get all the feeds from the `Feeds` Collection
	var feeds = Feeds.find({});

	feeds.forEach(function(feed) {
		Job.push(new UpdateIndividualFeedJob({
			feed: feed,
		}));
	});
};


updateIndividualFeed = function(oldFeed) {
	var FeedParser = Meteor.npmRequire('feedparser');
	var request = Meteor.npmRequire('request');
	var jsondiffpatch = Meteor.npmRequire('jsondiffpatch');

	// Create a request
	console.log(oldFeed.xmlurl);
	var req = request(oldFeed.xmlurl, {
		timeout: 10000,
		pool: false
	});

	// Create FeedParser instance
	var feedParser = new FeedParser({
		addMeta: false
	});

	// Set headers for the request. Some sites don't allow non-browsers to crawl the feed.
	req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36')
	req.setHeader('accept', 'text/html,application/xhtml+xml');

	// Handle request error. We'll be logging it.
	req.on('error', function(error) {
		logger.error(error);
	});


	// Pipe the stream to the feedParser.
	req.on('response', function(response) {
		var stream = this;
		if (response.statusCode != 200)
			return this.emit('error', new Error('Bad status code'));
		else
			stream.pipe(feedParser);
	});

	// Handle feedParser error. We'll be logging it.
	feedParser.on('error', function(error) {
		logger.error(error);
	});

	var fetchAndUpdateMeta = _.once(function(meta, oldFeed) {
		var oldMeta = _.omit(oldFeed, '_id');
		var newFeedMeta = {
			title: meta.title,
			description: meta.description,
			link: meta.link,
			xmlurl: meta.xmlurl ? meta.xmlurl : oldMeta.xmlurl,
			date: meta.date,
			pubdate: meta.pubdate
		};


		var diff = jsondiffpatch.diff(oldMeta, newFeedMeta);

		// Since some feeds don't publish any date
		if (diff || !newFeedMeta.date) {
			Feeds.update(oldFeed._id, {
				$set: newFeedMeta
			});
			return true;
		}

		return false;
	});

	feedParser.on('readable', Meteor.bindEnvironment(function() {
		meta = feedParser.meta;
		stream = feedParser;

		var result = fetchAndUpdateMeta(meta, oldFeed);
		if (!!result) {
			while (item = stream.read()) {
				var newArticle = {
					feedId: result.feedId,
					title: item.title,
					description: item.description,
					summary: item.summary,
					image: item.image,
					link: item.link,
					origlink: item.origlink,
					date: item.date,
					pubdate: item.pubdate,
					author: item.author,
					guid: item.guid
				}

				// Find existing article by using guid. I don't know if there's any better way :(

				var oldArticle = FeedsArticles.findOne({
					guid: newArticle.guid
				});

				if (!oldArticle) {
					//	Inserting the newArticle
					FeedsArticles.insert(newArticle);
				} else {
					var oldArticleJson = _.omit(oldArticle, "_id");
					// Let's diff them.
					var diff = jsondiffpatch.diff(oldArticleJson, newArticle);

					if (diff) {
						// Update the oldArticle with the new newArticle
						FeedsArticles.update(oldArticle._id, {
							$set: newArticle
						});
					}
				}
			}
		}
	}, "Failed to bind environment."));

}