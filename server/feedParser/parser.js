var extend = function(child, parent) {
		for (var key in parent) {
			if (hasProp.call(parent, key)) child[key] = parent[key];
		}

		function ctor() {
			this.constructor = child;
		}
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	},
	hasProp = {}.hasOwnProperty;


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
			xmlurl: meta.xmlurl,
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

this.UpdateFeed = (function(superClass) {
	extend(UpdateFeed, superClass);

	function UpdateFeed() {
		console.log('Chut');
		return UpdateFeed.__super__.constructor.apply(this, arguments);
	}

	UpdateFeed.prototype.handleJob = function() {
		UserHistory.insert({title: this.params.feed.title});
		console.log('bhak saala');
		return console.log('Ho gaya kya?');
	};

	return UpdateFeed;

})(Job);

feedUpdate = function() {

	// Get all the feeds from the `Feeds` Collection
	var feeds = Feeds.find({});

	feeds.forEach(function(feed) {
		Job.push(new UpdateFeed({
			feed: feed,
		}));
	});

	/*var fetchMeta = _.once(function(meta, origMetaDate) {
		var newFeedMeta = {
			title: meta.title,
			description: meta.description,
			link: meta.link,
			xmlurl: meta.xmlurl,
			date: meta.date,
			pubdate: meta.pubdate
		};

		// Check if dates are different. If the dates are different, then something has been changed. Then we can parse the rest of the feed. Else, we can just end the request right there.

		if (isSameDate(newFeedMeta.date, origMetaDate)) {
			// End the request right here
			return false;
		} else {
			// Update the meta with the diff and patch it with the new meta and update the meta.
			return true;
		}

	});

	feeds.forEach(function(feed) {
		// Create a request
		var req = request(feed.xmlurl, {
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

	});*/

}