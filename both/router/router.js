FlowRouter.route('/', {
	middlewares: [],
	subscriptions: function() {

	},
	action:function(){
		FlowLayout.render('appLayout', {body: 'welcome'})
	}
})