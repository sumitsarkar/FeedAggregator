var FeedParser = Meteor.npmRequire('feedparser');
var request = Meteor.npmRequire('request');
var logger = Meteor.npmRequire('winston');

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




/*

var req = request('http://feeds2.feedburner.com/tympanus'),
  feedparser = new FeedParser({
    addmeta: false,
  });

req.on('error', function(error) {
  // handle any request errors
});
req.on('response', function(res) {
  var stream = this;

  if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

  stream.pipe(feedparser);
});


feedparser.on('error', function(error) {
  // always handle errors
});
feedparser.on('readable', function() {
  // This is where the action is!
  var stream = this,
    meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
    ,
    item;

  while (item = stream.read()) {
    
  }
});

*/