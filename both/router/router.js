FlowRouter.route('/', {
	middlewares: [],
	subscriptions: function() {

	},
	action:function(){
		FlowLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent'});
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
