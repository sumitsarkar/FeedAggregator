Template.article.onCreated(function() {
	var self = this;
	self.autorun(function() {
		var feedId = FlowRouter.getParam('feedId');
		var articleId = FlowRouter.getParam('articleId')
		self.subscribe('feedsArticle', feedId, articleId);
	});
});

Template.article.helpers({
	getArticle: function() {
		//var feedId = FlowRouter.params('feedId');
		var articleId = FlowRouter.getParam('articleId')
		return FeedsArticles.findOne({
			_id: articleId
		}, {
			sort: {
				date: -1
			}
		});
	},

	getDateString: function(date) {
		return moment(date).format("Do MMM YY");
	},

	postProcessing: function() {

	}
});

Template.article.onRendered(function() {
	var x = document.getElementsByTagName('*');
	removeStyle(x);

	var pre = $("pre");
	var code = $("code");
	if (!pre.hasClass('prettyprint'))
		pre.addClass('prettyprint');

	if (!code.hasClass('prettyprint'))
		code.addClass('prettyprint');
 		
	if (prettyPrint)
		prettyPrint();

	$("div.feedflare").remove();
});

Template.article.events({
	
});