FlowRouter.route('/', {
	subscriptions: function() {

	},
	action:function(){
		BlazeLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent'});
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
