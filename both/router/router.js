FlowRouter.route('/', {
	middlewares: [],
	subscriptions: function() {

	},
	action:function(){
		FlowLayout.render('appLayout', {sidebar: 'sidebar', appContent: 'appContent'});
	}
});

