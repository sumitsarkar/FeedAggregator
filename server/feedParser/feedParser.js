/*

The feedParser exposes a certain set of API endpoints. The idea is to allow the fetching and updation happen asynchronously. The same endpoints will also be used by our background job scheduler to update the feed meta and articles after specified interval of time.

Following are the API methods exposed to the application backend:

fetchMeta();
fetchArticles();


The above mentioned two methods are executed only when a user adds a feed for the first time. Since the user expects to see an immediate response, we'll use these two methods.

updateMeta();
updateArticles();

These methods are used by the job scheduler to update the existing feeds.
We'll combine these two methods to minimize the HTTP call to one instead of two.

*/

/******

	We are using Futures for fetchMeta

*******/
var FeedParser = Meteor.npmRequire('feedparser');
var request = Meteor.npmRequire('request');
var Future = Meteor.npmRequire('fibers/future');

//EventEmitter = Meteor.npmRequire('events').EventEmitter;
eventBus = new EventEmitter();

var getFeeds = function() {
	return Feeds.find({});
};

var compareDates = function(date1, date2) {
	return moment(date1) === moment(date2);
};

var updateFeeds = function() {
	getFeeds().forEach(function(feed) {
		updateFeed(feed);
	});
};

FetchFeed = function(feedUrl) {
	var self = this;
	self.url = feedUrl;
	var req = request(self.url);
	self.feedparser = new FeedParser({
		addmeta: false
	});


	req.on('error', function(error) {
		logger.error(error);
	})

	req.on('response', function(response) {
		var stream = this;
		if (response.statusCode != 200)
			return this.emit('error', new Error('Bad ststus code'));

		stream.pipe(self.feedparser);
	});

	this.feedparser.on('error', function(error) {
		logger.error(error);
	});
};

FetchFeed.prototype.fetchMeta = function() {

	var future = new Future();

	this.feedparser.on('meta', function() {
		meta = this.meta;
		var newFeedMeta = {
			title: meta.title,
			description: meta.description,
			link: meta.link,
			xmlurl: meta.xmlurl,
			date: meta.date,
			pubdate: meta.pubdate
		};
		
		future.return(newFeedMeta);
	});

	return future;
};

FetchFeed.prototype.fetchArticles = function(feedId, CollectionMethod) {
	var meteorBindedMethod = Meteor.bindEnvironment(function(article, CollectionMethod) {
		Meteor.call(CollectionMethod, article, function(err, res){});
	}, "Failed to bindEnvironment");

	this.feedparser.on('readable', function() {
		// This is where the action is
		var stream = this;
		var item;
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
			//	Call method for inserting the article
			meteorBindedMethod(article, CollectionMethod);
		}
	});
};



/*
var updateFeed = function(feed) {
	var updateRequired;

	var req = request(feed.xmlurl);
	var feedparser = new FeedParser({
		addmeta: false
	});

	req.on('error', function(error) {
		logger.error(error);
	})

	req.on('response', function(response) {
		var stream = this;

		if (response.statusCode != 200) 
			return this.emit('error', new Error('Bad ststus code'));

		stream.pipe(feedparser);
	});

	feedparser.on('error', function(error) {
		logger.error(error);
	});

	// Get the meta and check for changes
	feedparser.on('meta', function() {
		meta = this.meta;

		var difference = _.difference(_.values(meta), _.values(feed));

		updateRequired = (difference ? true : false);
	});

	feedparser.on('readable', function() {
		// This is where the action is

		var stream = this;
		var item;

		if (updateRequired){
			while(item = stream.read()) {
				// Compare the item with any existing item(article) and then insert or update.
				console.log(item);
			}	
		}
		
	});
};

updateFeeds();

*/