FlowRouter.route('/', {
	subscriptions: function() {

	},
	action:function(){
		BlazeLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent'});
	}
});

FlowRouter.route('/channels/:feedId', {
	action: function() {
		BlazeLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent', header: 'header', body: 'articleList'});
	}
});

FlowRouter.route('/channels/:feedId/:articleId', {
	action: function() {
		BlazeLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent', header: 'header', body: 'article'});
	}
});

/*
FlowRouter.route('/new', {
	middlewares: [],
	subscriptions: function() {

	},
	action:function(){
		FlowLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent', content: 'addFeed'});
	}
});
*/
